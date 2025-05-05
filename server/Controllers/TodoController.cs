using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

[ApiController]
[EnableCors("AnyPolicy")]
[Route("api/todos")]
public class TodoController : ControllerBase
{
  private readonly ILogger<TodoController> _logger;
  private readonly IMemoryCache _cache;
  private const string CacheKey = "todos";

  public TodoController(ILogger<TodoController> logger, IMemoryCache cache)
  {
    _logger = logger;
    _cache = cache;
  }

  [HttpGet]
  public IEnumerable<Todo> Get([FromQuery] string type)
  {
      if (!_cache.TryGetValue(CacheKey, out List<Todo> todos))
      {
          using (StreamReader r = new StreamReader("./data.json"))
          {
              string json = r.ReadToEnd();
              todos = JsonConvert.DeserializeObject<List<Todo>>(json);
              _cache.Set(CacheKey, todos, TimeSpan.FromMinutes(10)); // cache for 10 min
          }
      }

      if (!string.IsNullOrEmpty(type) && type != "All")
      {
          todos = todos.Where(t => t.Type?.Equals(type, StringComparison.OrdinalIgnoreCase) == true).ToList();
      }

      return todos;
  }

  [HttpPut("{id}")]
  public IActionResult Put(string id, [FromBody] Todo updatedTodo)
  {
      try
      {
          var filePath = "./data.json";

          // Read all todos
          var jsonData = System.IO.File.ReadAllText(filePath);
          var todos = JsonConvert.DeserializeObject<List<Todo>>(jsonData);

          if (todos == null)
              return NotFound("Todo list is empty.");

          // Find the todo with the given id
          var todo = todos.FirstOrDefault(t => t.Id == id);

          if (todo == null)
              return NotFound($"Todo with ID {id} not found.");

          // Update only allowed fields, like status
          todo.Status = updatedTodo.Status;

          // Save back to file
          var updatedJson = JsonConvert.SerializeObject(todos, Formatting.Indented);
          System.IO.File.WriteAllText(filePath, updatedJson);

          // keep cache valid for 10 minutes
          _cache.Set(CacheKey, todos, TimeSpan.FromMinutes(10));

          return Ok(todo);
      }
      catch (Exception ex)
      {
          _logger.LogError(ex, "Failed to update Todo item.");
          return StatusCode(500, "Internal server error.");
      }
  }

}