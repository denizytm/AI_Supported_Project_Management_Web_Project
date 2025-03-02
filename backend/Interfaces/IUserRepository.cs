using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Dtos.User;
using backend.Models;

namespace backend.Interfaces
{
    public interface IUserRepository
    {
        List<User> GetAll();
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByEmailAsync(string email);
        Task<User> CreateAsync(User userModel);
        Task<User?> UpdateAsync(int id,UpdateUserDto updateUserDto);
        Task<User?> DeleteAsync(int id);
    }
}