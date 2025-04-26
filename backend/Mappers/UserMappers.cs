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
                TaskRoleName = user.TaskRoleName,
                StatusName = user.StatusName,
                Company = user.Company,
                Phone = user.Phone
            };
        }

        public static User ToUser(this CreateUserDto createUserDto)
        {
            return new User
            {
                Email = createUserDto.Email,
                Name = createUserDto.Name,
                LastName = createUserDto.LastName,
                Password = createUserDto.Password,
                ProficiencyLevel = createUserDto.ProficiencyLevel,
                Role = createUserDto.Role,
                Status = createUserDto.Status,
                Company = createUserDto.Company,
                Phone = createUserDto.Phone
            };
        }

        public static User UpdateDtoToUser(this UpdateUserDto updateUserDto, User userData)
        {
            if (!string.IsNullOrWhiteSpace(updateUserDto.Email))
                userData.Email = updateUserDto.Email;

            if (!string.IsNullOrWhiteSpace(updateUserDto.Name))
                userData.Name = updateUserDto.Name;

            if (!string.IsNullOrWhiteSpace(updateUserDto.LastName))
                userData.LastName = updateUserDto.LastName;

            if (!string.IsNullOrWhiteSpace(updateUserDto.Password))
                userData.Password = updateUserDto.Password;

            if (!string.IsNullOrWhiteSpace(updateUserDto.ProficiencyLevelName))
                userData.ProficiencyLevelName = updateUserDto.ProficiencyLevelName;

            if (!string.IsNullOrWhiteSpace(updateUserDto.RoleName))
                userData.RoleName = updateUserDto.RoleName;

            if (!string.IsNullOrWhiteSpace(updateUserDto.TaskRoleName))
                userData.TaskRoleName = updateUserDto.TaskRoleName;

            if (!string.IsNullOrWhiteSpace(updateUserDto.StatusName))
                userData.StatusName = updateUserDto.StatusName;

            return userData;
        }

    }
}