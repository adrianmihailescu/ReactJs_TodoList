namespace TodoApp.Tests;

public class TodoAppServiceTests
{
    private readonly Mock<ITodoRepository> _todoRepositoryMock;
    private readonly TodoService _todoService;

    public TodoServiceTests()
    {
        _todoRepositoryMock = new Mock<ITodoRepository>();
        _todoService = new TodoService(_todoRepositoryMock.Object);
    }

    [Fact]
    public void GetTodos_ShouldReturnFilteredTodos_WhenTypeIsGiven()
    {
        // Arrange
        var todos = new List<Todo>
        {
            new Todo { Id = "1", Type = "Work" },
            new Todo { Id = "2", Type = "Personal" }
        };

        _todoRepositoryMock.Setup(r => r.GetTodos()).Returns(todos);

        // Act
        var result = _todoService.GetTodos("Work");

        // Assert
        Assert.Single(result);
        Assert.Equal("Work", result[0].Type);
    }

    [Fact]
    public void UpdateTodoStatus_ShouldUpdateStatus_WhenTodoExists()
    {
        // Arrange
        var todos = new List<Todo>
        {
            new Todo { Id = "1", Status = "Pending" }
        };

        _todoRepositoryMock.Setup(r => r.GetTodos()).Returns(todos);
        _todoRepositoryMock.Setup(r => r.UpdateTodoStatus(It.IsAny<Todo>())).Verifiable();

        // Act
        var result = _todoService.UpdateTodoStatus("1", "Completed");

        // Assert
        Assert.Equal("Completed", result.Status);
        _todoRepositoryMock.Verify(r => r.UpdateTodoStatus(It.IsAny<Todo>()), Times.Once);
    }
}
