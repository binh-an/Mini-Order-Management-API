
using Data.Entities;

namespace Repositories.Interfaces
{
    public interface IOrderDetailRepository
    {
        Task DeleteByOrderIdAsync(int orderId);
        Task AddAsync(OrderDetail detail);
    }
}