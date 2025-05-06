using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ProjectRequest;
using backend.Dtos.User;
using backend.Dtos.UserProject;
using backend.Models;

namespace backend.Dtos.Project
{
    public class ProjectDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Description { get; set; } = String.Empty;
        public DateTime StartDate { get; set; }
        public DateTime Deadline { get; set; }
        public int Progress { get; set; }
        [NotMapped]
        public string PriorityName { get; set; } = String.Empty;
        public ProjectStatus Status { get; set; }
        [NotMapped]
        public string StatusName { get ; set; } = String.Empty;
        [Column(TypeName = "decimal(10,2)")]
        public decimal Budget { get; set; }
        public decimal SpentBudget { get; set; }
        public List<UserProjectDto> UserProjects { get; set; } = new List<UserProjectDto>();
        public int ManagerId { get; set; }
        public UserDto Manager { get; set; } = null!;

        public int CustomerId { get; set; }
        public UserDto Customer { get; set; } = null!;

        public int ProjectTypeId { get; set; }
        public ProjectType ProjectType { get; set; } = null!;
        public List<ProjectRequestDto> ProjectRequests { get; set; } = new List<ProjectRequestDto>();

    }
}