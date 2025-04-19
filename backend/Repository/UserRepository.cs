using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Mappers;
using backend.Utils;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserRepository : IUserRepository
    {
        public ApplicationDbContext _context;

        public UserRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public List<User> GetAll()
        {
            return _context.Users.ToList();
        }

        public async Task<User?> GetByIdAsync(int id)
        {
            return await _context.Users.FirstOrDefaultAsync(data => data.Id == id);
        }

        public async Task<User?> GetByEmailAsync(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(data => data.Email == email);
        }

        public async Task<User> CreateAsync(User userModel)
        {
            var userData = await _context.Users.AddAsync(userModel);
            userModel.Password = HashHelper.HashPassword(userModel.Password);
            await _context.SaveChangesAsync();
            return userData.Entity;
        }

        public async Task<User?> UpdateAsync(int id, UpdateUserDto updateUserDto)
        {

            var userData = await _context.Users.FirstOrDefaultAsync(data => data.Id == id);

            if (userData == null) return null;

            var newUserData = updateUserDto.UpdateDtoToUser(userData);

            await _context.SaveChangesAsync();

            return userData;
        }

        public async Task<User?> DeleteAsync(int id)
        {
            var userData = await _context.Users.FirstOrDefaultAsync(data => data.Id == id);
            if (userData != null)
            {
                _context.Remove(userData);
                await _context.SaveChangesAsync();
                return userData;
            }
            return null;
        }

    }
}