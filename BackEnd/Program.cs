using Microsoft.EntityFrameworkCore;
using Data.Entities;
using FluentValidation;
using Repositories.Interfaces;
using Services.Interfaces;
using Data;
using Services;
using Services.Implementations;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpContextAccessor();

// Cấu hình Authentication với JWT
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]);
builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddScoped<IOrderService, Services.Implementations.OrderService>();
builder.Services.AddScoped<IOrderRepository, Repositories.Implementations.OrderRepository>();
builder.Services.AddScoped<IProductRepository, Repositories.Implementations.ProductRepository>();
builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();


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
// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy => policy
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
            .SetIsOriginAllowed(_ => true));
});

var app = builder.Build();
// Cấu hình AuthService


app.UseMiddleware<Middlewares.ErrorHandlerMiddleware>();



// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
// Ensure authentication middleware runs before authorization
//app.UseExceptionHandler();
app.UseAuthentication();
app.UseAuthorization();
// Enable CORS
app.UseCors("AllowReact");
app.MapControllers();

app.Run();
