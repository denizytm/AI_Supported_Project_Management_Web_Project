using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Threading.Tasks;
using backend.Data;
using backend.Dtos.User;
using backend.Interfaces;
using backend.Models;
using Microsoft.EntityFrameworkCore;

namespace backend.Repository
{
    public class UserRepository : IUserRepository
    {
        public ApplicationDbContext _context;
        
        public UserRepository(ApplicationDbContext context){
            _context = context;
        }

        public List<User> GetAll() {
            return _context.Users.ToList();
        }

        public async Task<User?> GetByIdAsync(int id){
            return await _context.Users.FirstOrDefaultAsync(data => data.Id == id);
        }

        public async Task<User> CreateAsync(User userModel) {
            var userData = await _context.Users.AddAsync(userModel);  
            await _context.SaveChangesAsync();
            return userData.Entity; 
        }

        public async Task<User?> UpdateAsync(int id, UpdateUserDto updateUserDto){

            var userData = await _context.Users.FirstOrDefaultAsync(data => data.Id == id);

            if(userData == null) return null;

            userData.Name = updateUserDto.Name ?? userData.Name;
            userData.Email = updateUserDto.Email ?? userData.Email;
            userData.ProficiencyLevel = updateUserDto?.ProficiencyLevel ?? userData.ProficiencyLevel;
            userData.Role = updateUserDto?.Role ?? userData.Role;
            userData.Status = updateUserDto?.Status ?? userData.Status;

            if (updateUserDto?.Projects != null && updateUserDto.Projects.Any())
                userData.Projects = updateUserDto.Projects;

            if (updateUserDto?.Technologies != null && updateUserDto.Technologies.Any())
                userData.Technologies = updateUserDto.Technologies;

            if (updateUserDto?.AssignedTask != null && updateUserDto.AssignedTask.Any())
                userData.AssignedTask = updateUserDto.AssignedTask;

            await _context.SaveChangesAsync();

            return userData;
        }

        public async Task<User?> DeleteAsync(int id) {
            var userData = await _context.Users.FirstOrDefaultAsync(data => data.Id == id);
            if(userData != null) {
                _context.Remove(userData);
                await _context.SaveChangesAsync();
                return userData;
            }
            return null;
        }

    }
}