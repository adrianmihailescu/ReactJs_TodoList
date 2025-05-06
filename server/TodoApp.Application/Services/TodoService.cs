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
        
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<List<Todo>> GetTodosAsync(string type)
        {
            var todos = await _todoRepository.GetTodosAsync();

            // If a type filter is provided, filter the todos
            if (!string.IsNullOrWhiteSpace(type) && !type.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                todos = todos.Where(t => t.Type?.Equals(type, StringComparison.OrdinalIgnoreCase) ?? false).ToList();
            }

            return todos;
        }

        public async Task<Todo> UpdateTodoStatusAsync(string id, string status)
        {
            // Get the list of todos from the repository
            var todos = await _todoRepository.GetTodosAsync();
            var todo = todos.FirstOrDefault(t => t.Id == id);

            if (todo == null)
                return null;
                
            todo.Status = status;
            
            await _todoRepository.UpdateTodoStatusAsync(todo);

            return todo;
        }
    }
}
