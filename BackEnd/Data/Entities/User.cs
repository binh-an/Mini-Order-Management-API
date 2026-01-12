using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
namespace Data.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string Email { get; set; }
        public string Role { get; set; }
        public ICollection<Order> Orders { get; set; } //1-n
    }
}