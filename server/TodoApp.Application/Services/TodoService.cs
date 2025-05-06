using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;
using System.Collections.Generic;
using System.Linq;

namespace TodoApp.Application.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public List<Todo> GetTodos(string type)
        {
            var todos = _todoRepository.GetTodos();
            if (!string.IsNullOrEmpty(type) && type != "All")
            {
                todos = todos.Where(t => t.Type?.Equals(type, System.StringComparison.OrdinalIgnoreCase) ?? false).ToList();
            }
            return todos;
        }

        public Todo UpdateTodoStatus(string id, string status)
        {
            var todos = _todoRepository.GetTodos();
            var todo = todos.FirstOrDefault(t => t.Id == id);
            if (todo != null)
            {
                todo.Status = status;
                _todoRepository.UpdateTodoStatus(todo);
            }
            return todo;
        }
    }
}
