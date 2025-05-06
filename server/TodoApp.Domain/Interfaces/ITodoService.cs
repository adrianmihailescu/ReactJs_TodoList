using TodoApp.Domain.Models;
using System.Collections.Generic;

namespace TodoApp.Domain.Interfaces
{
    public interface ITodoService
    {
        List<Todo> GetTodos(string type);
        Todo UpdateTodoStatus(string id, string status);
    }
}
