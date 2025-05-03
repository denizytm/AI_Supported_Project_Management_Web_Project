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
                    .RuleFor(u => u.Company, f => f.Company.CompanyName())
                    .RuleFor(u => u.ProficiencyLevel, f => f.PickRandom<ProficiencyLevel>())
                    .RuleFor(u => u.Status, f => f.PickRandom<AvailabilityStatus>())
                    .RuleFor(u => u.TaskRole, f => f.PickRandom<TaskRole>())
                    .RuleFor(u => u.UserProjects, f => new List<UserProject>())
                    .RuleFor(u => u.Tasks, f => new List<backend.Models.Task>())
                    .RuleFor(u => u.IsActive, f => true)
                    .RuleFor(u => u.ManagerId, f => null);

                var users = faker.Generate(100);

                foreach (var user in users)
                {
                    if (user.Role == Role.Admin || user.Role == Role.Client)
                    {
                        user.TaskRole = default;
                        user.ProficiencyLevel = default;
                    }
                }

                context.Users.AddRange(users);
                context.SaveChanges();

                var allUsers = context.Users.ToList();
                var itManagers = allUsers.Where(u => u.Role == Role.ProjectManager).ToList();
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
                var itManagers = context.Users.Where(u => u.Role == Role.ProjectManager).ToList();
                var clients = context.Users.Where(u => u.Role == Role.Client).ToList();
                var random = new Random();

                var projectFaker = new Faker<Project>()
                    .RuleFor(p => p.Name, f => f.Company.CompanyName())
                    .RuleFor(p => p.Description, f => f.Lorem.Paragraph())
                    .RuleFor(p => p.StartDate, f => f.Date.Past(1))
                    .RuleFor(p => p.Deadline, f => f.Date.Future(1))
                    .RuleFor(p => p.Progress, f => f.Random.Int(1, 100))
                    .RuleFor(p => p.Status, f => f.PickRandom<ProjectStatus>())
                    .RuleFor(p => p.Priority, f => f.PickRandom<ProjectPriority>())
                    .RuleFor(p => p.ProjectTypeId, f => f.Random.Int(1, context.ProjectTypes.Count()))
                    .RuleFor(p => p.ManagerId, f => itManagers[random.Next(itManagers.Count)].Id)
                    .RuleFor(p => p.CustomerId, f => clients[random.Next(clients.Count)].Id)
                    .RuleFor(p => p.Budget, f => f.Random.Decimal(100, 10000));

                var projects = projectFaker.Generate(12);

                context.Projects.AddRange(projects);
                context.SaveChanges();

                foreach (var project in projects)
                {
                    var chatSession = new ChatSession
                    {
                        User1Id = project.ManagerId,
                        User2Id = project.CustomerId,
                        StartedAt = DateTime.UtcNow
                    };
                    context.ChatSessions.Add(chatSession);


                    var authorizedUsers = new List<int>();

                    authorizedUsers.Add(project.ManagerId);

                    authorizedUsers.Add(project.CustomerId);

                    var developerIds = context.UserProjects
                        .Where(up => up.ProjectId == project.Id && up.User.Role == Role.Developer)
                        .Select(up => up.UserId)
                        .ToList();

                    authorizedUsers.AddRange(developerIds);

                    int requestCount = random.Next(1, 5);

                    for (int i = 0; i < requestCount; i++)
                    {
                        var requesterId = authorizedUsers[random.Next(authorizedUsers.Count)];

                        var projectRequest = new ProjectRequest
                        {
                            ProjectId = project.Id,
                            RequestedById = requesterId,
                            Description = new Faker().Lorem.Sentence(10),
                            CriticLevel = new Faker().PickRandom<CriticLevel>(),
                            IsClosed = false,
                            CreatedAt = DateTime.UtcNow
                        };

                        context.ProjectRequests.Add(projectRequest);
                    }
                }

                context.SaveChanges();
            }


            if (!context.UserProjects.Any())
            {
                var users = context.Users
                    .Where(u => u.Role == Role.Developer)
                    .ToList();

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
                    .RuleFor(t => t.TaskTypeId, f => f.Random.Int(1, context.TaskTypes.Count()))
                    .RuleFor(t => t.StartDate, f => f.Date.Between(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31)))
                    .RuleFor(t => t.DueDate, (f, t) => f.Date.Between(t.StartDate.AddDays(1), t.StartDate.AddDays(30)))
                    .RuleFor(t => t.TaskLevel, f => f.PickRandom<TaskLevel>())
                    .RuleFor(t => t.Priority, f => f.PickRandom<Priority>())
                    .RuleFor(t => t.ProjectId, f => f.Random.Int(1, context.Projects.Count()))
                    .RuleFor(t => t.TaskLabelId, f => f.Random.Int(1, context.TaskLabels.Count()))
                    .RuleFor(t => t.UserId, (f, t) =>
                        {
                            List<int> userIds;

                            if (t.TaskLevelName == "Beginner")
                            {
                                userIds = context.UserProjects
                                    .Where(up => up.ProjectId == t.ProjectId)
                                    .Select(up => up.UserId)
                                    .ToList();
                            }
                            else if (t.TaskLevelName == "Intermediate")
                            {
                                userIds = context.UserProjects
                                    .Where(up => up.ProjectId == t.ProjectId)
                                    .Include(up => up.User)
                                    .Where(up => up.User.ProficiencyLevel != ProficiencyLevel.Junior)
                                    .Select(up => up.UserId)
                                    .ToList();
                            }
                            else
                            {
                                userIds = context.UserProjects
                                    .Where(up => up.ProjectId == t.ProjectId)
                                    .Include(up => up.User)
                                    .Where(up => up.User.ProficiencyLevel == ProficiencyLevel.Senior)
                                    .Select(up => up.UserId)
                                    .ToList();
                            }

                            return userIds.Any()
                                ? (f.Random.Double() < 0.35 ? null : f.PickRandom(userIds))
                                : null;

                        })
                    .RuleFor(t => t.Status, (f, t) =>
                    {
                        if (t.UserId.HasValue)
                        {
                            return f.Random.Double() < 0.3 ? TaskStatus.Done : TaskStatus.InProgress;
                        }
                        else
                        {
                            return TaskStatus.ToDo;
                        }
                    });


                var tasks = taskFaker.Generate(100);
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

        }
    }
}
