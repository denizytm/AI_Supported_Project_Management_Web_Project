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
using Microsoft.AspNetCore.Http.HttpResults;

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

        public async Task<User> RegisterAsync(User userData, RegisterUserDto registerUserDto)
        {
            userData.Name = registerUserDto.Name;
            userData.LastName = registerUserDto.LastName;
            userData.Phone = registerUserDto.Phone;
            userData.GenderName = registerUserDto.GenderName;
            userData.Company = registerUserDto.Company;
            userData.Password = HashHelper.HashPassword(registerUserDto.Password); ;
            userData.IsActive = true;

            return userData;
        }

        public async Task<User> CreateAsync(User userModel)
        {
            if (string.IsNullOrEmpty(userModel.Password))
                throw new ArgumentException("Password cannot be null or empty.");

            userModel.Password = HashHelper.HashPassword(userModel.Password);

            var userData = await _context.Users.AddAsync(userModel);
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