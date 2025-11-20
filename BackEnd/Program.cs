using Microsoft.EntityFrameworkCore;
using Data.Entities;
using FluentValidation;
using Repositories.Interfaces;
using Services.Interfaces;
using Data;
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddScoped<IOrderService, Services.Implementations.OrderService>();
builder.Services.AddScoped<IOrderRepository, Repositories.Implementations.OrderRepository>();
builder.Services.AddScoped<IProductRepository, Repositories.Implementations.ProductRepository>();


// 1. Add DbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Add controllers
builder.Services.AddControllers();
//FluentValidation
builder.Services.AddValidatorsFromAssemblyContaining<Data.Validations.OrderCreateDtoValidator>();

// 3. Add Swagger (optional, nếu muốn test API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseMiddleware<Middlewares.ErrorHandlerMiddleware>();
// Middleware

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
