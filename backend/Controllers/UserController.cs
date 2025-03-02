using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.Swift;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;
using backend.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/users")] // define the path for controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userContext;

        public UserController(IUserRepository userContext)
        {
            _userContext = userContext;
        }

        [HttpGet("all")]
        public IActionResult GetUsers()
        {
            try
            {
                var userDtos = _userContext.GetAll().Select(user => user.ToUserDto());
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
                var user = await _userContext.GetByIdAsync(id);
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

        [HttpPost("login")]
        public async Task<IActionResult> LogInUser(LoginUserDto loginUserDto){

            var userData = await _userContext.GetByEmailAsync(loginUserDto.Email);

            if(userData == null) return BadRequest(new {
                message = "There's no user with this email"
            });

            if(userData.Password != loginUserDto.Password) return BadRequest(new {
                message = "Wrong password"
            });
            else return Ok(userData.ToUserDto());

        }

        [HttpPost("add")]
        public async Task<IActionResult> CreateUser(CreateUserDto createUserDto)
        {

            try
            {

                var userData = createUserDto.ToUser();

                var result = await _userContext.CreateAsync(userData);

                if (result != null)
                {
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
        public async Task<IActionResult> UpdateUser(UpdateUserDto updateUserDto, int id)
        {
            try
            {
                var result = await _userContext.UpdateAsync(id, updateUserDto);

                if (result == null)
                {
                    return BadRequest(new { message = $"No user found with the id value : {id}" });
                }

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
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var result = await _userContext.DeleteAsync(id);
                if (result == null)
                {
                    return BadRequest(new { message = $"No user found with the id value : {id}" });
                }

                return Ok(new
                {
                    message = $"User with the id : {id} has been deleted successfully"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error when deleting the user : {ex.Message}"
                });
            }
        }

    }
}