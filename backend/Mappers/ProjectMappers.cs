using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Project;
using backend.Dtos.UserProject;
using backend.Models;

namespace backend.Mappers
{
    public static class ProjectMappers
    {
        public static ProjectDto ToProjectDto(this Project project)
        {
            return new ProjectDto
            {
                Id = project.Id,
                Budget = project.Budget,
                SpentBudget = project.SpentBudget,
                Deadline = project.Deadline,
                Description = project.Description,
                Name = project.Name,
                PriorityName = project.PriorityName,
                Progress = project.Progress,
                ProjectTypeId = project.ProjectTypeId,
                ProjectType = project.ProjectType,
                StartDate = project.StartDate,
                StatusName = project.StatusName,
                ManagerId = project.ManagerId,
                CustomerId = project.CustomerId,
                Manager = project.Manager.ToUserDto(),
                Customer = project.Customer.ToUserDto(),
                ProjectRequests = project.ProjectRequests.Select(pR => pR.FromProjectRequestToDto()).ToList(),
                UserProjects = project.UserProjects.Select(up => new UserProjectDto
                {
                    Id = up.Id,
                    UserId = up.UserId,
                    ProjectId = up.ProjectId
                }).ToList()

            };
        }

        public static Project FromCreateToProject(this CreateProjectDto createProjectDto)
        {
            return new Project
            {
                Budget = createProjectDto.Budget,
                SpentBudget = 0,
                Deadline = createProjectDto.Deadline,
                Description = createProjectDto.Description,
                Name = createProjectDto.Name,
                PriorityName = createProjectDto.PriorityName,
                ProjectTypeId = createProjectDto.ProjectTypeId,
                Progress = 0,
                StatusName = createProjectDto.StatusName,
                StartDate = createProjectDto.StartDate,
                ManagerId = createProjectDto.ManagerId,
                CustomerId = createProjectDto.CustomerId
            };
        }

    }
}