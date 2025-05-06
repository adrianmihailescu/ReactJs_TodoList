using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
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
        public IEnumerable<Todo> Get([FromQuery] string type)
        {
            if (!_cache.TryGetValue(CacheKey, out List<Todo> todos))
            {
                todos = _todoService.GetTodos(type);
                _cache.Set(CacheKey, todos, TimeSpan.FromMinutes(10));
            }

            return todos;
        }

        [HttpPut("{id}")]
        public IActionResult Put(string id, [FromBody] Todo updatedTodo)
        {
            try
            {
                var todo = _todoService.UpdateTodoStatus(id, updatedTodo.Status);
                if (todo == null)
                {
                    return NotFound($"Todo with ID {id} not found.");
                }

                // Update cache
                _cache.Set(CacheKey, _todoService.GetTodos("All"), TimeSpan.FromMinutes(10));

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
