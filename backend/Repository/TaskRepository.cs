using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.Task;
using backend.Interfaces;
using backend.Mappers;

namespace backend.Repository
{
    public class TaskRepository : ITaskRepository
    {
        public ApplicationDbContext _context;

        TaskRepository(ApplicationDbContext context)
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

        public async Task<Models.Task?> UpdateAsync(int id, UpdateTaskDto updateTaskDto)
        {
            var taskData = await _context.Tasks.FindAsync(id);

            if (taskData == null)
            {
                return null;
            }

            var updatedTaskData = updateTaskDto.fromUpdateDtoToTask();

            await _context.SaveChangesAsync();

            return updatedTaskData;
        }
    }
}