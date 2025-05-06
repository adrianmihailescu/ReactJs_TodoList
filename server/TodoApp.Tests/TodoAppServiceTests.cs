namespace TodoApp.Tests;
using TodoApp.Application.Services;
using TodoApp.Domain.Interfaces;
using TodoApp.Domain.Models;

using Moq;

public class TodoAppServiceTests
{
    private readonly Mock<ITodoRepository> _todoRepositoryMock;
    private readonly TodoService _todoService;

    public TodoAppServiceTests()
    {
        _todoRepositoryMock = new Mock<ITodoRepository>();
        _todoService = new TodoService(_todoRepositoryMock.Object);
    }

    #region async tests
    [Fact]
    public async Task GetTodosAsync_ShouldReturnFilteredTodos_WhenTypeIsGiven()
    {
        // Arrange
        var todos = new List<Todo>
        {
            new Todo { Id = "1", Type = "Work" },
            new Todo { Id = "2", Type = "Personal" }
        };

        _todoRepositoryMock
            .Setup(r => r.GetTodosAsync())
            .ReturnsAsync(todos);

        // Act
        var result = await _todoService.GetTodosAsync("Work");
        Console.WriteLine($"Returned todos: {string.Join(",", result.Select(t => t.Type))}");

        // Assert
        Assert.Single(result);
        Assert.Equal("Work", result[0].Type);
    }

    [Fact]
    public async Task UpdateTodoStatusAsync_ShouldUpdateStatus_WhenTodoExists()
    {
        // Arrange
        var todo = new Todo { Id = "1", Status = "Pending" };
        var todos = new List<Todo> { todo };

        _todoRepositoryMock.Setup(r => r.GetTodosAsync()).ReturnsAsync(todos);
        _todoRepositoryMock.Setup(r => r.UpdateTodoStatusAsync(It.IsAny<Todo>())).Returns(Task.CompletedTask);

        // Act
        var result = await _todoService.UpdateTodoStatusAsync("1", "Completed");

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Completed", result.Status);
    }

    [Fact]
    public async Task UpdateTodoStatusAsync_ShouldReturnNull_WhenTodoNotFound()
    {
        // Arrange
        _todoRepositoryMock
            .Setup(r => r.GetTodosAsync())
            .ReturnsAsync(new List<Todo>());

        // Act
        var result = await _todoService.UpdateTodoStatusAsync("999", "Completed");

        // Assert
        Assert.Null(result);
        _todoRepositoryMock.Verify(r => r.UpdateTodoStatusAsync(It.IsAny<Todo>()), Times.Never);
    }

    #endregion async tests
}
