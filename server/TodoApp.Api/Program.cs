using TodoApp.Infrastructure.Repositories;
using TodoApp.Domain.Interfaces;
using TodoApp.Application.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
  options.AddPolicy("AnyPolicy", policy =>
    policy
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowAnyOrigin());
});

builder.Services.AddMemoryCache(); // fix 2.b round-trip optimization
builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<ITodoRepository, TodoRepository>();

var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
  app.UseSwagger();
  app.UseSwaggerUI();
}

app.UseCors("AnyPolicy");
app.UseAuthorization();
app.MapControllers();
app.Run();
