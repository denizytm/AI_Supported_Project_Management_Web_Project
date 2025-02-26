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
    [Route("api/technologies")] // define the path for controller
    [ApiController]
    public class TechnologyController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TechnologyController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetTechnologies()
        {
            try
            {
                var technologies = await _context.Technologies.ToListAsync();
                return Ok(technologies);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the technologies: {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetTechnology(int id)
        {
            try
            {
                var technology = await _context.Technologies.FindAsync(id);
                if (technology == null)
                {
                    return BadRequest(new { message = $"No technology found with the id value : {id}" });
                }
                return Ok(technology);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the technology : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateTechnology(Technology technology)
        {
            try
            {
                var result = await _context.Technologies.AddAsync(technology);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "Technology has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the technology : {ex.Message}"
                });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateTechnology(Technology technologyData, int id)
        {
            try
            {
                var technology = await _context.Technologies.FindAsync(id);
                if (technology == null)
                {
                    return BadRequest(new { message = $"No technology found with the id value : {id}" });
                }

                /* technology.Name = technologyData?.Name ?? technology.Name;
                technology.Description = technologyData?.Description ?? technology.Description; */

                await _context.SaveChangesAsync();
                return Ok("The technology has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the technology : {ex.Message}"
                });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteTechnology(int id)
        {
            try
            {
                var technology = await _context.Technologies.FindAsync(id);
                if (technology == null)
                {
                    return BadRequest(new { message = $"No technology found with the id value : {id}" });
                }

                _context.Technologies.Remove(technology);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Technology with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the technology : {ex.Message}"
                });
            }
        }
    }
}
