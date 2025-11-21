using Data.Entities;
namespace Repositories.Interfaces
{
    public interface IProductRepository
    {
        Task<Product?> GetByIdAsync(int id);
        Task UpdateAsync(Product product);
    }
}