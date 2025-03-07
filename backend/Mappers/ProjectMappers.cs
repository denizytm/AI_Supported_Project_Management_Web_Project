using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Project;
using backend.Models;

namespace backend.Mappers
{
    public static class ProjectMappers
    {
        public static ProjectDto ToProjectDto(this Project project){
            return new ProjectDto {
                Budget = project.Budget,
                Deadline = project.Deadline,
                Description = project.Description,
                Id = project.Id,
                Manager = project.Manager.ToUserDto(),
                Name = project.Name,
                PriorityName = project.PriorityName,
                Progress = project.Progress,
                ProjectTypeName = project.ProjectTypeName,
                StartDate = project.StartDate,
                StatusName = project.StatusName,
                Tasks = project.Tasks,
                Technologies = project.Technologies,
                UserId = project.UserId,
                UserProjects = project.UserProjects
            };
        }
    }
}