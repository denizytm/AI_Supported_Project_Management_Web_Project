using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace backend.Dtos.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = String.Empty;
        public string Email { get; set; } = String.Empty;
        [JsonIgnore] // when we return a data instance, this attribute won't be shown in the JSON 
        public ProficiencyLevel ProficiencyLevel { get; set; }
        public string ProficiencyLevelName 
        {
            get => ProficiencyLevel.ToString();
            set => ProficiencyLevel = Enum.Parse<ProficiencyLevel>(value);
        }
        [JsonIgnore] // when we return a data instance, this attribute won't be shown in the JSON 
        public Role Role { get; set; }
        public string RoleName
        {
            get => Role.ToString();
            set => Role = Enum.Parse<Role>(value);
        }
        [JsonIgnore] // when we return a data instance, this attribute won't be shown in the JSON 
        public AvailabilityStatus Status { get; set; }
        public string StatusName
        {
            get => Status.ToString();
            set => Status = Enum.Parse<AvailabilityStatus>(value);
        }
    }
}