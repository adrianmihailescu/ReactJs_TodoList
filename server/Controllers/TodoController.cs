using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

[ApiController]
[EnableCors("AnyPolicy")]
[Route("api/todos")]
public class TodoController : ControllerBase
{
  private readonly ILogger<TodoController> _logger;

  public TodoController(ILogger<TodoController> logger)
  {
    _logger = logger;
  }

  [HttpGet]
  public IEnumerable<Todo> Get([FromQuery] string type)
  {
      List<Todo> todos = new List<Todo>();
      using (StreamReader r = new StreamReader("./data.json"))
      {
          string json = r.ReadToEnd();
          todos = JsonConvert.DeserializeObject<List<Todo>>(json);
      }

      if (!string.IsNullOrEmpty(type))
      {
          todos = todos.Where(
            t => t.Type.Equals(type, StringComparison.OrdinalIgnoreCase) || type == "All"
            ).ToList();
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

          return Ok(todo);
      }
      catch (Exception ex)
      {
          _logger.LogError(ex, "Failed to update Todo item.");
          return StatusCode(500, "Internal server error.");
      }
  }

}