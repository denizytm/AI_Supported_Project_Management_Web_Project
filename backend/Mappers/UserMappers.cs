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
                LastName = user.LastName,
                ProficiencyLevelName = user.ProficiencyLevelName,
                RoleName = user.RoleName,
                StatusName = user.StatusName
            };
        }

        public static User ToUser(this CreateUserDto createUserDto)
        {
            return new User
            {
                Email = createUserDto.Email,
                Id = createUserDto.Id,
                Name = createUserDto.Name,
                LastName = createUserDto.LastName,
                Password = createUserDto.Password,
                ProficiencyLevel = createUserDto.ProficiencyLevel,
                Role = createUserDto.Role,
                Status = createUserDto.Status,
            };
        }

        public static User UpdateDtoToUser(this UpdateUserDto updateUserDto, User userData)
        {
            return new User
            {
                Email = updateUserDto.Email,
                Id = updateUserDto.Id,
                Name = updateUserDto.Name,
                LastName = updateUserDto.LastName,
                Password = updateUserDto.Password,
                ProficiencyLevel = updateUserDto.ProficiencyLevel,
                Role = updateUserDto.Role,
                Status = updateUserDto.Status,
            };
        }


    }
}