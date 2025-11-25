using Microsoft.EntityFrameworkCore;
using Data.Entities;
using FluentValidation;
using Repositories.Interfaces;
using Repositories.Implementations;
using Services.Interfaces;
using Data;
using Services;
using Services.Implementations;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.Text;
using Data.DTOs;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddHttpContextAccessor();



builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;

        // ĐỌC KEY
        var keyStr = builder.Configuration["Jwt:Key"];
        var issuer = builder.Configuration["Jwt:Issuer"];
        var audience = builder.Configuration["Jwt:Audience"];

       

        if (string.IsNullOrWhiteSpace(keyStr))
            throw new InvalidOperationException("Jwt:Key bị null hoặc trống!");

        // TẠO KEY NGAY TRONG TokenValidationParameters → 100% KHÔNG BỊ NULL
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = issuer,

            ValidateAudience = true,
            ValidAudience = audience,

            ValidateIssuerSigningKey = true,
           
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr)),
            

            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Query["access_token"].FirstOrDefault();
                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                    return Task.CompletedTask;
                }

                var authHeader = context.Request.Headers.Authorization.FirstOrDefault();
                if (authHeader?.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase) == true)
                {
                    context.Token = authHeader["Bearer ".Length..].Trim();
                }
                return Task.CompletedTask;
            },

            OnTokenValidated = ctx =>
            {
                Console.WriteLine("TOKEN HỢP LỆ 100%!!! USER: " + ctx.Principal?.Identity?.Name);
                return Task.CompletedTask;
            },

            OnAuthenticationFailed = ctx =>
            {
                 ctx.NoResult();
                Console.WriteLine("JWT THẤT BẠI: " + ctx.Exception.Message);
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();


builder.Services.AddAutoMapper(typeof(MappingProfile));

builder.Services.AddScoped<IOrderDetailRepository, OrderDetailRepository>();

builder.Services.AddScoped<IOrderService,OrderService>();
builder.Services.AddScoped<IOrderRepository,OrderRepository>();
builder.Services.AddScoped<IProductRepository,ProductRepository>();
//builder.Services.AddScoped<IOrderService, OrderService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();

// 1. Add DbContext with SQL Server
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// 2. Add controllers
//builder.Services.AddControllers();

builder.Services.AddValidatorsFromAssembly(typeof(Program).Assembly);
builder.Services.AddControllers();
var validatorTypes = typeof(Program).Assembly.GetTypes()
    .Where(t => t.IsClass && t.GetInterfaces().Any(i => i.IsGenericType && i.GetGenericTypeDefinition() == typeof(IValidator<>)))
    .ToList();



// 3. Add Swagger (optional, nếu muốn test API)
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Đăng ký AuthService





builder.Services.AddAuthorization();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder
            .AllowAnyOrigin()
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
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

app.UseCors("AllowAll");
app.UseHttpsRedirection();
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
