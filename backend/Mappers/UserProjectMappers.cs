using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.UserProject;
using backend.Models;

namespace backend.Mappers
{
    public static class UserProjectMappers
    {
        public static UserProjectDto ToUserProjectDto(this UserProject userProject){
            return new UserProjectDto {
                id = userProject.id,
                Project = userProject.Project.ToProjectDto(),
                ProjectId = userProject.ProjectId,
                User = userProject.User.ToUserDto(),
                UserId = userProject.UserId
            };
        }
    }
}