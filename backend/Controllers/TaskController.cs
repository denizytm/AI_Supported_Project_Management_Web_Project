using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
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

        public TaskController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetTasks()
        {
            try
            {
                var tasks = await _context.Tasks.ToListAsync();
                return Ok(tasks);
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
                var tasks = _context.Tasks.Where(d => d.ProjectId == projectId).ToList();
                return Ok(tasks);
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

        [HttpPost("add")]
        public async Task<IActionResult> CreateTask(backend.Models.Task task)
        {
            try
            {
                var result = await _context.Tasks.AddAsync(task);

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
        public async Task<IActionResult> UpdateTask(backend.Models.Task taskData, int id)
        {
            try
            {
                var task = await _context.Tasks.FindAsync(id);
                if (task == null)
                {
                    return BadRequest(new { message = $"No task found with the id value : {id}" });
                }

                /* task.Name = taskData?.Name ?? task.Name;
                task.Description = taskData?.Description ?? task.Description;
                task.Status = taskData?.Status ?? task.Status;
                task.AssignedTo = taskData?.AssignedTo ?? task.AssignedTo;
                task.DueDate = taskData?.DueDate ?? task.DueDate; */

                await _context.SaveChangesAsync();
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
