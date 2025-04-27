using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.ProjectRequest;
using backend.Models;

namespace backend.Mappers
{
    public static class ProjectRequestMappers
    {
        public static ProjectRequestDto FromProjectRequestToDto(this ProjectRequest projectRequest)
        {
            return new ProjectRequestDto
            {
                Id = projectRequest.Id,
                ClosedAt = projectRequest.ClosedAt,
                ClosingNote = projectRequest.ClosingNote ?? "", // Null olursa boş string
                CreatedAt = projectRequest.CreatedAt,
                CriticLevelName = projectRequest.CriticLevelName ?? "Unknown", // Hatalı isim düzelttim, ayrıca nullsa default ver
                Description = projectRequest.Description ?? "",
                IsClosed = projectRequest.IsClosed,
                RequestedBy = projectRequest.RequestedBy != null ? projectRequest.RequestedBy.ToUserDto() : null,
                ProjectId = projectRequest.ProjectId,
                RequestedById = projectRequest.RequestedById,
            };
        }


        public static ProjectRequest FromCreateDtoToModel(this CreateProjectRequestDto createProjectRequestDto)
        {
            return new ProjectRequest
            {
                ClosedAt = createProjectRequestDto.ClosedAt,
                ClosingNote = createProjectRequestDto.ClosingNote,
                CreatedAt = createProjectRequestDto.CreatedAt,
                CriticLevelName = createProjectRequestDto.CriticLevelName,
                Description = createProjectRequestDto.Description,
                IsClosed = createProjectRequestDto.IsClosed,
                ProjectId = createProjectRequestDto.ProjectId,
                RequestedById = createProjectRequestDto.RequestedById,
            };
        }

    }
}