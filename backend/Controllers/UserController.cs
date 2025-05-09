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
using backend.Utils;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [Route("api/users")] // define the path for controller
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserRepository _userContext;
        private readonly ApplicationDbContext _context;

        public UserController(IUserRepository userContext, ApplicationDbContext context)
        {
            _context = context;
            _userContext = userContext;
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsers(
            [FromQuery] int page = 1,
            [FromQuery] string? search = "",
            [FromQuery] string? role = "",
            [FromQuery] string? status = "",
            [FromQuery] string? proficiency = ""
        )
        {
            const int pageSize = 10;

            if (page < 1)
                return BadRequest("Page must be 1 or greater.");

            IQueryable<User> query = _context.Users;

            if (Enum.TryParse<Role>(role, true, out var parsedRole))
                query = query.Where(u => u.Role == parsedRole);

            if (Enum.TryParse<AvailabilityStatus>(status, true, out var parsedStatus))
                query = query.Where(u => u.Status == parsedStatus);

            if (Enum.TryParse<ProficiencyLevel>(proficiency, true, out var parsedProf))
                query = query.Where(u => u.ProficiencyLevel == parsedProf);

            if (!string.IsNullOrWhiteSpace(search))
            {
                var normalizedSearch = search.Trim().ToLower();
                query = query.Where(u =>
                    u.Name.ToLower().Contains(normalizedSearch) ||
                    u.LastName.ToLower().Contains(normalizedSearch) ||
                    u.Email.ToLower().Contains(normalizedSearch)
                );
            }

            var totalUsers = await query.CountAsync();

            var users = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => u.ToUserDto())
                .ToListAsync();

            var result = new
            {
                currentPage = page,
                totalPages = Math.Max(1, (int)Math.Ceiling((double)totalUsers / pageSize)),
                totalCount = totalUsers,
                users
            };

            return Ok(result);
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

        [HttpGet("projectModal/add")]
        public async Task<IActionResult> GetAddProjectModalValues()
        {
            try
            {
                var clients = await _context.Users.Where(u => u.Role == Role.Client).ToListAsync();

                var clientDtos = clients.Select(u => u.ToUserDto()).ToList();

                var itManagers = await _context.Users
                                    .Where(u => u.Role == Role.ProjectManager)
                                    .ToListAsync();

                var itManagerDtos = itManagers.Select(iM => iM.ToUserDto());


                return Ok(new
                {
                    clients = clientDtos,
                    itManagers = itManagerDtos
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error fetching clients: {ex.Message}"
                });
            }
        }

        [HttpGet("clients")]
        public async Task<IActionResult> GetClients()
        {
            try
            {
                var clients = await _context.Users.Where(u => u.Role == Role.Client).ToListAsync();

                if (clients == null || !clients.Any())
                {
                    return BadRequest(new { message = "No clients found." });
                }

                var clientDtos = clients.Select(u => u.ToUserDto()).ToList();
                return Ok(clientDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error fetching clients: {ex.Message}"
                });
            }
        }

        [HttpGet("managers/available")]
        public async Task<IActionResult> GetAvailableItManagers()
        {
            try
            {

                var managersId = _context.Projects.Select(p => p.ManagerId).Distinct();

                var itManagers = await _context.Users
                    .Where(u => u.Role == Role.ProjectManager && !managersId.Contains(u.Id))
                    .ToListAsync();

                if (itManagers == null || !itManagers.Any())
                {
                    return BadRequest(new { message = "No IT Managers found." });
                }

                var itManagerDtos = itManagers.Select(u => u.ToUserDto()).ToList();
                return Ok(itManagerDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error fetching IT Managers: {ex.Message}"
                });
            }
        }

        [HttpGet("managers/all")]
        public async Task<IActionResult> GetAllItManagers()
        {
            try
            {

                var managersId = _context.Projects.Select(p => p.ManagerId).Distinct();

                var itManagers = await _context.Users
                    .Where(u => u.Role == Role.ProjectManager)
                    .ToListAsync();

                if (itManagers == null || !itManagers.Any())
                {
                    return BadRequest(new { message = "No IT Managers found." });
                }

                var itManagerDtos = itManagers.Select(u => u.ToUserDto()).ToList();
                return Ok(itManagerDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"There was an error fetching IT Managers: {ex.Message}"
                });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> LogInUser(LoginUserDto loginUserDto)
        {

            var userData = await _userContext.GetByEmailAsync(loginUserDto.Email);

            if (userData == null) return Ok(new
            {
                title = "email",
                message = "There's no user with this email",
                result = false
            });

            if (userData.IsActive == false || userData.Password == null) return Ok(new
            {
                title = "email",
                message = "This account has not activated yet.",
                result = false
            });

            bool passwordMatches = HashHelper.VerifyPassword(loginUserDto.Password, userData.Password);
            if (!passwordMatches)
            {
                return Ok(new
                {
                    title = "password",
                    message = "Wrong password",
                    result = false
                });
            }
            else return Ok(new
            {
                userData = userData.ToUserDto(),
                result = true
            });

        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto createUserDto)
        {

            var existingUser = await _context.Users.FirstOrDefaultAsync(user => user.Email == createUserDto.Email);

            if(existingUser != null) return Ok(new {
                result = false,
                message = "There's already an already an user exists with this email"
            });

            var user = createUserDto.FromCreateToModel();

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User created. Waiting for registration." });
        }

        [HttpPost("register")]
        public async Task<IActionResult> RegisterUser(RegisterUserDto registerUserDto)
        {
            try
            {
                var existingUser = await _userContext.GetByEmailAsync(registerUserDto.Email);

                if (existingUser == null || existingUser.IsActive)
                {
                    return Ok(new
                    {
                        title = "email",
                        message = "No available registration found for this email.",
                        result = false
                    });
                }

                existingUser = await _userContext.RegisterAsync(existingUser, registerUserDto);

                var updatedUser = await _userContext.UpdateAsync(existingUser.Id, existingUser.FromModelToUpdateDto());

                if (updatedUser != null)
                {
                    return Ok(new
                    {
                        userData = updatedUser.ToUserDto(),
                        result = true
                    });
                }

                return BadRequest();
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = $"An error occurred while completing registration: {ex.Message}"
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