using AutoMapper;
using Data.DTOs.OrderDTO;
using Data.Entities;
using Microsoft.EntityFrameworkCore;
using Repositories.Interfaces;
using Services.Interfaces;
using Helpers.Exceptions;
using System.Security.Claims;
namespace Services.Implementations
{
    // OrderService với transaction, stock check, snapshot price...
    public class OrderService : IOrderService
    {
        private readonly IOrderDetailRepository _orderDetailRepo;
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly AppDbContext _db; // để transaction
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;

        public OrderService(IOrderRepository orderRepo, IProductRepository productRepo, AppDbContext db, IMapper mapper, IHttpContextAccessor httpContext, IOrderDetailRepository orderDetailRepo)
        {
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _db = db;
            _mapper = mapper;
            _httpContext = httpContext;
            _orderDetailRepo = orderDetailRepo;
        }

        // Tạo order: kiểm tra product tồn tại, stock đủ, snapshot unitprice, giảm stock, lưu order trong transaction


        public async Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto dto)
{
    var userIdClaim = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
    if (!int.TryParse(userIdClaim, out var customerId))
        throw new UnauthorizedAccessException("User not authenticated.");

    var customerExists = await _db.Customers.AnyAsync(c => c.Id == customerId);
    if (!customerExists)
        throw new NotFoundException("Customer profile not found.");

    if (dto.Items == null || !dto.Items.Any())
        throw new BusinessException("Order must contain at least one item.");

    await using var tx = await _db.Database.BeginTransactionAsync();
    try
    {
        var order = new Order
        {
            CustomerId = customerId,
            CreatedDate = DateTime.UtcNow,
            Status = "Pending",
            OrderDetails = new List<OrderDetail>()
        };

        decimal total = 0m;
        var productsToDelete = new List<Product>();

        foreach (var item in dto.Items)
        {
            var product = await _productRepo.GetByIdAsync(item.ProductId);
            if (product == null)
                throw new NotFoundException($"Product {item.ProductId} not found.");

            if (product.StockQuantity < item.Quantity)
                throw new BusinessException($"Product {product.Name} insufficient stock. Available: {product.StockQuantity}");

            // Snapshot price
            var unitPrice = product.Price;

            // Thêm OrderDetail
            order.OrderDetails.Add(new OrderDetail
            {
                ProductId = product.Id,
                Quantity = item.Quantity,
                UnitPrice = unitPrice
            });

            // Trừ stock
            product.StockQuantity -= item.Quantity;

            if (product.StockQuantity == 0)
                productsToDelete.Add(product);
            else
                await _productRepo.UpdateAsync(product);

            total += unitPrice * item.Quantity;
        }

        order.TotalAmount = total;

        await _orderRepo.AddAsync(order);
        await _db.SaveChangesAsync(); // save order + update product stock

        // Xóa các product hết stock
        foreach (var p in productsToDelete)
        {
            await _productRepo.DeleteAsync(p.Id);
        }

        await _db.SaveChangesAsync(); // save các product bị xóa
        await tx.CommitAsync();

        var savedOrder = await _orderRepo.GetWithDetailsAsync(order.Id);
        return _mapper.Map<OrderResponseDto>(savedOrder);
    }
    catch (Exception ex)
    {
        try { await tx.RollbackAsync(); } catch { }
        Console.WriteLine("ORDER ERROR: " + ex.Message);
        throw;
    }
}



        // Lấy order theo id (kèm details)


        public async Task<OrderResponseDto> GetOrderByIdAsync(int id)
        {
            var order = await _orderRepo.GetWithDetailsAsync(id);
            if (order == null)
                throw new NotFoundException("Order not found.");

            var userIdClaim = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            // Nếu không phải admin thì chỉ được xem đơn của chính mình
            if (role == "Admin")
                return _mapper.Map<OrderResponseDto>(order);

            if (!int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("Invalid token.");



            if (order.CustomerId != userId)
                throw new UnauthorizedAccessException("You are not allowed to view this order.");
            return _mapper.Map<OrderResponseDto>(order);
        }


        public async Task<IEnumerable<OrderResponseDto>> GetAllOrdersAsync()
        {
            var userId = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            var orders = await _orderRepo.GetAllWithDetailsAsync();

            // User chỉ xem đơn hàng của chính mình
            if (role != "Admin")
                orders = orders.Where(o => o.CustomerId.ToString() == userId).ToList();

            return _mapper.Map<IEnumerable<OrderResponseDto>>(orders);
        }

        public async Task<bool> UpdateOrderStatusAsync(int id, string status)
        {
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            if (role != "Admin")
                throw new UnauthorizedAccessException("Only admin can update order status.");

            var order = await _orderRepo.GetWithDetailsAsync(id);
            if (order == null)
                throw new NotFoundException("Order not found.");

            order.Status = status;
            await _orderRepo.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateOrderAsync(OrderUpdateDto dto)
        {
            var order = await _orderRepo.GetByIdAsync(dto.Id);
            if (order == null) return false;

            // Cập nhật thông tin (ví dụ đơn giản)
            order.CustomerId = dto.CustomerId;

            // Xóa chi tiết cũ
            await _orderDetailRepo.DeleteByOrderIdAsync(dto.Id);

            // Thêm chi tiết mới
            foreach (var item in dto.Items)
            {
                var detail = new OrderDetail
                {
                    OrderId = dto.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = item.UnitPrice
                };
                await _orderDetailRepo.AddAsync(detail);

                // Cập nhật tồn kho
                var product = await _productRepo.GetByIdAsync(item.ProductId);
                if (product != null)
                {
                    product.StockQuantity -= item.Quantity;
                    await _productRepo.UpdateAsync(product);
                }
            }

            await _orderRepo.UpdateAsync(order);
            return true;
        }
        public async Task<bool> DeleteOrderAsync(int id)
        {
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            if (role != "Admin")
                throw new UnauthorizedAccessException("Only admin can delete orders.");

            await _orderRepo.DeleteAsync(id);
            await _orderRepo.SaveChangesAsync();
            return true;
        }



    }
}