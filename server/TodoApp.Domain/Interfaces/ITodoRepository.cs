using System.Collections.Generic;
using TodoApp.Domain.Models;

namespace TodoApp.Domain.Interfaces
{
    public interface ITodoRepository
    {
        List<Todo> GetTodos();
        void UpdateTodoStatus(Todo todo);
    }
}
