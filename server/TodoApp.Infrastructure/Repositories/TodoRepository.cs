using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;
using System.Collections.Generic;
using System.IO;
using Newtonsoft.Json;

namespace TodoApp.Infrastructure.Repositories
{
    public class TodoRepository : ITodoRepository
    {
        private const string FilePath = "./data.json";

        public List<Todo> GetTodos()
        {
            var jsonData = File.ReadAllText(FilePath);
            return JsonConvert.DeserializeObject<List<Todo>>(jsonData);
        }

        public void UpdateTodoStatus(Todo todo)
        {
            var todos = GetTodos();
            var updatedTodo = todos.FirstOrDefault(t => t.Id == todo.Id);
            if (updatedTodo != null)
            {
                updatedTodo.Status = todo.Status;
                File.WriteAllText(FilePath, JsonConvert.SerializeObject(todos, Formatting.Indented));
            }
        }
    }
}
