using backend.Models;
using Bogus;

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
                    .RuleFor(u => u.ProficiencyLevel, f => f.PickRandom<ProficiencyLevel>())
                    .RuleFor(u => u.Role, f => f.PickRandom<Role>())
                    .RuleFor(u => u.Status, f => f.PickRandom<AvailabilityStatus>())
                    .RuleFor(u => u.UserProjects, f => new List<UserProject>())
                    .RuleFor(u => u.Technologies, f => new List<Technology>())
                    .RuleFor(u => u.TaskRole, f => f.PickRandom<TaskRole>())
                    .RuleFor(u => u.Tasks, f => new List<backend.Models.Task>());

                var users = faker.Generate(100);
                context.Users.AddRange(users);
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
                    .RuleFor(p => p.ProjectType, f => f.PickRandom<ProjectType>())
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count))
                    .RuleFor(p => p.Budget, f => f.Random.Decimal(100, 1000));

                var projects = projectFaker.Generate(12);
                context.Projects.AddRange(projects);
                context.SaveChanges();
            }

            if (!context.TaskLabels.Any())
            {
                var labels = new List<TaskLabel>
                    {
                        new TaskLabel { Label = "design" },
                        new TaskLabel { Label = "frontend" },
                        new TaskLabel { Label = "backend" },
                        new TaskLabel { Label = "database" }
                    };

                context.TaskLabels.AddRange(labels);
                context.SaveChanges();
            }

            if (!context.Tasks.Any())
            {
                var users = context.Users.ToList();
                var taskFaker = new Faker<backend.Models.Task>()
                    .RuleFor(t => t.Type, f => f.PickRandom<TaskType>())
                    .RuleFor(t => t.TaskName, f => f.Lorem.Sentence())
                    .RuleFor(t => t.DueDate, f => f.Date.Future())
                    .RuleFor(t => t.TaskLevel, f => f.PickRandom<TaskLevel>())
                    .RuleFor(t => t.Priority, f => f.PickRandom<Priority>())
                    .RuleFor(t => t.Status, f => f.PickRandom<TaskStatus>())
                    .RuleFor(t => t.ProjectId, f => f.Random.Int(1, context.Projects.ToList().Count))
                    .RuleFor(t => t.Progress, f => f.Random.Int(1, 100))
                    .RuleFor(t => t.TaskLabelId, f => f.Random.Int(1, context.TaskLabels.ToList().Count))
                    .RuleFor(t => t.EstimatedHours, f => f.Random.Double(1, 100))
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count));

                var tasks = taskFaker.Generate(150);
                context.Tasks.AddRange(tasks);
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

            if (!context.ChatMessages.Any())
            {
                var messageFaker = new Faker<ChatMessage>()
                    .RuleFor(m => m.Content, f => f.Lorem.Sentence())
                    .RuleFor(t => t.UserId, f => f.Random.Int(1, context.Users.ToList().Count))
                    .RuleFor(t => t.ProjectId, f => f.Random.Int(1, context.Projects.ToList().Count))
                    .RuleFor(m => m.SentAt, f => f.Date.Recent());

                var messages = messageFaker.Generate(200);
                context.ChatMessages.AddRange(messages);
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

        }
    }
}
