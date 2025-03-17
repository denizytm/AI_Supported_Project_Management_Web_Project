using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.Task;
using backend.Models;

namespace backend.Interfaces
{
    public interface ITaskRepository
    {
        List<Models.Task> GetAll();
        Task<Models.Task?> GetByIdAsync(int id);
        Task<Models.Task> CreateAsync(backend.Models.Task taskModel);
        Task<Models.Task?> UpdateAsync(int id,UpdateTaskDto updateTaskDto);
        Task<Models.Task?> DeleteAsync(int id);
    }
}