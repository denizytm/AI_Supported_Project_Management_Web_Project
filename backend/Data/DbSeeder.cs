using backend.Models;
using Bogus;
using Microsoft.EntityFrameworkCore;

namespace backend.Data
{
    public static class DbSeeder
    {
        public static void Seed(ApplicationDbContext context)
        {
            var random = new Random();

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
                    .RuleFor(u => u.Status, _ => AvailabilityStatus.Available)
                    .RuleFor(u => u.TaskRole, f => f.PickRandom<TaskRole>())
                    .RuleFor(u => u.UserProjects, _ => new List<UserProject>())
                    .RuleFor(u => u.Tasks, _ => new List<backend.Models.Task>())
                    .RuleFor(u => u.IsActive, _ => true)
                    .RuleFor(u => u.ManagerId, _ => null);

                var users = faker.Generate(200);

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
            }

            if (!context.ProjectTypes.Any())
            {
                var types = new[] { "ERP", "Web", "Mobile", "Application", "AI" }
                    .Select(name => new ProjectType { Name = name }).ToList();

                context.ProjectTypes.AddRange(types);
                context.SaveChanges();
            }

            if (!context.Projects.Any())
            {
                var managers = context.Users.Where(u => u.Role == Role.ProjectManager).ToList();
                var clients = context.Users.Where(u => u.Role == Role.Client).ToList();
                var typeCount = context.ProjectTypes.Count();

                var projects = new List<Project>();
                var sessions = new List<ChatSession>();
                var requests = new List<ProjectRequest>();

                for (int i = 0; i < 6; i++)
                {
                    var manager = managers[random.Next(managers.Count)];
                    var client = clients[random.Next(clients.Count)];

                    var p = new Project
                    {
                        Name = new Faker().Company.CompanyName(),
                        Description = new Faker().Lorem.Paragraph(),
                        StartDate = DateTime.UtcNow.AddDays(-random.Next(1, 100)),
                        Deadline = DateTime.UtcNow.AddDays(random.Next(30, 90)),
                        Progress = 0,
                        Status = ProjectStatus.Active,
                        Priority = ProjectPriority.Medium,
                        ProjectTypeId = random.Next(1, typeCount + 1),
                        ManagerId = manager.Id,
                        CustomerId = client.Id,
                        Budget = random.Next(1000, 10000),
                        SpentBudget = random.Next(0, 5000)
                    };

                    projects.Add(p);

                    sessions.Add(new ChatSession
                    {
                        User1Id = p.ManagerId,
                        User2Id = p.CustomerId,
                        StartedAt = DateTime.UtcNow
                    });

                    for (int j = 0; j < random.Next(1, 4); j++)
                    {
                        requests.Add(new ProjectRequest
                        {
                            Project = p,
                            RequestedById = manager.Id,
                            Description = new Faker().Lorem.Sentence(),
                            CriticLevel = new Faker().PickRandom<CriticLevel>(),
                            IsClosed = false,
                            CreatedAt = DateTime.UtcNow
                        });
                    }
                }

                context.Projects.AddRange(projects);
                context.ChatSessions.AddRange(sessions);
                context.ProjectRequests.AddRange(requests);
                context.SaveChanges();
            }

            if (!context.UserProjects.Any())
            {
                var devs = context.Users.Where(u => u.Role == Role.Developer).ToList();
                var projects = context.Projects.ToList();

                var assignments = devs.Select(dev => new UserProject
                {
                    UserId = dev.Id,
                    ProjectId = projects[random.Next(projects.Count)].Id
                }).ToList();

                context.UserProjects.AddRange(assignments);
                context.SaveChanges();
            }

            if (!context.TaskTypes.Any())
            {
                var taskTypes = new[] { "Research", "Design", "Development", "Testing", "Bugfix" }
                    .Select(name => new TaskType { Name = name }).ToList();

                context.TaskTypes.AddRange(taskTypes);
                context.SaveChanges();
            }

            if (!context.TaskLabels.Any())
            {
                var taskLabels = new[] { "Frontend", "Designer", "Backend", "AI", "Mobile", "Fullstack" }
                    .Select(label => new TaskLabel { Label = label }).ToList();

                context.TaskLabels.AddRange(taskLabels);
                context.SaveChanges();
            }

            if (!context.Tasks.Any())
            {
                var taskFaker = new Faker<backend.Models.Task>()
                    .RuleFor(t => t.Description, f => f.Lorem.Sentence())
                    .RuleFor(t => t.TaskTypeId, f => f.Random.Int(1, context.TaskTypes.Count()))
                    .RuleFor(t => t.StartDate, f => f.Date.Between(new DateTime(2025, 1, 1), new DateTime(2025, 12, 31)))
                    .RuleFor(t => t.DueDate, (f, t) => f.Date.Between(t.StartDate.AddDays(1), t.StartDate.AddDays(30)))
                    .RuleFor(t => t.TaskLevel, f => f.PickRandom<TaskLevel>())
                    .RuleFor(t => t.Priority, f => f.PickRandom<Priority>())
                    .RuleFor(t => t.ProjectId, f => f.Random.Int(1, context.Projects.Count()))
                    .RuleFor(t => t.TaskLabelId, f => f.Random.Int(1, context.TaskLabels.Count()))
                    .RuleFor(t => t.UserId, _ => null)
                    .RuleFor(t => t.Status, _ => TaskStatus.ToDo);

                var tasks = taskFaker.Generate(150);
                context.Tasks.AddRange(tasks);
                context.SaveChanges();
            }
        }
    }
}