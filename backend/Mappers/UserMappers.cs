using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Mappers
{
    public static class UserMappers
    {
        public static UserDto ToUserDto(this User user)
        {
            return new UserDto
            {
                Email = user.Email,
                Id = user.Id,
                Name = user.Name,
                ProficiencyLevelName = user.ProficiencyLevelName,
                RoleName = user.RoleName,
                StatusName = user.StatusName
            };
        }

        public static User ToUser(this CreateUserDto createUserDto){
            return new User {
                Email = createUserDto.Email,
                Id = createUserDto.Id,
                Name = createUserDto.Name,
                Password = createUserDto.Password,
                ProficiencyLevel = createUserDto.ProficiencyLevel,
                Role = createUserDto.Role,
                Status = createUserDto.Status,
            };
        }

    }
}