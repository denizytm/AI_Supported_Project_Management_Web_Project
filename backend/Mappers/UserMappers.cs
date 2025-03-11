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
                StatusName = user.StatusName
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
                ProficiencyLevelName = createUserDto.ProficiencyLevelName,
                RoleName = createUserDto.RoleName,
                StatusName = createUserDto.StatusName,
            };
        }

        public static User UpdateDtoToUser(this UpdateUserDto updateUserDto, User userData)
        {
            userData.Email = string.IsNullOrWhiteSpace(updateUserDto.Email) ? userData.Email : updateUserDto.Email;
            userData.Name = string.IsNullOrWhiteSpace(updateUserDto.Name) ? userData.Name : updateUserDto.Name;
            userData.LastName = string.IsNullOrWhiteSpace(updateUserDto.LastName) ? userData.LastName : updateUserDto.LastName;
            userData.Password = string.IsNullOrWhiteSpace(updateUserDto.Password) ? userData.Password : updateUserDto.Password;
            userData.ProficiencyLevelName = string.IsNullOrWhiteSpace(updateUserDto.ProficiencyLevelName) ? userData.ProficiencyLevelName : updateUserDto.ProficiencyLevelName;
            userData.RoleName = string.IsNullOrWhiteSpace(updateUserDto.RoleName) ? userData.RoleName : updateUserDto.RoleName;
            userData.TaskRoleName = string.IsNullOrWhiteSpace(updateUserDto.TaskRoleName) ? userData.TaskRoleName : updateUserDto.TaskRoleName;
            userData.StatusName = string.IsNullOrWhiteSpace(updateUserDto.StatusName) ? userData.StatusName : updateUserDto.StatusName;

            return userData;
        }


    }
}