using System;
using System.Collections.Generic;
using System.Globalization;
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
                GenderName = user.GenderName,
                ProficiencyLevelName = user.ProficiencyLevelName,
                RoleName = user.RoleName,
                TaskRoleName = user.TaskRoleName,
                StatusName = user.StatusName,
                Company = user.Company,
                Phone = user.Phone,
                IsActive = user.IsActive
            };
        }

        public static User FromRegisterToModel(this RegisterUserDto registerUserDto)
        {
            return new User
            {
                Birth = registerUserDto.Birth,
                Company = registerUserDto.Company,
                Email = registerUserDto.Email,
                GenderName = registerUserDto.GenderName,
                Name = registerUserDto.Name,
                LastName = registerUserDto.LastName,
                Password = registerUserDto.Password,
                Phone = registerUserDto.Phone,
                IsActive = true,
            };
        }

        public static UpdateUserDto FromModelToUpdateDto(this User user)
        {
            return new UpdateUserDto
            {
                Email = user.Email,
                LastName = user.LastName,
                Name = user.Name,
                Password = user.Password,
                ProficiencyLevelName = user.ProficiencyLevelName,
                RoleName = user.RoleName,
                StatusName = user.StatusName,
                TaskRoleName = user.TaskRoleName,
                IsActive = user.IsActive
            };
        }

        public static User FromCreateToModel(this CreateUserDto createUserDto)
        {
            return new User
            {
                Email = createUserDto.Email,
                ProficiencyLevelName = string.IsNullOrWhiteSpace(createUserDto.ProficiencyLevelName) ? null : createUserDto.ProficiencyLevelName,
                RoleName = string.IsNullOrWhiteSpace(createUserDto.RoleName) ? null : createUserDto.RoleName,
                StatusName = string.IsNullOrWhiteSpace(createUserDto.StatusName) ? null : createUserDto.StatusName,
                IsActive = false
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

            if (!string.IsNullOrWhiteSpace(updateUserDto.Phone))
                userData.Phone = updateUserDto.Phone;

            if (!string.IsNullOrWhiteSpace(updateUserDto.GenderName))
                userData.GenderName = updateUserDto.GenderName;

            if (!string.IsNullOrWhiteSpace(updateUserDto.Company))
                userData.Company = updateUserDto.Company;

            if (updateUserDto.Birth.HasValue)
            {
                userData.Birth = updateUserDto.Birth.Value;
            }

            userData.IsActive = updateUserDto.IsActive;

            return userData;
        }


    }
}