using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.User;
using backend.Mappers;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/users")] // define the path for controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetUsers()
        {
            try
            {
                var userDtos = _context.Users.ToList().Select(user => user.ToUserDto()); // transform all the user datas into userDto's
                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the users : {ex.Message}"
                });
            }
        }

        [HttpGet("find")]
        public async Task<IActionResult> GetUser(int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return BadRequest(new { message = $"No user found with the id value : {id}" });
                }
                return Ok(user.ToUserDto());
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when fetching the user : {ex.Message}"
                });
            }
        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {

            try
            {

                var userData = createUserDto.ToUser();

                var result = await _context.Users.AddAsync(userData);

                if (result.Entity != null)
                {
                    await _context.SaveChangesAsync();
                    return Ok(new
                    {
                        message = "User has been created."
                    });
                }
                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while creating the user : {ex.Message}"
                });
            }

        }

        [HttpPut("update")]
        public async Task<IActionResult> UpdateUser(User userData, int id)
        {
            try
            {
                var user = await _context.Users.FindAsync(id);
                if (user == null)
                {
                    return BadRequest(new { message = $"No user found with the id value : {id}" });
                }

                user.Name = userData?.Name ?? user.Name;
                user.Email = userData?.Email ?? user.Email;
                user.ProficiencyLevel = userData?.ProficiencyLevel ?? user.ProficiencyLevel;
                user.Role = userData?.Role ?? user.Role;
                user.Status = userData?.Status ?? user.Status;
                user.Projects = userData?.Projects ?? user.Projects;
                user.Technologies = userData?.Technologies ?? user.Technologies;
                user.AssignedTask = userData?.AssignedTask ?? user.AssignedTask;

                await _context.SaveChangesAsync();
                return Ok("The user has been updated");
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
        public async Task<IActionResult> DeleteUser(int id) {
            try {
                var user = await _context.Users.FindAsync(id);
                if(user == null)
                {
                    return BadRequest(new { message = $"No user found with the id value : {id}" });
                }
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

                return Ok(new {
                    message = $"User with the id : {id} has been deleted successfully"
                });
            } catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the user : {ex.Message}"
                });
            }
        }

    }
}