using Microsoft.EntityFrameworkCore;
using Data.Entities;
<<<<<<< HEAD
using FluentValidation;
using Repositories.Interfaces;
using Services.Interfaces;
using Data;
=======
using Services;
using Services.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

>>>>>>> origin/binhan
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
// Đăng ký AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

var app = builder.Build();
// Cấu hình AuthService
builder.Services.AddScoped<IAuthService, AuthService>();

app.UseMiddleware<Middlewares.ErrorHandlerMiddleware>();
// Cấu hình Authentication với JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = jwtSettings["Issuer"],

        ValidateAudience = true,
        ValidAudience = jwtSettings["Audience"],

        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),

        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddAuthorization();

builder.Services.AddControllers();
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
