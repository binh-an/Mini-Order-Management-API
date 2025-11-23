using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Data.Entities;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
        optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database= Mini_Order_Management;User Id=sa;Password= 12345;TrustServerCertificate=True;");

        return new AppDbContext(optionsBuilder.Options);
    }
}
