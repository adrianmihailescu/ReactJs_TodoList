using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace TodoApp.Infrastructure.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private const string FilePath = "./data.json";

        public async Task<List<Todo>> GetTodosAsync()
        {
            if (!File.Exists(FilePath))
                return new List<Todo>();

            var jsonData = await File.ReadAllTextAsync(FilePath);
            return JsonConvert.DeserializeObject<List<Todo>>(jsonData) ?? new List<Todo>();
        }

        public async Task UpdateTodoStatusAsync(Todo todo)
        {
            var todos = await GetTodosAsync();
            var updatedTodo = todos.FirstOrDefault(t => t.Id == todo.Id);
            if (updatedTodo != null)
            {
                updatedTodo.Status = todo.Status;
                var json = JsonConvert.SerializeObject(todos, Formatting.Indented);
                await File.WriteAllTextAsync(FilePath, json);
            }
        }
    }
}
