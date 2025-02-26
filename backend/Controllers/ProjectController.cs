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
        public async Task<IActionResult> GetProjects()
        {
            try
            {
                var projects = await _context.Projects.ToListAsync();
                return Ok(projects);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the projects : {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetProject(int id)
        {
            try
            {
                var project = await _context.Projects.FindAsync(id);
                if (project == null)
                {
                    return BadRequest(new { message = $"No project found with the id value : {id}" });
                }
                return Ok(project);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateProject(Project project)
        {

            try
            {
                var result = await _context.Projects.AddAsync(project);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "Project has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the project : {ex.Message}"
                });
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