using TodoApp.Domain.Models;
using System.Collections.Generic;

namespace TodoApp.Domain.Interfaces
{
    public interface ITodoService
    {
        Task<List<Todo>> GetTodosAsync(string type);
        Task<Todo> UpdateTodoStatusAsync(string id, string status);
    }
}
