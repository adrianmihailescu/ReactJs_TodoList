using Microsoft.Extensions.Caching.Memory;
using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;

namespace TodoApp.Application.Services{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;
        private readonly IMemoryCache _cache;

        public TodoService(ITodoRepository todoRepository, IMemoryCache cache)
        {
            _todoRepository = todoRepository;
            _cache = cache;
        }

        public async Task<List<Todo>> GetTodosAsync(string type)
        {
            string cacheKey = $"todos_{type?.ToLower() ?? "all"}";

            if (!_cache.TryGetValue(cacheKey, out List<Todo> todos))
            {
                todos = await _todoRepository.GetTodosAsync();

                if (!string.IsNullOrWhiteSpace(type) && !type.Equals("All", StringComparison.OrdinalIgnoreCase))
                {
                    todos = todos.Where(t => t.Type?.Equals(type, StringComparison.OrdinalIgnoreCase) ?? false).ToList();
                }

                _cache.Set(cacheKey, todos, TimeSpan.FromMinutes(5));
            }

            return todos;
        }

        public async Task<Todo> UpdateTodoStatusAsync(string id, string status)
        {
            var todos = await _todoRepository.GetTodosAsync();
            var todo = todos.FirstOrDefault(t => t.Id == id);

            if (todo == null)
                return null;

            todo.Status = status;
            await _todoRepository.UpdateTodoStatusAsync(todo);

            // Invalidate the cache since data changed
            _cache.Remove("todos_all");
            _cache.Remove($"todos_{todo.Type?.ToLower()}");

            return todo;
        }
    }
}

