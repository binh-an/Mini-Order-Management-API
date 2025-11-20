using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;

namespace Repositories.Implementations
{
    public class ProductRepository : IProductRepository
    {
        private readonly AppDbContext  _context;

        public ProductRepository(AppDbContext  context)
        {
            _context = context;
        }

        public async Task<Product?> GetByIdAsync(int id)
        {
            return await _context.Set<Product>()
                                 .FirstOrDefaultAsync(p => p.Id == id);
        }

        public async Task UpdateAsync(Product product)
        {
            _context.Set<Product>().Update(product);
            await _context.SaveChangesAsync();
        }
    }
}
