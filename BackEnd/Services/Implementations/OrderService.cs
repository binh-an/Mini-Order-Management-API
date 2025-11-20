using AutoMapper;
using Data.DTOs.OrderDTO;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using Services.Interfaces;
using Helpers.Exceptions;
namespace Services.Implementations
{
    // OrderService với transaction, stock check, snapshot price...
    public class OrderService : IOrderService
    {
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly AppDbContext _db; // để transaction
        private readonly IMapper _mapper;

        public OrderService(IOrderRepository orderRepo, IProductRepository productRepo, AppDbContext db, IMapper mapper)
        {
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _db = db;
            _mapper = mapper;
        }

        // Tạo order: kiểm tra product tồn tại, stock đủ, snapshot unitprice, giảm stock, lưu order trong transaction
        public async Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto dto)
        {
            // Business validation BusinessException -> mapped to 400
            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Order must contain at least one item.");

            // Start DB transaction để atomic operation
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                var order = new Order
                {
                    CustomerId = dto.CustomerId,
                    CreatedDate = DateTime.UtcNow,
                    Status = "Pending",
                    OrderDetails = new List<OrderDetail>()
                };

                decimal total = 0m;

                foreach (var item in dto.Items)
                {
                    
                    var product = await _productRepo.GetByIdAsync(item.ProductId);
                    if (product == null)
                        throw new NotFoundException($"Product {item.ProductId} not found.");

                    if (product.StockQuantity < item.Quantity)
                        throw new BusinessException($"Product {product.Name} insufficient stock. Available: {product.StockQuantity}");

                    // Snapshot giá
                    var unitPrice = product.Price;

                    // Tạo OrderDetail snapshot
                    var detail = new OrderDetail
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = unitPrice
                    };
                    order.OrderDetails.Add(detail);

                    // Giảm stock
                    product.StockQuantity -= item.Quantity;
                    await _productRepo.UpdateAsync(product);

                    total += unitPrice * item.Quantity;
                }

                order.TotalAmount = total;

                // Lưu order
                await _orderRepo.AddAsync(order);
                await _orderRepo.SaveChangesAsync();

                // Commit nếu mọi thứ OK
                await tx.CommitAsync();

                // Map entity -> DTO response (AutoMapper)
                return _mapper.Map<OrderResponseDto>(order);
            }
            catch
            {
                // Rollback on error
                await tx.RollbackAsync();
                throw;
            }
        }

        // Lấy order theo id (kèm details)
        public async Task<OrderResponseDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepo.GetWithDetailsAsync(id);
            if (order == null)
                throw new NotFoundException("Order not found.");
            return _mapper.Map<OrderResponseDto>(order);
        }

        public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
        {
            var orders = await _orderRepo.GetAllWithDetailsAsync();
            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, string status)
        {
            var order = await _orderRepo.GetWithDetailsAsync(id);
            if (order == null) return false;
            order.Status = status;
            await _orderRepo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteOrderAsync(int id)
        {
            await _orderRepo.DeleteAsync(id);
            await _orderRepo.SaveChangesAsync();
            return true;
        }
    }
}