using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApp.Application.Services;
using TodoApp.Domain.Models;
using TodoApp.Domain.Interfaces;

namespace TodoApp.API.Controllers
{
    [ApiController]
    [EnableCors("AnyPolicy")]
    [Route("api/todos")]
    public class TodoController : ControllerBase
    {
        private readonly ILogger<TodoController> _logger;
        private readonly IMemoryCache _cache;
        private readonly ITodoService _todoService;
        private const string CacheKey = "todos";

        public TodoController(ILogger<TodoController> logger, IMemoryCache cache, ITodoService todoService)
        {
            _logger = logger;
            _cache = cache;
            _todoService = todoService;
        }

        [HttpGet]
        public async Task<IEnumerable<Todo>> Get([FromQuery] string type)
        {
            var cacheKey = string.IsNullOrWhiteSpace(type) || type.Equals("All", StringComparison.OrdinalIgnoreCase)
                ? "todos_all"
                : $"todos_type_{type.ToLower()}";

            if (!_cache.TryGetValue(cacheKey, out List<Todo> todos))
            {
                todos = await _todoService.GetTodosAsync(type);
                _cache.Set(cacheKey, todos, TimeSpan.FromMinutes(10));
            }

            return todos;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put(string id, [FromBody] Todo updatedTodo)
        {
            try
            {
                var todo = await _todoService.UpdateTodoStatusAsync(id, updatedTodo.Status);
                if (todo == null)
                {
                    return NotFound($"Todo with ID {id} not found.");
                }

                _cache.Remove("todos_all");
                _cache.Remove("todos_type_results");
                _cache.Remove("todos_type_wins");
                _cache.Remove("todos_type_withdraw");

                // Refresh all todos cache
                var allTodos = await _todoService.GetTodosAsync("All");
                _cache.Set(CacheKey, allTodos, TimeSpan.FromMinutes(10));

                return Ok(todo);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to update Todo item.");
                return StatusCode(500, "Internal server error.");
            }
        }
    }
}
