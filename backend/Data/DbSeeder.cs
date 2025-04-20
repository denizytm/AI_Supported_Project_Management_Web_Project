using backend.Models;
using Bogus;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            if (!context.Users.Any())
            {
                var faker = new Faker<User>()
                    .RuleFor(u => u.Name, f => f.Name.FirstName())
                    .RuleFor(u => u.LastName, f => f.Name.LastName())
                    .RuleFor(u => u.Email, f => f.Internet.Email())
                    .RuleFor(u => u.Password, f => f.Internet.Password(10))
                    .RuleFor(u => u.Birth, f => f.Date.Between(new DateTime(1970, 1, 1), new DateTime(2003, 12, 31)))
                    .RuleFor(u => u.Gender, f => f.PickRandom<Gender>())
                    .RuleFor(u => u.Phone, f => f.Phone.PhoneNumber("5##-###-####"))
                    .RuleFor(u => u.Role, f => f.PickRandom<Role>())
                    .RuleFor(u => u.ProficiencyLevel, f => f.PickRandom<ProficiencyLevel>())
                    .RuleFor(u => u.Status, f => f.PickRandom<AvailabilityStatus>())
                    .RuleFor(u => u.TaskRole, f => f.PickRandom<TaskRole>())
                    .RuleFor(u => u.UserProjects, f => new List<UserProject>())
                    .RuleFor(u => u.Technologies, f => new List<Technology>())
                    .RuleFor(u => u.Tasks, f => new List<backend.Models.Task>())
                    .RuleFor(u => u.ManagerId, f => null); // FK çakışmaması için önce boş

                var users = faker.Generate(100);

                // 1. önce users'ı ekle ve ID'lerin oluşmasını sağla
                context.Users.AddRange(users);
                context.SaveChanges();

                // 2. şimdi manager'ları eşleştir
                var allUsers = context.Users.ToList();
                var itManagers = allUsers.Where(u => u.Role == Role.ItManager).ToList();
                var developers = allUsers.Where(u => u.Role == Role.Developer).ToList();
                var random = new Random();

                foreach (var dev in developers)
                {
                    if (itManagers.Any())
                    {
                        var randomManager = itManagers[random.Next(itManagers.Count)];
                        dev.ManagerId = randomManager.Id;
                    }
                }

                context.Users.UpdateRange(developers);
                context.SaveChanges();
            }



            if (!context.ProjectTypes.Any())
            {
                var names = new List<ProjectType>
                    {
                        new ProjectType { Name = "Web" },
                        new ProjectType { Name = "Mobile" },
                        new ProjectType { Name = "AI" },
                        new ProjectType { Name = "ERP" },
                        new ProjectType { Name = "Application" },
                    };

                context.ProjectTypes.AddRange(names);
                context.SaveChanges();
            }

            if (!context.Projects.Any())
            {
                var projectFaker = new Faker<Project>()
                    .RuleFor(p => p.Name, f => f.Company.CompanyName())
                    .RuleFor(p => p.Description, f => f.Lorem.Paragraph())
                    .RuleFor(p => p.StartDate, f => f.Date.Past(1))
                    .RuleFor(p => p.Deadline, f => f.Date.Future(1))
                    .RuleFor(p => p.Progress, f => f.Random.Int(1, 100))
                    .RuleFor(p => p.Status, f => f.PickRandom<ProjectStatus>())
                    .RuleFor(p => p.Priority, f => f.PickRandom<ProjectPriority>())
                    .RuleFor(p => p.ProjectTypeId, f => f.Random.Int(1, context.ProjectTypes.ToList().Count))
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count))
                    .RuleFor(p => p.Budget, f => f.Random.Decimal(100, 1000));

                var projects = projectFaker.Generate(12);
                context.Projects.AddRange(projects);
                context.SaveChanges();
            }

            if (!context.UserProjects.Any())
            {

                var users = context.Users.ToList();
                var projects = context.Projects.ToList();

                var faker = new Faker();

                foreach (User user in users)
                {
                    var randomProject = faker.PickRandom(projects);
                    user.UserProjects.Add(new UserProject { UserId = user.Id, ProjectId = randomProject.Id });
                }

                context.SaveChanges();

            }

            if (!context.TaskTypes.Any())
            {
                var names = new List<TaskType>
                    {
                        new TaskType { Name = "Research" },
                        new TaskType { Name = "Design" },
                        new TaskType { Name = "Development" },
                        new TaskType { Name = "Testing" },
                        new TaskType { Name = "Bugfix" },
                    };

                context.TaskTypes.AddRange(names);
                context.SaveChanges();
            }

            if (!context.TaskLabels.Any())
            {
                var labels = new List<TaskLabel>
                    {
                        new TaskLabel { Label = "Frontend" },
                        new TaskLabel { Label = "Backend" },
                        new TaskLabel { Label = "AI" },
                        new TaskLabel { Label = "Mobile" },
                        new TaskLabel { Label = "UX/UI" },
                        new TaskLabel { Label = "Database" }
                    };

                context.TaskLabels.AddRange(labels);
                context.SaveChanges();
            }

            if (!context.Tasks.Any())
            {
                var users = context.Users.ToList();
                var taskFaker = new Faker<backend.Models.Task>()
                    .RuleFor(t => t.Description, f => f.Lorem.Sentence())
                    .RuleFor(t => t.TaskTypeId, f => f.Random.Int(1, context.TaskTypes.ToList().Count))
                    .RuleFor(t => t.StartDate, f => f.Date.Between(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31)))
                    .RuleFor(t => t.DueDate, (f, t) => f.Date.Between(t.StartDate.AddDays(1), t.StartDate.AddDays(30)))
                    .RuleFor(t => t.TaskLevel, f => f.PickRandom<TaskLevel>())
                    .RuleFor(t => t.Priority, f => f.PickRandom<Priority>())
                    .RuleFor(t => t.Status, f => f.PickRandom<TaskStatus>())
                    .RuleFor(t => t.ProjectId, f => f.Random.Int(1, context.Projects.ToList().Count))
                    .RuleFor(t => t.Progress, f => f.Random.Int(1, 100))
                    .RuleFor(t => t.TaskLabelId, f => f.Random.Int(1, context.TaskLabels.ToList().Count))
                    .RuleFor(t => t.UserId, (f, t) =>
                    {
                        if (t.TaskLevelName == "Beginner")
                        {
                            var userIds = context.UserProjects
                                .Where(up => up.ProjectId == t.ProjectId)
                                .Select(up => up.UserId)
                                .ToList();

                            return userIds.Any() ? f.PickRandom(userIds) : 1;
                        }
                        else if (t.TaskLevelName == "Intermediate")
                        {
                            var userIds = context.UserProjects
                                .Where(up => up.ProjectId == t.ProjectId)
                                .Include(up => up.User)
                                .Where(up => up.User.ProficiencyLevel != ProficiencyLevel.Beginner)
                                .Select(up => up.UserId)
                                .ToList();

                            return userIds.Any() ? f.PickRandom(userIds) : 1;
                        }
                        else
                        {
                            var userIds = context.UserProjects
                                .Where(up => up.ProjectId == t.ProjectId)
                                .Include(up => up.User)
                                .Where(up => up.User.ProficiencyLevel == ProficiencyLevel.Expert)
                                .Select(up => up.UserId)
                                .ToList();

                            return userIds.Any() ? f.PickRandom(userIds) : 1;
                        }
                    });


                var tasks = taskFaker.Generate(150);
                context.Tasks.AddRange(tasks);
                context.SaveChanges();

                var projects = context.Projects.ToList();
                var random = new Random();

                foreach (var project in projects)
                {
                    var projectTasks = tasks.Where(t => t.ProjectId == project.Id).ToList();

                    foreach (var task in projectTasks)
                    {
                        if (projectTasks.Count > 1 && random.NextDouble() < 0.7)
                        {
                            var potentialPredecessors = projectTasks
                                .Where(t => t.Id != task.Id && t.DueDate < task.StartDate && task.TaskTypeId == t.TaskTypeId)
                                .ToList();

                            if (potentialPredecessors.Any())
                            {
                                task.TaskId = potentialPredecessors.OrderBy(_ => Guid.NewGuid()).First().Id;
                            }
                        }
                    }
                }

                context.SaveChanges();
            }

            if (!context.Technologies.Any())
            {
                var technologyFaker = new Faker<Technology>()
                    .RuleFor(t => t.Name, f => f.Commerce.Department());

                var technologies = technologyFaker.Generate(20);
                context.Technologies.AddRange(technologies);
                context.SaveChanges();
            }

            if (!context.Resources.Any())
            {
                var resourceFaker = new Faker<Resource>()
                    .RuleFor(r => r.Name, f => f.Commerce.ProductName())
                    .RuleFor(r => r.Type, f => f.PickRandom<ResourceType>())
                    .RuleFor(r => r.Cost, f => f.Random.Double(100, 10000));

                var resources = resourceFaker.Generate(30);
                context.Resources.AddRange(resources);
                context.SaveChanges();
            }

            if (!context.ChatSessions.Any())
            {
                var sessionFaker = new Faker<ChatSession>()
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count))
                    .RuleFor(m => m.CreatedAt, f => f.Date.Recent());

                var sessions = sessionFaker.Generate(200);
                context.ChatSessions.AddRange(sessions);
                context.SaveChanges();
            }

            if (!context.ChatMessages.Any())
            {
                var messageFaker = new Faker<ChatMessage>()
                    .RuleFor(m => m.Content, f => f.Lorem.Sentence())
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count))
                    .RuleFor(t => t.ChatSessionId, f => f.Random.Int(1, context.ChatSessions.ToList().Count))
                    .RuleFor(m => m.SentAt, f => f.Date.Recent());

                var messages = messageFaker.Generate(200);
                context.ChatMessages.AddRange(messages);
                context.SaveChanges();
            }

        }
    }
}
