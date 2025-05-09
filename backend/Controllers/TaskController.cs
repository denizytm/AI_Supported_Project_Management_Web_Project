using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Task;
using backend.Dtos.User;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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
                var task = await _context.Tasks
                    .Include(t => t.TaskLabel)
                    .Include(t => t.TaskType)
                    .FirstOrDefaultAsync(t => t.Id == id);

                if (task == null)
                {
                    return BadRequest(new { message = $"No task found with the id value : {id}" });
                }

                var taskDto = task.ToTaskDto();

                return Ok(taskDto);
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
        public async Task<IActionResult> CreateTask(CreateTaskDto createTaskDto, [FromServices] IHubContext<ChatHub, IChatClient> hubContext)
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

                var task = createTaskDto.fromCreateDtoToTask(taskTypeData, taskLabelData);
                var result = await _context.Tasks.AddAsync(task);
                await _context.SaveChangesAsync();

                var projectTasks = await _context.Tasks.Where(t => t.ProjectId == task.ProjectId).ToListAsync();
                var total = projectTasks.Count;
                var doneCount = projectTasks.Count(t => t.Status == TaskStatus.Done);
                var progress = total > 0 ? (int)Math.Round((double)(doneCount * 100) / total) : 0;

                var project = await _context.Projects.FindAsync(task.ProjectId);
                if (project != null)
                {
                    project.Progress = progress;
                    await _context.SaveChangesAsync();
                }

                if (task.UserId.HasValue && ChatHub.UserConnections.TryGetValue(task.UserId.Value, out var connectionId))
                {
                    var taskDto = task.ToTaskDto();
                    await hubContext.Clients.Client(connectionId).ReceiveTaskAssignment(taskDto);
                }

                return Ok(new { message = "Task has been created." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"An error occurred while creating the task : {ex.Message}" });
            }
        }



        [HttpPut("update")]
        public async Task<IActionResult> UpdateTask(UpdateTaskDto updateTaskDto, int id, [FromServices] IHubContext<ChatHub, IChatClient> hubContext)
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

                await _taskRepository.UpdateAsync(id, updateTaskDto, taskLabelData, taskTypeData);


                var projectTasks = await _context.Tasks
                    .Where(t => t.ProjectId == task.ProjectId)
                    .ToListAsync();

                var total = projectTasks.Count;
                var doneCount = projectTasks.Count(t => t.Status == TaskStatus.Done);

                var progress = total > 0 ? (int)Math.Round((double)(doneCount * 100) / total) : 0;

                var project = await _context.Projects.FindAsync(task.ProjectId);
                if (project == null)
                {
                    return BadRequest(new { message = "Project not found for the updated task." });
                }

                project.Progress = progress;
                await _context.SaveChangesAsync();

                var notification = new Notification
                {
                    TargetUserId = project.ManagerId,
                    Title = "Task Updated",
                    Message = $"A task in project \"{project.Name}\" was updated.",
                    CreatedAt = DateTime.UtcNow,
                    IsRead = false,
                    Link = $"/projects/management?id={project.Id}"
                };

                await _context.Notifications.AddAsync(notification);
                await _context.SaveChangesAsync();


                if (ChatHub.UserConnections.TryGetValue(project.ManagerId, out var connectionId))
                {
                    var dto = notification.FromModelToDto();
                    await hubContext.Clients.Client(connectionId).ReceiveNotification(dto);
                }


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

                int? projectId = task.ProjectId;

                var dependedTasks = await _context.Tasks
                    .Where(t => t.TaskId == id)
                    .ToListAsync();

                foreach (var taskData in dependedTasks)
                {
                    taskData.TaskId = null;
                }

                _context.Tasks.Remove(task);
                await _context.SaveChangesAsync();

                if (projectId.HasValue)
                {
                    var projectTasks = await _context.Tasks
                        .Where(t => t.ProjectId == projectId)
                        .ToListAsync();

                    var total = projectTasks.Count;
                    var doneCount = projectTasks.Count(t => t.Status == TaskStatus.Done);
                    var progress = total > 0 ? (int)Math.Round((double)(doneCount * 100) / total) : 0;

                    var project = await _context.Projects.FindAsync(projectId.Value);
                    if (project != null)
                    {
                        project.Progress = progress;
                        await _context.SaveChangesAsync();
                    }
                }

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
