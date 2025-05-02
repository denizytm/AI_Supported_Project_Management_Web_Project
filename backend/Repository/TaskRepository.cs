using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Task;
using backend.Interfaces;
using backend.Mappers;
using backend.Models;

namespace backend.Repository
{
    public class TaskRepository : ITaskRepository
    {
        public ApplicationDbContext _context;

        public TaskRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Models.Task> CreateAsync(Models.Task taskModel)
        {
            var taskData = await _context.Tasks.AddAsync(taskModel);

            await _context.SaveChangesAsync();

            return taskData.Entity;
        }

        public async Task<Models.Task?> DeleteAsync(int id)
        {
            var taskData = await _context.Tasks.FindAsync(id);
            if (taskData == null) return null;
            _context.Tasks.Remove(taskData);

            await _context.SaveChangesAsync();

            return taskData;
        }

        public List<Models.Task> GetAll()
        {
            return _context.Tasks.ToList();
        }

        public async Task<Models.Task?> GetByIdAsync(int id)
        {
            return await _context.Tasks.FindAsync(id);
        }

        public async Task<Models.Task?> UpdateAsync(int id, UpdateTaskDto updateTaskDto, TaskLabel taskLabelData, TaskType taskTypeData)
        {
            var taskData = await _context.Tasks.FindAsync(id);
            if (taskData == null)
            {
                return null;
            }
            
            if (!string.IsNullOrWhiteSpace(updateTaskDto.Description))
                taskData.Description = updateTaskDto.Description;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.Note))
                taskData.Note = updateTaskDto.Note;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.PriorityName))
                taskData.PriorityName = updateTaskDto.PriorityName;

            if (updateTaskDto.TaskId.HasValue)
                taskData.TaskId = updateTaskDto.TaskId;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.StatusName))
                taskData.StatusName = updateTaskDto.StatusName;

            if (!string.IsNullOrWhiteSpace(updateTaskDto.TaskLevelName))
                taskData.TaskLevelName = updateTaskDto.TaskLevelName;

            if (updateTaskDto.UserId != null)
                taskData.UserId = updateTaskDto.UserId;

            if (taskLabelData != null)
                taskData.TaskLabelId = taskLabelData.Id;

            if (taskTypeData != null)
                taskData.TaskTypeId = taskTypeData.Id;

            await _context.SaveChangesAsync();

            return taskData;
        }

    }
}