using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Project;
using backend.Dtos.User;
using backend.Dtos.UserProject;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/projects")] // define the path for controller
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetProjects(int page = 1)
        {
            try
            {
                int perPage = 10;

                var projects = await _context.Projects
                    .Skip((page - 1) * perPage)
                    .Take(perPage)
                    .Include(p => p.Manager)
                    .Include(p => p.Customer)
                    .Include(p => p.ProjectType)
                    .ToListAsync();

                var projectDtos = projects.Select(p => p.ToProjectDto());

                return Ok(projectDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the projects: {ex.Message}"
                });
            }
        }


        [HttpGet("find")]
        public async Task<IActionResult> GetProject(int id)
        {
            try
            {
                var project = await _context.Projects.Include(p => p.Manager).Where(p => p.Id == id).FirstAsync();

                if (project == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }
                return Ok(project.ToProjectDto());
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpGet("projectUsers")]
        public IActionResult GetUsersByProjectID(int projectId)
        {
            try
            {
                var users = _context.UserProjects.Where(up => up.ProjectId == projectId).Include(up => up.User).ToList();

                return Ok(users.Count);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpGet("nonProjectManagers")]
        public IActionResult GetProjectManagers()
        {
            try
            {
                var managers = _context.Projects
                                    .Include(p => p.Manager)
                                    .Select(p => p.Manager.Id)
                                    .Distinct()
                                    .ToList();

                var nonManagers = _context.Users
                    .Where(u => !managers.Contains(u.Id))
                    .ToList();


                return Ok(nonManagers);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpGet("types")]
        public IActionResult GetProjectTypes()
        {
            try
            {
                var projectTypes = _context.ProjectTypes.ToList();

                return Ok(projectTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpGet("management")]
        public async Task<IActionResult> GetProjectWithTasksAndUsers(int id)
        {
            try
            {
                var project = await _context.Projects
                    .Include(p => p.Customer)
                    .Include(p => p.Manager)
                    .Include(p => p.ProjectRequests)
                    .Where(p => p.Id == id)
                    .FirstAsync();

                var projectDto = project.ToProjectDto();

                if (projectDto == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }

                var projectUsers = _context.UserProjects.Where(up => up.ProjectId == id).Select(up => new UserProjectDto
                {
                    id = project.Id,
                    User = up.User.ToUserDto(),
                    ProjectId = up.ProjectId
                }).ToList();

                var users = new List<UserDto>();

                for (var i = 0; i < projectUsers.Count; i++)
                {
                    var userId = projectUsers[i].User.Id;
                    users.Add(_context.Users.Where(u => u.Id == userId).First().ToUserDto());
                }

                var tasks = _context.Tasks
                .Where(d => d.ProjectId == id)
                .Include(t => t.AssignedUser)
                .Include(t => t.TaskLabel)
                .Include(t => t.TaskType)
                .ToList();

                var taskDtos = tasks.Select(t => t.ToTaskDto());

                var groupedTasks = taskDtos
                    .GroupBy(t => t.TaskType.Name)
                    .ToDictionary(g => g.Key, g => g.ToList());

                var minStartDate = taskDtos.Min(t => t.StartDateString);
                var maxDueDate = taskDtos.Max(t => t.DueDateString);

                return Ok(new
                {
                    tasks = taskDtos,
                    groupedTasks,
                    project = projectDto,
                    users,
                    minStartDate,
                    maxDueDate
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpGet("unassigned-developers")]
        public async Task<IActionResult> GetUnassignedDevelopersForProject(int id)
        {
            try
            {
                var assignedUserIds = await _context.UserProjects
                    .Where(up => up.ProjectId == id)
                    .Select(up => up.UserId)
                    .ToListAsync();

                var developers = await _context.Users
                    .Where(u => u.Role == Role.Developer && !assignedUserIds.Contains(u.Id) && u.Status == AvailabilityStatus.Available)
                    .ToListAsync();

                var developerDtos = developers.Select(d => d.ToUserDto());

                return Ok(developerDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"An error occurred: {ex.Message}" });
            }
        }


        [HttpPost("add")]
        public async Task<IActionResult> CreateProject(CreateProjectDto createProjectDto)
        {
            try
            {
                var project = createProjectDto.FromCreateToProject();

                var result = await _context.Projects.AddAsync(project);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();

                    var chatSession = new ChatSession
                    {
                        User1Id = project.ManagerId,
                        User2Id = project.CustomerId,
                        StartedAt = DateTime.UtcNow
                    };

                    await _context.ChatSessions.AddAsync(chatSession);
                    await _context.SaveChangesAsync(); 

                    return Ok(new
                    {
                        message = "Project has been created and ChatSession initialized."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the project: {ex.Message}"
                });
            }
        }


        [HttpPost("add-users-to-project")]
        public async Task<IActionResult> AddUsersToProject(int projectId, [FromBody] List<int> userIds)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);

                if (project == null)
                {
                    return NotFound(new { message = "Project not found." });
                }

                var userProjects = userIds.Select(userId => new UserProject
                {
                    UserId = userId,
                    ProjectId = projectId
                }).ToList();

                await _context.UserProjects.AddRangeAsync(userProjects);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Users added to project successfully." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error while adding users to project: {ex.Message}" });
            }
        }

        [HttpPost("remove-users-from-project")]
        public async Task<IActionResult> RemoveUsersFromProject(int projectId, [FromBody] List<int> userIds)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);
                if (project == null)
                {
                    return NotFound(new { message = "Project not found." });
                }

                var userProjectsToRemove = await _context.UserProjects
                    .Where(up => up.ProjectId == projectId && userIds.Contains(up.UserId))
                    .ToListAsync();

                if (!userProjectsToRemove.Any())
                {
                    return NotFound(new { message = "No matching users found in this project." });
                }

                var tasksToUpdate = await _context.Tasks
                    .Where(t => t.ProjectId == projectId && userIds.Contains(t.UserId ?? 0))
                    .ToListAsync();

                foreach (var task in tasksToUpdate)
                {
                    task.UserId = null;
                    task.AssignedUser = null;
                }

                _context.UserProjects.RemoveRange(userProjectsToRemove);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Users removed from project and their tasks unassigned." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"Error while removing users from project: {ex.Message}" });
            }
        }



        [HttpPut("update")]
        public async Task<IActionResult> UpdateProject(Project projectData, int id)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }

                /* user.Name = userData?.Name ?? user.Name;
                user.Email = userData?.Email ?? user.Email;
                user.ProficiencyLevel = userData?.ProficiencyLevel ?? user.ProficiencyLevel;
                user.Role = userData?.Role ?? user.Role;
                user.Status = userData?.Status ?? user.Status;
                user.Projects = userData?.Projects ?? user.Projects;
                user.Technologies = userData?.Technologies ?? user.Technologies;
                user.AssignedTask = userData?.AssignedTask ?? user.AssignedTask; */

                await _context.SaveChangesAsync();
                return Ok("The project has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the user : {ex.Message}"
                });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProject(int id)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }
                _context.Projects.Remove(project);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Project with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the project : {ex.Message}"
                });
            }
        }
    }
}