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
        public static ProjectRequestDto FromProjectRequestToDto(this ProjectRequest projectRequest) {
            return new ProjectRequestDto {
                ClosedAt = projectRequest.ClosedAt,
                ClosingNote = projectRequest.ClosingNote,
                CreatedAt = projectRequest.CreatedAt,
                CriticLevelName = projectRequest.CriticLevellName,
                Description = projectRequest.Description,
                IsClosed = projectRequest.IsClosed,
                RequestedBy = projectRequest.RequestedBy.ToUserDto(),
                ProjectId = projectRequest.ProjectId,
                RequestedById = projectRequest.RequestedById,
            };
        } 
    }
}