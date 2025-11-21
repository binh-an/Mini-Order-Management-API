using Data.DTOs;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Services
{
    public class AuthService : IAuthService
    {
        private readonly AppDbContext _db;
        private readonly IConfiguration _config;

        public AuthService(AppDbContext db, IConfiguration config)
        {
            _db = db;
            _config = config;
        }
        public async Task<AuthResponseDTO> RegisterAsync(RegisterDTO model)
        {
            // 1. Check trùng username
            if (await _db.Users.AnyAsync(x => x.Username == model.Username))
                throw new Exception("Username đã tồn tại");

            // 2. Check trùng email
            if (await _db.Users.AnyAsync(x => x.Email == model.Email))
                throw new Exception("Email đã tồn tại");

            // 3. Hash password (demo)
            string hashed = BCrypt.Net.BCrypt.HashPassword(model.Password);

            var user = new User
            {
                Username = model.Username,
                PasswordHash = hashed,
                Email = model.Email,
                Role = "User"
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            // 4. Tạo token và trả về
            return new AuthResponseDTO
            {
                Username = user.Username,
                Email = user.Email,
                Token = GenerateToken(user)
            };
        }
        public async Task<AuthResponseDTO> LoginAsync(LoginDTO model)
        {
            var user = await _db.Users.FirstOrDefaultAsync(x => x.Username == model.Username);
            if (user == null)
                throw new Exception("Sai username hoặc password");

            // Check password
            if (!BCrypt.Net.BCrypt.Verify(model.Password, user.PasswordHash))
                throw new Exception("Sai username hoặc password");

            return new AuthResponseDTO
            {
                Username = user.Username,
                Email = user.Email,
                Token = GenerateToken(user)
            };
        }
        private string GenerateToken(User user)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var token = new JwtSecurityToken(
                issuer: _config["Jwt:Issuer"],
                audience: _config["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
