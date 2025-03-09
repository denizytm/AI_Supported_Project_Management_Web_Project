using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Task;
using backend.Models;

namespace backend.Mappers
{
    public static class TaskMappers
    {
        public static TaskDto ToTaskDto(this backend.Models.Task task){
            return new TaskDto {
                AssignedUser = task.AssignedUser.ToUserDto(),
                TaskLabel = task.TaskLabel,
                DependingTask = task.DependingTask,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                EstimatedHours = task.EstimatedHours,
                Id = task.Id,
                TypeName = task.TypeName,
                Note = task.Note,
                PriorityName = task.PriorityName,
                Progress = task.Progress,
                Project = task.Project,
                ProjectId = task.ProjectId,
                StatusName = task.StatusName,
                TaskId = task.TaskId,
                TaskLevelName = task.TaskLevelName,
                TaskName = task.TaskName,
                UserId = task.UserId
            };
        }

        public static backend.Models.Task fromCreateDtoToTask(this CreateTaskDto createTaskDto){
            return new backend.Models.Task {
                EstimatedHours = createTaskDto.EstimatedHours,
                StartDate = createTaskDto.StartDate,
                DueDate = createTaskDto.DueDate,
                Note = createTaskDto.Note,
                PriorityName = createTaskDto.PriorityName,
                Progress = createTaskDto.Progress,
                ProjectId = createTaskDto.ProjectId,
                TaskId = createTaskDto.TaskId,
                StatusName = createTaskDto.StatusName,
                TaskLevelName = createTaskDto.TaskLevelName,
                TypeName = createTaskDto.TypeName,
                UserId = createTaskDto.UserId,
                TaskLabelId = createTaskDto.TaskLabelId,
                TaskName = createTaskDto.TaskName,
            };
        }

    }
}