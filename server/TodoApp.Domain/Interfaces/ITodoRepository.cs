using System.Collections.Generic;
using System.Threading.Tasks;
using TodoApp.Domain.Models;

namespace TodoApp.Domain.Interfaces
{
    public interface ITodoRepository
    {
        Task<List<Todo>> GetTodosAsync();
        Task UpdateTodoStatusAsync(Todo todo);
    }
}
