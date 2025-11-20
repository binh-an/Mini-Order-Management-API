using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class OrderRepository : IOrderRepository
    {
        private readonly AppDbContext  _context;

        public OrderRepository(AppDbContext  context)
        {
            _context = context;
        }

        public async Task AddAsync(Order order)
        {
            await _context.Set<Order>().AddAsync(order);
            await _context.SaveChangesAsync();
        }

        public async Task<Order?> GetWithDetailsAsync(int id)
        {
            return await _context.Set<Order>()
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                 .ThenInclude(od => od.Product)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<IEnumerable<Order>> GetAllWithDetailsAsync()
        {
            return await _context.Set<Order>()
                .Include(o => o.Customer)
                .Include(o => o.OrderDetails)
                 .ThenInclude(od => od.Product)
                .ToListAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var order = await _context.Set<Order>().FindAsync(id);
            if (order != null)
            {
                _context.Set<Order>().Remove(order);
                await _context.SaveChangesAsync();
            }
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}
