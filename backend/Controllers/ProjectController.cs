using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Project;
using backend.Dtos.User;
using backend.Dtos.UserProject;
using backend.Hubs;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
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

        [HttpGet("dashboard/get-all")]
        public async Task<IActionResult> GetProjectsForDashboard()
        {
            try
            {
                var projects = await _context.Projects
                    .Include(p => p.Manager)
                    .Include(p => p.Customer)
                    .Include(p => p.ProjectType)
                    .Include(p => p.UserProjects)
                    .ToListAsync();

                var projectDtos = projects.Select(p => p.ToProjectDto()).ToList();

                var generalInfos = new
                {
                    projectCount = projects.Count,
                    finishedProjectCount = projects.Count(p => p.Status == ProjectStatus.Completed),
                    onGoingProjectCount = projects.Count(p => p.Status == ProjectStatus.Active),
                    onHoldProjectCount = projects.Count(p => p.Status == ProjectStatus.OnHold),
                };

                var projectTypes = new
                {
                    erp = projects.Count(p => p.ProjectType.Name == "ERP"),
                    web = projects.Count(p => p.ProjectType.Name == "Web"),
                    mobile = projects.Count(p => p.ProjectType.Name == "Mobile"),
                    application = projects.Count(p => p.ProjectType.Name == "Application"),
                    ai = projects.Count(p => p.ProjectType.Name == "AI")
                };

                return Ok(new
                {
                    projectDtos,
                    generalInfos,
                    projectTypes,
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the projects: {ex.Message}"
                });
            }
        }

        [HttpGet("finance/get-all")]
        public async Task<IActionResult> GetProjetcsForFinance()
        {
            var projects = await _context.Projects
                .Include(p => p.Manager)
                .Include(p => p.Customer)
                .Include(p => p.ProjectType)
                .ToListAsync();

            var projectDtos = projects.Select(p => p.ToProjectDto());
            return Ok(projectDtos);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetProjects(
            int page = 1,
            string? projectType = null,
            string? manager = null,
            string? process = null,
            string? priority = null,
            string? search = null)
        {
            try
            {
                const int perPage = 10;

                var baseQuery = _context.Projects
                    .Include(p => p.Manager)
                    .Include(p => p.Customer)
                    .Include(p => p.ProjectType)
                    .Include(p => p.UserProjects)
                    .AsQueryable();

                if (!string.IsNullOrWhiteSpace(search))
                    baseQuery = baseQuery.Where(p => p.Name.Contains(search));

                if (!string.IsNullOrWhiteSpace(projectType))
                    baseQuery = baseQuery.Where(p => p.ProjectType.Name == projectType);

                if (!string.IsNullOrWhiteSpace(manager))
                    baseQuery = baseQuery.Where(p =>
                        (p.Manager.Name + " " + p.Manager.LastName).Contains(manager));

                if (!string.IsNullOrWhiteSpace(process) && Enum.TryParse<ProjectStatus>(process, out var parsedStatus))
                    baseQuery = baseQuery.Where(p => p.Status == parsedStatus);

                if (!string.IsNullOrWhiteSpace(priority) && Enum.TryParse<ProjectPriority>(priority, out var parsedPriority))
                    baseQuery = baseQuery.Where(p => p.Priority == parsedPriority);

                var filteredProjects = await baseQuery.ToListAsync();

                var pagedProjects = filteredProjects
                    .Skip((page - 1) * perPage)
                    .Take(perPage)
                    .ToList();

                var projectDtos = pagedProjects.Select(p => p.ToProjectDto());

                var generalInfos = new
                {
                    projectCount = filteredProjects.Count,
                    finishedProjectCount = filteredProjects.Count(p => p.Status == ProjectStatus.Completed),
                    onGoingProjectCount = filteredProjects.Count(p => p.Status == ProjectStatus.Active),
                    onHoldProjectCount = filteredProjects.Count(p => p.Status == ProjectStatus.OnHold),
                };

                var projectTypesCount = new
                {
                    erp = filteredProjects.Count(p => p.ProjectType.Name == "ERP"),
                    web = filteredProjects.Count(p => p.ProjectType.Name == "Web"),
                    mobile = filteredProjects.Count(p => p.ProjectType.Name == "Mobile"),
                    application = filteredProjects.Count(p => p.ProjectType.Name == "Application"),
                    ai = filteredProjects.Count(p => p.ProjectType.Name == "AI")
                };

                var managers = filteredProjects
                    .Select(p => p.Manager)
                    .DistinctBy(m => m.Id)
                    .Select(m => m.ToUserDto())
                    .ToList();

                return Ok(new
                {
                    projectDtos,
                    generalInfos,
                    projectTypes = projectTypesCount,
                    managers
                });
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
                var project = await _context.Projects.Include(p => p.Manager).Where(p => p.Id == id).FirstOrDefaultAsync();

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
                    .Where(p => p.Id == id)
                    .Include(p => p.Customer)
                    .Include(p => p.Manager)
                    .Include(p => p.ProjectRequests)
                    .FirstOrDefaultAsync();

                if (project == null)
                {
                    return NotFound(new { message = $"No project found with the id value : {id}" });
                }

                var projectDto = project.ToProjectDto();

                var projectUsers = await _context.UserProjects
                    .Where(up => up.ProjectId == id)
                    .Select(up => up.User.ToUserDto())
                    .ToListAsync();

                var tasks = await _context.Tasks
                    .Where(t => t.ProjectId == id)
                    .Include(t => t.AssignedUser)
                    .Include(t => t.TaskLabel)
                    .Include(t => t.TaskType)
                    .ToListAsync();

                var taskDtos = tasks.Select(t => t.ToTaskDto()).ToList();

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
                    users = projectUsers,
                    minStartDate,
                    maxDueDate
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project: {ex.Message}"
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

        [HttpGet("customer/projects")]
        public async Task<IActionResult> GetProjectsForCustomer([FromQuery] int userId)
        {
            try
            {
                var projects = await _context.Projects
                    .Where(p => p.CustomerId == userId)
                    .Include(p => p.ProjectType)
                    .Include(p => p.Manager)
                    .Include(p => p.Customer)
                    .ToListAsync();

                var projectDtos = projects.Select(p => p.ToProjectDto()).ToList();

                return Ok(projectDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"An error occurred: {ex.Message}" });
            }
        }

        [HttpGet("user-projects")]
        public async Task<IActionResult> GetProjectsByUserId([FromQuery] int userId)
        {
            try
            {
                var userProjects = await _context.UserProjects
                    .Where(up => up.UserId == userId)
                    .Include(up => up.Project)
                        .ThenInclude(p => p.ProjectType)
                    .Include(up => up.Project)
                        .ThenInclude(p => p.Manager)
                    .Include(up => up.Project)
                        .ThenInclude(p => p.Customer)
                    .Include(up => up.Project)
                        .ThenInclude(p => p.UserProjects)
                    .Select(up => up.Project)
                    .ToListAsync();

                var managerProjects = await _context.Projects
                    .Where(p => p.ManagerId == userId)
                    .Include(p => p.ProjectType)
                    .Include(p => p.Manager)
                    .Include(p => p.UserProjects)
                    .Include(p => p.Customer)
                    .ToListAsync();

                var customerProjects = await _context.Projects
                    .Where(p => p.CustomerId == userId)
                    .Include(p => p.ProjectType)
                    .Include(p => p.Manager)
                    .Include(p => p.UserProjects)
                    .Include(p => p.Customer)
                    .ToListAsync();

                var combinedProjects = userProjects
                    .Concat(managerProjects)
                    .Concat(customerProjects)
                    .Distinct()
                    .Select(p => p.ToProjectDto())
                    .ToList();

                var managers = await _context.Projects
                    .Include(p => p.Manager)
                    .Select(p => p.Manager)
                    .Distinct()
                    .ToListAsync();

                return Ok(new
                {
                    projectDtos = combinedProjects,
                    managers
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = $"An error occurred while fetching user's projects: {ex.Message}" });
            }
        }


        [HttpPost("add")]
        public async Task<IActionResult> CreateProject(CreateProjectDto createProjectDto, [FromServices] IHubContext<ChatHub, IChatClient> hubContext)
        {
            try
            {
                var project = createProjectDto.FromCreateToProject();

                var result = await _context.Projects.AddAsync(project);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();

                    var existingSession = await _context.ChatSessions
                        .Where(c =>
                            (c.User1Id == project.ManagerId && c.User2Id == project.CustomerId) ||
                            (c.User2Id == project.ManagerId && c.User1Id == project.CustomerId)
                        )
                        .FirstOrDefaultAsync(); 

                    if (existingSession == null)
                    {
                        var chatSession = new ChatSession
                        {
                            User1Id = project.ManagerId,
                            User2Id = project.CustomerId,
                            StartedAt = DateTime.UtcNow
                        };

                        await _context.ChatSessions.AddAsync(chatSession);
                        await _context.SaveChangesAsync();
                    }

                    var managerNotification = new Notification
                    {
                        TargetUserId = project.ManagerId,
                        Title = "Project Assignment",
                        Message = "You've been added to a new project as a manager.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        Link = $"/projects/management?id={project.Id}"
                    };

                    await _context.Notifications.AddAsync(managerNotification);

                    if (ChatHub.UserConnections.TryGetValue(project.ManagerId, out var managerConnectionId))
                    {
                        var dto = managerNotification.FromModelToDto();
                        await hubContext.Clients.Client(managerConnectionId).ReceiveNotification(dto);
                    }

                    var customerNotification = new Notification
                    {
                        TargetUserId = project.CustomerId,
                        Title = "New Project Created",
                        Message = "A new project has been created for you.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        Link = $"/client"
                    };

                    await _context.Notifications.AddAsync(customerNotification);

                    if (ChatHub.UserConnections.TryGetValue(project.CustomerId, out var customerConnectionId))
                    {
                        var dto = customerNotification.FromModelToDto();
                        await hubContext.Clients.Client(customerConnectionId).ReceiveNotification(dto);
                    }

                    await _context.SaveChangesAsync();

                    return Ok(new
                    {
                        message = "Project created, chat session initialized, and notifications sent."
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
        public async Task<IActionResult> AddUsersToProject(int projectId, [FromBody] List<int> userIds, [FromServices] IHubContext<ChatHub, IChatClient> hubContext)
        {
            try
            {
                var project = await _context.Projects.FindAsync(projectId);

                if (project == null)
                    return NotFound(new { message = "Project not found." });

                var userProjects = userIds.Select(userId => new UserProject
                {
                    UserId = userId,
                    ProjectId = projectId
                }).ToList();

                await _context.UserProjects.AddRangeAsync(userProjects);
                await _context.SaveChangesAsync();

                foreach (var userId in userIds)
                {
                    var notification = new Notification
                    {
                        TargetUserId = userId,
                        Title = "Project Assignment",
                        Message = $"You've been added to a new project.",
                        CreatedAt = DateTime.UtcNow,
                        IsRead = false,
                        Link = $"/projects/management?id={project.Id}"
                    };

                    await _context.Notifications.AddAsync(notification);

                    if (ChatHub.UserConnections.TryGetValue(userId, out var connectionId))
                    {
                        var dto = notification.FromModelToDto();
                        await hubContext.Clients.Client(connectionId).ReceiveNotification(dto);
                    }
                }

                await _context.SaveChangesAsync();

                return Ok(new { message = "Users added to project and notified successfully." });
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
        public async Task<IActionResult> UpdateProject([FromBody] EditProjectDto editProjectDto, int id)
        {

            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }

                // Güncelleme işlemleri
                project.Name = editProjectDto.Name;
                project.Description = editProjectDto.Description;
                project.ProjectTypeId = editProjectDto.ProjectTypeId;
                project.StartDate = editProjectDto.StartDate;
                project.Deadline = editProjectDto.Deadline;
                project.Priority = Enum.Parse<ProjectPriority>(editProjectDto.PriorityName);
                project.Status = Enum.Parse<ProjectStatus>(editProjectDto.StatusName);
                project.ManagerId = editProjectDto.ManagerId;
                project.CustomerId = editProjectDto.CustomerId;
                project.Budget = editProjectDto.Budget;

                await _context.SaveChangesAsync();
                return Ok("The project has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the project: {ex.Message}"
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