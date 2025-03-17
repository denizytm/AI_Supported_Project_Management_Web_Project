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
                Description = task.Description,
                AssignedUser = task.AssignedUser.ToUserDto(),
                TaskLabel = task.TaskLabel,
                DependingTask = task.DependingTask,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                Id = task.Id,
                Note = task.Note,
                PriorityName = task.PriorityName,
                Progress = task.Progress,
                Project = task.Project,
                ProjectId = task.ProjectId,
                StatusName = task.StatusName,
                TaskId = task.TaskId,
                TaskLevelName = task.TaskLevelName,
                TaskTypeId = task.TaskTypeId,
                UserId = task.UserId,
                TaskType = task.TaskType
            };
        }

        public static backend.Models.Task fromCreateDtoToTask(this CreateTaskDto createTaskDto){
            return new backend.Models.Task {
                Description = createTaskDto.Description,
                StartDate = createTaskDto.StartDate,
                DueDate = createTaskDto.DueDate,
                Note = createTaskDto.Note,
                PriorityName = createTaskDto.PriorityName,
                Progress = createTaskDto.Progress,
                ProjectId = createTaskDto.ProjectId,
                TaskId = createTaskDto.TaskId,
                StatusName = createTaskDto.StatusName,
                TaskLevelName = createTaskDto.TaskLevelName,
                UserId = createTaskDto.UserId,
                TaskLabelId = createTaskDto.TaskLabelId,
                TaskTypeId = createTaskDto.TaskTypeId,
            };
        }

        public static backend.Models.Task fromUpdateDtoToTask(this UpdateTaskDto updateTaskDto) {

            return new Models.Task {
                Description = updateTaskDto.Description,
                StartDate = updateTaskDto.StartDate,
                DueDate = updateTaskDto.DueDate,
                Note = updateTaskDto.Note,
                PriorityName = updateTaskDto.PriorityName,
                Progress = updateTaskDto.Progress,
                TaskId = updateTaskDto.TaskId,
                StatusName = updateTaskDto.StatusName,
                TaskLevelName = updateTaskDto.TaskLevelName,
                UserId = updateTaskDto.UserId,
                TaskLabelId = updateTaskDto.TaskLabelId,
                TaskTypeId = updateTaskDto.TaskTypeId
            };
        }

    }
}