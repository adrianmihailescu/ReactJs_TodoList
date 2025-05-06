using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;

namespace TodoApp.Application.Services
{
    public class TodoService : ITodoService
    {
        private readonly string _filePath = "./data.json";

        public async Task<List<Todo>> GetTodosAsync(string type)
        {
            if (!File.Exists(_filePath))
                return new List<Todo>();

            var jsonData = await File.ReadAllTextAsync(_filePath);
            var todos = JsonConvert.DeserializeObject<List<Todo>>(jsonData) ?? new List<Todo>();

            if (!string.IsNullOrWhiteSpace(type) && !type.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                todos = todos.Where(t => t.Type?.Equals(type, StringComparison.OrdinalIgnoreCase) ?? false).ToList();
            }

            return todos;
        }

        public async Task<Todo> UpdateTodoStatusAsync(string id, string status)
        {
            if (!File.Exists(_filePath))
                return null;

            var jsonData = await File.ReadAllTextAsync(_filePath);
            var todos = JsonConvert.DeserializeObject<List<Todo>>(jsonData) ?? new List<Todo>();

            var todo = todos.FirstOrDefault(t => t.Id == id);
            if (todo == null)
                return null;

            todo.Status = status;

            var updatedJson = JsonConvert.SerializeObject(todos, Formatting.Indented);
            await File.WriteAllTextAsync(_filePath, updatedJson);

            return todo;
        }
    }
}
