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
                Id = project.Id,
                Budget = project.Budget,
                Deadline = project.Deadline,
                Description = project.Description,
                Manager = project.Manager != null ? project.Manager.ToUserDto() : null,
                Name = project.Name,
                PriorityName = project.PriorityName,
                Progress = project.Progress,
                ProjectTypeName = project.ProjectTypeName,
                StartDate = project.StartDate,
                StatusName = project.StatusName,
                Tasks = project.Tasks,
                Technologies = project.Technologies,
                UserId = project.UserId
            };
        }

        public static Project FromCreateToProject(this CreateProjectDto createProjectDto){
            return new Project {
                Budget = 0,
                Deadline = createProjectDto.Deadline,
                Description = createProjectDto.Description,
                Name = createProjectDto.Name,
                PriorityName = createProjectDto.PriorityName,
                ProjectTypeName = createProjectDto.ProjectTypeName,
                Progress = 0,
                StatusName = createProjectDto.StatusName,
                StartDate = createProjectDto.StartDate,
                UserId = createProjectDto.UserId
            };
        }

    }
}