// File: Repositories/Implementations/OrderDetailRepository.cs
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class OrderDetailRepository : IOrderDetailRepository
    {
        private readonly AppDbContext _context;

        public OrderDetailRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task DeleteByOrderIdAsync(int orderId)
        {
            var details = await _context.OrderDetails
                                        .Where(od => od.OrderId == orderId)
                                        .ToListAsync();
            _context.OrderDetails.RemoveRange(details);
            await _context.SaveChangesAsync();
        }

        public async Task AddAsync(OrderDetail detail)
        {
            _context.OrderDetails.Add(detail);
            await _context.SaveChangesAsync();
        }
    }
}