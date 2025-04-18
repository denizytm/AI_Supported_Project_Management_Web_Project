using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Task;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/tasks")] // define the path for controller
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ITaskRepository _taskRepository;

        public TaskController(ApplicationDbContext context, ITaskRepository taskRepository)
        {
            _context = context;
            _taskRepository = taskRepository;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                var tasks = await _context.Tasks
                .Include(t => t.AssignedUser)
                .Include(t => t.TaskLabel)
                .Include(t => t.TaskType)
                .ToListAsync();

                var taskDtos = tasks.Select(t => t.ToTaskDto());

                return Ok(taskDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the tasks: {ex.Message}"
                });
            }
        }

        [HttpGet("get")]
        public IActionResult GetTasksByProjectId(int projectId)
        {
            try
            {
                var tasks = _context.Tasks
                    .Where(d => d.ProjectId == projectId)
                    .Include(t => t.TaskLabel)
                    .Include(t => t.AssignedUser)
                    .Include(t => t.TaskType)
                    .ToList();

                var taskDtos = tasks.Select(t => t.ToTaskDto()).ToList(); // get the task dto's

                var minStartDate = taskDtos.Min(t => t.StartDate);
                var maxDueDate = taskDtos.Max(t => t.DueDate);

                var groupedTasks = taskDtos
                    .GroupBy(t => t.TaskType.Name) // group them by their taskName.Name
                    .ToDictionary(g => g.Key, g => g.ToList()); // and return it as a dict

                return Ok(new
                {
                    groupedTasks,
                    minStartDate,
                    maxDueDate
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the tasks: {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return BadRequest(new { message = $"No task found with the id value : {id}" });
                }
                return Ok(task);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the task : {ex.Message}"
                });
            }
        }

        [HttpGet("formData")]
        public IActionResult GetFormDataForTask()
        {

            try
            {
                var taskTypes = _context.TaskTypes.ToList();
                var taskLabels = _context.TaskLabels.ToList();

                return Ok(new
                {
                    taskLabels,
                    taskTypes
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the types and labels : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateTask(CreateTaskDto createTaskDto)
        {
            try
            {

                var taskTypeData = await _context.TaskTypes
                    .FirstOrDefaultAsync(tt => tt.Name == createTaskDto.TaskTypeName);

                if (taskTypeData == null)
                {
                    taskTypeData = new TaskType { Name = createTaskDto.TaskTypeName };
                    await _context.TaskTypes.AddAsync(taskTypeData);
                    await _context.SaveChangesAsync(); 
                }

                var taskLabelData = await _context.TaskLabels
                    .FirstOrDefaultAsync(tl => tl.Label == createTaskDto.TaskLabelName);

                if (taskLabelData == null)
                {
                    taskLabelData = new TaskLabel { Label = createTaskDto.TaskLabelName };
                    await _context.TaskLabels.AddAsync(taskLabelData);
                    await _context.SaveChangesAsync(); 
                }

                await _context.SaveChangesAsync();

                taskTypeData = await _context.TaskTypes.FirstOrDefaultAsync(tt => tt.Name == createTaskDto.TaskTypeName);
                taskLabelData = await _context.TaskLabels.FirstOrDefaultAsync(tl => tl.Label == createTaskDto.TaskLabelName);

                var taskData = createTaskDto.fromCreateDtoToTask(taskTypeData, taskLabelData);

                var result = await _context.Tasks.AddAsync(taskData);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "Task has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the task : {ex.Message}"
                });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateTask(UpdateTaskDto updateTaskDto, int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return BadRequest(new { message = $"No task found with the id value : {id}" });
                }

                var taskTypeData = await _context.TaskTypes
                    .FirstOrDefaultAsync(tt => tt.Name == updateTaskDto.TaskTypeName);

                if (taskTypeData == null)
                {
                    taskTypeData = new TaskType { Name = updateTaskDto.TaskTypeName };
                    await _context.TaskTypes.AddAsync(taskTypeData);
                    await _context.SaveChangesAsync(); 
                }

                var taskLabelData = await _context.TaskLabels
                    .FirstOrDefaultAsync(tl => tl.Label == updateTaskDto.TaskLabelName);

                if (taskLabelData == null)
                {
                    taskLabelData = new TaskLabel { Label = updateTaskDto.TaskLabelName };
                    await _context.TaskLabels.AddAsync(taskLabelData);
                    await _context.SaveChangesAsync(); 
                }

                await _context.SaveChangesAsync();

                await _taskRepository.UpdateAsync(id, updateTaskDto,taskLabelData,taskTypeData);

                return Ok("The task has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the task : {ex.Message}"
                });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return BadRequest(new { message = $"No task found with the id value : {id}" });
                }

                var dependedTasks = await _context.Tasks.Where(task => task.TaskId == id).ToListAsync();

                foreach (var taskData in dependedTasks)
                {
                    taskData.TaskId = null;
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Task with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the task : {ex.Message}"
                });
            }
        }
    }
}
