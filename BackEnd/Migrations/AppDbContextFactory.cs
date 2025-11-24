using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Data.Entities;

public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
<<<<<<< HEAD
        optionsBuilder.UseSqlServer("Server=.\\MARSTON;Database= Mini_Order_Management;User Id=sa;Password= 123456;TrustServerCertificate=True;");
=======
        optionsBuilder.UseSqlServer("Server=LAPTOP-TKD6P9RP\\SQLEXPRESS;Database= Mini_Order_Management;User Id=sa;Password= 123456;TrustServerCertificate=True;MultipleActiveResultSets=True;Timeout=60");
>>>>>>> origin/hieu

        return new AppDbContext(optionsBuilder.Options);
    }
}
