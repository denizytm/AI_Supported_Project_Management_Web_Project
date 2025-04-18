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
        public async Task<IActionResult> AssignTasksToUsers(IChatCompletionService chatService, int ProjectId)
        {
            var unassignedTasks = await _context.Tasks
                .Where(t => t.ProjectId == ProjectId)
                .Where(t => t.Status == TaskStatus.ToDo)
                .Include(t => t.TaskType)
                .ToListAsync();

            var availableUsers = await _context.UserProjects
                .Where(uP => uP.ProjectId == ProjectId)
                .Where(uP => uP.User.Status == AvailabilityStatus.Available)
                .Include(uP => uP.User)
                .Select(uP => uP.User)
                .ToListAsync();

            /* var assignedUsers = await _context.Tasks
                .Where(t => t.ProjectId == ProjectId)
                .Include(t => t.AssignedUser)
                .ToListAsync();
            */

            if (!unassignedTasks.Any() || !availableUsers.Any())
            {
                return NotFound("No available task or users has found.");
            }

            const int batchSize = 5;
            List<List<Models.Task>> taskBatches = unassignedTasks
                .Select((task, index) => new { task, index })
                .GroupBy(x => x.index / batchSize)
                .Select(g => g.Select(x => x.task).ToList())
                .ToList();

            List<object> allAssignments = new List<object>();

            List<String> responseList = new List<string>();

            foreach (var batch in taskBatches)
            {

                string pastAssignments = string.Join(",\n", allAssignments.Select(a =>
                $"{{ \"UserId\": {a.GetType().GetProperty("UserId")?.GetValue(a)}, \"TaskId\": {a.GetType().GetProperty("TaskId")?.GetValue(a)} }}"));

                string prompt = $@"
                    You are an AI assistant that assigns tasks to the most suitable users.

                    Objective: Assign tasks to users with the right skills and within allowed limits.

                    Previous Assignments:
                    [
                        {pastAssignments}
                    ]

                    Tasks to Assign:
                    {string.Join("\n", batch.Select(t => $@"
                    - Task ID: {t.Id}
                      Description: {t.Description}
                      Level: {t.TaskLevel}
                      Priority: {t.Priority}
                      Role: {t.TaskType.Name}
                      Start: {t.StartDate}
                      Due: {t.DueDate}
                    "))}

                    Available Users:
                    {string.Join("\n", availableUsers.Select(u => $@"
                    - User ID: {u.Id}
                      Name: {u.Name} {u.LastName}
                      Proficiency Level: {u.ProficiencyLevel} (0 = Beginner, 1 = Intermediate, 2 = Expert)
                      Role: {u.TaskRole}
                    "))}

                    **Assignment Rules (You must follow all of these strictly):**
                    1. A user's `ProficiencyLevel` must be **equal to or greater** than the task's `TaskLevel`.
                    2. Assigned tasks for the same user **must not overlap** in date ranges.
                    3. **Task limits based on proficiency:**
                       - Beginner (0) → **max 1** task
                       - Intermediate (1) → **max 2** tasks
                       - Expert (2) → **max 3** tasks
                    4. If you can't assign a task, set `AssignedUserId` to `0`.

                    Example Output (strict JSON, no comments, no extra text):
                        [
                          {{ ""TaskId"": 32, ""AssignedUserId"": 67 }},
                          {{ ""TaskId"": 85, ""AssignedUserId"": 0 }}
                        ]
                ";

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
                        allAssignments.Add(new
                        {
                            UserId = user.Id,
                            TaskId = task.Id,
                            TaskDescription = task.Description,
                            TaskLevel = task.TaskLevelName,
                            AssignedTo = user.Name + " " + user.LastName
                        });
                    }
                }
            }

            return Ok(new { Message = "Tasks assigned successfully", Assignments = allAssignments });
        }

        [HttpPost("confirm-assignments")]
        public async Task<IActionResult> ConfirmAssignments([FromBody] List<TaskAssignment> confirmedAssignments)
        {
            if (confirmedAssignments == null || !confirmedAssignments.Any())
            {
                return BadRequest("No assignments received.");
            }

            var taskIds = confirmedAssignments.Select(a => a.TaskId).ToList();
            var userIds = confirmedAssignments.Select(a => a.AssignedUserId).Distinct().ToList();

            var tasks = await _context.Tasks
                .Where(t => taskIds.Contains(t.Id))
                .ToListAsync();

            var users = await _context.Users
                .Where(u => userIds.Contains(u.Id))
                .ToListAsync();

            foreach (var assignment in confirmedAssignments)
            {
                var task = tasks.FirstOrDefault(t => t.Id == assignment.TaskId);
                var user = users.FirstOrDefault(u => u.Id == assignment.AssignedUserId);

                if (task != null && user != null)
                {
                    task.UserId = user.Id;
                    // _context.Entry(task).State = EntityState.Modified; // opsiyonel
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Assignments confirmed and saved." });
        }

    }
}