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
    [Route("api/projecttypes")] // define the path for controller
    [ApiController]
    public class ProjectTypeController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProjectTypeController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetProjectTypes()
        {
            try
            {
                var projectTypes = await _context.ProjectTypes.ToListAsync();
                return Ok(projectTypes);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project types: {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetProjectType(int id)
        {
            try
            {
                var projectType = await _context.ProjectTypes.FindAsync(id);
                if (projectType == null)
                {
                    return BadRequest(new { message = $"No project type found with the id value : {id}" });
                }
                return Ok(projectType);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the project type : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateProjectType(ProjectType projectType)
        {
            try
            {
                var result = await _context.ProjectTypes.AddAsync(projectType);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "Project type has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the project type : {ex.Message}"
                });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateProjectType(ProjectType projectTypeData, int id)
        {
            try
            {
                var projectType = await _context.ProjectTypes.FindAsync(id);
                if (projectType == null)
                {
                    return BadRequest(new { message = $"No project type found with the id value : {id}" });
                }

                /* projectType.Name = projectTypeData?.Name ?? projectType.Name;
                projectType.Description = projectTypeData?.Description ?? projectType.Description; */

                await _context.SaveChangesAsync();
                return Ok("The project type has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the project type : {ex.Message}"
                });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProjectType(int id)
        {
            try
            {
                var projectType = await _context.ProjectTypes.FindAsync(id);
                if (projectType == null)
                {
                    return BadRequest(new { message = $"No project type found with the id value : {id}" });
                }

                _context.ProjectTypes.Remove(projectType);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Project type with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the project type : {ex.Message}"
                });
            }
        }
    }
}
