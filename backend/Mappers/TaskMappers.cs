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
        public static TaskDto ToTaskDto(this backend.Models.Task task)
        {
            return new TaskDto
            {
                Description = task.Description,
                AssignedUser = task.AssignedUser?.ToUserDto(),
                TaskLabel = task.TaskLabel,
                DependingTask = task.DependingTask,
                StartDate = task.StartDate,
                DueDate = task.DueDate,
                Id = task.Id,
                Note = task.Note,
                PriorityName = task.PriorityName,
                ProjectId = task.ProjectId,
                StatusName = task.StatusName,
                TaskId = task.TaskId,
                TaskLevelName = task.TaskLevelName,
                TaskTypeId = task.TaskTypeId,
                UserId = task.UserId,
                TaskType = task.TaskType
            };
        }

        public static backend.Models.Task fromCreateDtoToTask(this CreateTaskDto createTaskDto, TaskType taskTypeData, TaskLabel taskLabelData)
        {

            return new backend.Models.Task
            {
                Description = createTaskDto.Description,
                StartDate = createTaskDto.StartDate,
                DueDate = createTaskDto.DueDate,
                Note = createTaskDto.Note,
                PriorityName = createTaskDto.PriorityName,
                ProjectId = createTaskDto.ProjectId,
                TaskId = createTaskDto.TaskId,
                StatusName = createTaskDto.StatusName,
                TaskLevelName = createTaskDto.TaskLevelName,
                UserId = createTaskDto.UserId,
                TaskLabelId = taskLabelData.Id,
                TaskTypeId = taskTypeData.Id,
            };
        }

        public static backend.Models.Task fromUpdateDtoToTask(
     this UpdateTaskDto updateTaskDto,
     TaskLabel? taskLabelData,
     TaskType? taskTypeData)
        {
            var task = new backend.Models.Task();

            if (!string.IsNullOrWhiteSpace(updateTaskDto.Description))
                task.Description = updateTaskDto.Description;

            if (updateTaskDto.StartDate.HasValue)
                task.StartDate = updateTaskDto.StartDate.Value;

            if (updateTaskDto.DueDate.HasValue)
                task.DueDate = updateTaskDto.DueDate.Value;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.Note))
                task.Note = updateTaskDto.Note;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.PriorityName))
                task.PriorityName = updateTaskDto.PriorityName;

            if (updateTaskDto.TaskId.HasValue)
                task.TaskId = updateTaskDto.TaskId;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.StatusName))
                task.StatusName = updateTaskDto.StatusName;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.TaskLevelName))
                task.TaskLevelName = updateTaskDto.TaskLevelName;

            if (updateTaskDto.UserId.HasValue)
                task.UserId = updateTaskDto.UserId;

            if (taskLabelData != null)
                task.TaskLabelId = taskLabelData.Id;

            if (taskTypeData != null)
                task.TaskTypeId = taskTypeData.Id;

            return task;
        }

    }
}