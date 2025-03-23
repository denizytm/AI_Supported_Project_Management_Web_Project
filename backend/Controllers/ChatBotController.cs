using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Data;
using backend.Interfaces;
using backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.SemanticKernel.ChatCompletion;

namespace backend.Controllers
{
    [Route("api/chatbot")] // define the path for controller
    [ApiController]
    public class ChatBotController : ControllerBase
    {
        private readonly ITaskRepository _taskRepository;
        private readonly IUserRepository _userRepository;
        private readonly ApplicationDbContext _context;
        public ChatBotController(ApplicationDbContext context, ITaskRepository taskRepository, IUserRepository userRepository)
        {
            _context = context;
            _taskRepository = taskRepository;
            _userRepository = userRepository;
        }

        [HttpPost("chat")]

        public async Task<string> SendMessageToModel(IChatCompletionService chatService, ChatModel chatModel)
        {
            var response = await chatService.GetChatMessageContentAsync(chatModel.Input);
            return response?.ToString() ?? "No result";
        }

        [HttpGet("assign-tasks")]
        public async Task<IActionResult> AssignTasksToUsers(IChatCompletionService chatService)
        {
            var unassignedTasks = await _context.Tasks
                .Where(t => t.Status == TaskStatus.ToDo)
                .Include(t => t.TaskType)
                .Take(5)
                .ToListAsync();


            var availableUsers = await _context.Users
                .Where(u => u.Status == AvailabilityStatus.Available)
                .Take(5)
                .ToListAsync();

            if (!unassignedTasks.Any() || !availableUsers.Any())
            {
                return NotFound("Uygun görev veya müsait kullanıcı bulunamadı.");
            }

            // 1️⃣ Görevleri gruplara ayırıyoruz
            const int batchSize = 5;  // Her seferinde 5 görev işlenecek
            List<List<Models.Task>> taskBatches = unassignedTasks
                .Select((task, index) => new { task, index })
                .GroupBy(x => x.index / batchSize)
                .Select(g => g.Select(x => x.task).ToList())
                .ToList();

            List<object> allAssignments = new List<object>();

            List<String> responseList = new List<string>();

            foreach (var batch in taskBatches)
            {

                string prompt = $@"
                Previous Chat (You need to memorize which users assigned to tasks before) : {string.Join(",",responseList)}
                You are an AI assistant that assigns tasks to the most suitable users.
                Given the following tasks:

                {string.Join("\n", batch.Select(t => $@"
                Task ID: {t.Id}
                Description: {t.Description}
                Level: {t.TaskLevel}
                Priority: {t.Priority}
                Task Role: {t.TaskType.Name}
                Task Start Date: {t.StartDate}
                Task Due Date: {t.DueDate}
                Task Level : {t.TaskLevel}
                "))}

                And the following available users:

                {string.Join("\n", availableUsers.Select(u => $@"
                User ID: {u.Id}
                Name: {u.Name} {u.LastName}
                Proficiency: {u.ProficiencyLevel}
                Role: {u.TaskRole}
                "))}

                Rules : 
                    - User's ProficiencyLevel must be same or greater than the Task's Task Level.
                    - If a user assigned to a task, the other tasks that will assigned to same user should not cover the current task's Start Date and Due Date.
                    - If user's ProficiencyLevel is 0 he/she can be assigned to one task maximum, if 1; max is 2, if 2; max is 3. (AssignedUserId count should not be greater than 3)
                    - You don't need to assign all the tasks leave it 0 as userId if you can't.

                ⚠ Return the response in **valid JSON format** without any extra text:
                [{{ ""TaskId"": 1, ""AssignedUserId"": 5 }}, {{ ""TaskId"": 2, ""AssignedUserId"": 8 }}]";

                var response = await chatService.GetChatMessageContentAsync(prompt);
                string aiResponse = response?.ToString() ?? "";

                aiResponse = aiResponse.Replace("```json", "").Replace("```", "").Trim();

                responseList.Add(aiResponse.Replace("\n", "").Replace("\t", ""));

                List<TaskAssignment>? assignments;
                try
                {
                    assignments = JsonSerializer.Deserialize<List<TaskAssignment>>(aiResponse);
                }
                catch (Exception ex)
                {
                    return BadRequest("Failed to parse AI response: " + ex.Message);
                }

                if (assignments == null || !assignments.Any())
                {
                    return BadRequest("AI response could not be parsed.");
                }

                var validUserIds = availableUsers.Select(u => u.Id).ToHashSet();
                var validAssignments = assignments.Where(a => validUserIds.Contains(a.AssignedUserId)).ToList();

                foreach (var assignment in validAssignments)
                {
                    var task = unassignedTasks.FirstOrDefault(t => t.Id == assignment.TaskId);
                    var user = availableUsers.FirstOrDefault(u => u.Id == assignment.AssignedUserId);

                    if (task != null && user != null)
                    {
                        task.AssignedUser = user;
                        task.UserId = user.Id;
                        allAssignments.Add(new
                        {
                            UserId = user.Id,
                            TaskId = task.Id,
                            TaskDescription = task.Description,
                            AssignedTo = user.Name + " " + user.LastName
                        });
                    }
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Tasks assigned successfully", Assignments = allAssignments });
        }

    }
}