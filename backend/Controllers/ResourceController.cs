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
    [Route("api/resources")] // define the path for controller
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ResourceController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetResources()
        {
            try
            {
                var resources = await _context.Resources.ToListAsync();
                return Ok(resources);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the resources: {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetResource(int id)
        {
            try
            {
                var resource = await _context.Resources.FindAsync(id);
                if (resource == null)
                {
                    return BadRequest(new { message = $"No resource found with the id value : {id}" });
                }
                return Ok(resource);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the resource : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateResource(Resource resource)
        {
            try
            {
                var result = await _context.Resources.AddAsync(resource);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "Resource has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the resource : {ex.Message}"
                });
            }
        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateResource(Resource resourceData, int id)
        {
            try
            {
                var resource = await _context.Resources.FindAsync(id);
                if (resource == null)
                {
                    return BadRequest(new { message = $"No resource found with the id value : {id}" });
                }

                /* resource.Name = resourceData?.Name ?? resource.Name;
                resource.Description = resourceData?.Description ?? resource.Description;
                resource.Quantity = resourceData?.Quantity ?? resource.Quantity; */

                await _context.SaveChangesAsync();
                return Ok("The resource has been updated");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error while updating the resource : {ex.Message}"
                });
            }
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteResource(int id)
        {
            try
            {
                var resource = await _context.Resources.FindAsync(id);
                if (resource == null)
                {
                    return BadRequest(new { message = $"No resource found with the id value : {id}" });
                }

                _context.Resources.Remove(resource);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    message = $"Resource with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the resource : {ex.Message}"
                });
            }
        }
    }
}
