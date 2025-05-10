using System.Text.Json;
using backend.Data;
using backend.Dtos.ChatbotMessage;
using backend.Interfaces;
using backend.Mappers;
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
        public async Task<string> SendMessageToModel(IChatCompletionService chatService, CreateChatbotMessageDto createChatModelDto)
        {

            var chatModel = createChatModelDto.FromCreateMessageToDto();

            var input = chatModel.Content;

            var previousMessages = await _context.ChatbotMessages
                .Where(m => m.UserId == chatModel.UserId)
                .OrderByDescending(m => m.SentAt)
                .Take(10)
                .OrderBy(m => m.SentAt)
                .ToListAsync();

            string historyPrompt = string.Join("\n", previousMessages.Select(m =>
                $"{(m.Sender == "user" ? "User" : "ai")}: {m.Content}"));

            string finalPrompt = $@"
                The following is a direct, natural conversation between a user and an AI assistant.
                Your task is to respond as the assistant would — clearly, concisely, and **without adding commentary, explanation, or alternatives**.

                Respond only with the assistant's message.

                {historyPrompt}
                User: {input}
                AI:"
            ;

            await _context.ChatbotMessages.AddAsync(new ChatbotMessage
            {
                Content = input,
                Sender = "user",
                UserId = chatModel.UserId
            });

            var response = await chatService.GetChatMessageContentAsync(finalPrompt);

            await _context.ChatbotMessages.AddAsync(new ChatbotMessage
            {
                Content = response?.ToString() ?? "No result",
                Sender = "ai",
                UserId = chatModel.UserId
            });

            await _context.SaveChangesAsync();

            return response?.ToString() ?? "No result";
        }

        [HttpGet("chat-log")]
        public async Task<IActionResult> GetChatLogForUser(int id)
        {

            var chatLog = await _context.ChatbotMessages.Where(cm => cm.UserId == id).Select(d => d.FromChatbotMessageTODto()).ToListAsync();

            if (chatLog == null) return Ok(new
            {
                chatLog = new List<ChatbotMessage>()
            });

            return Ok(new
            {
                chatLog
            });
        }

        [HttpGet("assign-tasks")]
        public async Task<IActionResult> AssignTasksToUsers(IChatCompletionService chatService, int ProjectId)
        {
            var unassignedTasks = await _context.Tasks
                .Where(t => t.ProjectId == ProjectId)
                .Where(t => t.Status == TaskStatus.ToDo)
                .Include(t => t.TaskType)
                .Include(t => t.TaskLabel)
                .ToListAsync();

            var availableUsers = await _context.UserProjects
                .Where(uP => uP.ProjectId == ProjectId)
                .Where(uP => uP.User.Status == AvailabilityStatus.Available)
                .Include(uP => uP.User)
                .Select(uP => uP.User)
                .ToListAsync();

            if (!unassignedTasks.Any() || !availableUsers.Any())
            {
                return NotFound("No available task or users has found.");
            }

            const int batchSize = 5;
            List<List<Models.Task>> taskBatches = unassignedTasks
                .Select((task, index) => new { task, index })
                .GroupBy(x => x.index / batchSize)
                .Select(g => g.Select(x => x.task).ToList())
                .Take(3)
                .ToList();

            List<object> allAssignments = new List<object>();
            List<string> responseList = new List<string>();

            foreach (var batch in taskBatches)
            {
                string pastAssignments = string.Join(",\n", allAssignments.Select(a =>
                    $"{{ \"UserId\": {a.GetType().GetProperty("UserId")?.GetValue(a)}, \"TaskId\": {a.GetType().GetProperty("TaskId")?.GetValue(a)} }}"));

                string prompt = $@"
                You are an AI assistant that assigns tasks to the most suitable users.

                Objective: Assign tasks to users based on skills, time, and allowed capacity.

                Previous Assignments:
                [
                    {pastAssignments}
                ]

                Tasks to Assign:
                {string.Join("\n", batch.Select(t => $@"
                - Task ID: {t.Id}
                  Description: {t.Description}
                  Level: {t.TaskLevel} (0 = Beginner, 1 = Intermediate, 2 = Expert)
                  Priority: {t.Priority}
                  Label: {t.TaskLabel.Label}
                  Start: {t.StartDate}
                  Due: {t.DueDate}
                "))}

                Available Users:
                {string.Join("\n", availableUsers.Select(u => $@"
                - User ID: {u.Id}
                  Name: {u.Name} {u.LastName}
                  ProficiencyLevel: {u.ProficiencyLevel} (0 = Beginner, 1 = Intermediate, 2 = Expert)
                  TaskRole: {u.TaskRole}
                "))}

                **Assignment Rules (strictly enforce all):**
                1. A user's `ProficiencyLevel` must be **equal to or greater** than the task's `TaskLevel`.
                2. A user can only be assigned tasks that match their `TaskRole` and the task's `Label`.
                3. Assigned tasks for the same user **must not overlap** in date ranges.
                4. Task limits per user:
                   - Beginner → max 1 task
                   - Intermediate → max 2 tasks
                   - Expert → max 3 tasks
                5. If a task cannot be assigned, use: `AssignedUserId = 0`.

                **Output must be valid JSON. No extra text or explanation. Example:**
                    [
                        {{ ""TaskId"": 101, ""AssignedUserId"": 55 }},
                        {{ ""TaskId"": 102, ""AssignedUserId"": 0 }}
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
                var userMap = availableUsers.ToDictionary(u => u.Id, u => u);

                var preValidAssignments = assignments
                    .Where(a => a.AssignedUserId != 0 && validUserIds.Contains(a.AssignedUserId))
                    .Where(a =>
                    {
                        var task = batch.FirstOrDefault(t => t.Id == a.TaskId);
                        var user = userMap[a.AssignedUserId];

                        if (task == null || user == null)
                            return false;

                        if (task.TaskLabel.Label != user.TaskRole.ToString())
                            return false;

                        if ((int?)user.ProficiencyLevel < (int)task.TaskLevel)
                            return false;

                        return true;
                    })
                    .ToList();

                var validAssignments = new List<TaskAssignment>();
                var grouped = preValidAssignments.GroupBy(a => a.AssignedUserId);

                foreach (var group in grouped)
                {
                    var user = userMap[group.Key];
                    int limit = user.ProficiencyLevel switch
                    {
                        ProficiencyLevel.Junior => 1,
                        ProficiencyLevel.Mid => 2,
                        ProficiencyLevel.Senior => 3,
                        _ => 1
                    };

                    var userAssignedTasks = new List<Models.Task>();

                    foreach (var assignment in group)
                    {
                        var task = batch.FirstOrDefault(t => t.Id == assignment.TaskId);
                        if (task == null) continue;

                        bool overlaps = userAssignedTasks.Any(existing =>
                            task.StartDate <= existing.DueDate && task.DueDate >= existing.StartDate);

                        if (!overlaps && userAssignedTasks.Count < limit)
                        {
                            validAssignments.Add(assignment);
                            userAssignedTasks.Add(task);
                        }
                    }
                }

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
                }
            }

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Assignments confirmed and saved." });
        }

    }
}