using Data.Entities;
namespace Repositories.Interfaces
{
    public interface IOrderRepository
    {
        Task<Order?> GetByIdAsync(int id);
        Task AddAsync(Order order);
        Task<Order?> GetWithDetailsAsync(int id);
        Task<IEnumerable<Order>> GetAllWithDetailsAsync();
        Task DeleteAsync(int id);
        Task SaveChangesAsync();
        Task UpdateAsync(Order order);
    }
}