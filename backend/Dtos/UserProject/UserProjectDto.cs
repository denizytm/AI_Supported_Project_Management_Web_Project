using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Project;
using backend.Dtos.User;

namespace backend.Dtos.UserProject
{
    public class UserProjectDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public UserDto? User { get; set; } = null!;

        public int ProjectId { get; set; }
        public ProjectDto? Project { get; set; } = null!;
    }
}