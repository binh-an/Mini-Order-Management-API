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
        private readonly IOrderRepository _orderRepo;
        private readonly IProductRepository _productRepo;
        private readonly AppDbContext _db; // để transaction
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;

        public OrderService(IOrderRepository orderRepo, IProductRepository productRepo, AppDbContext db, IMapper mapper, IHttpContextAccessor httpContext)
        {
            _orderRepo = orderRepo;
            _productRepo = productRepo;
            _db = db;
            _mapper = mapper;
            _httpContext = httpContext;
        }

        // Tạo order: kiểm tra product tồn tại, stock đủ, snapshot unitprice, giảm stock, lưu order trong transaction
       

        public async Task<OrderResponseDto> CreateOrderAsync(OrderCreateDto dto)
        {
            // 1) Lấy user id từ JWT (claim). Ở token ta đã lưu ClaimTypes.NameIdentifier hoặc "CustomerId".
            //    Nếu không có => user chưa auth => throw 401.
            var userIdClaim = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                              ?? _httpContext.HttpContext?.User?.FindFirstValue("CustomerId");
            if (string.IsNullOrEmpty(userIdClaim))
                throw new UnauthorizedAccessException("User not authenticated.");

            var customerId = int.Parse(userIdClaim);

            // 2) Business validation cơ bản của DTO
            if (dto.Items == null || !dto.Items.Any())
                throw new BusinessException("Order must contain at least one item.");

            // 3) Bắt đầu transaction để đảm bảo atomicity (tất cả hoặc không có gì)
            await using var tx = await _db.Database.BeginTransactionAsync();
            try
            {
                // 4) Tạo đối tượng Order mới (chưa lưu DB)
                var order = new Order
                {
                    CustomerId = customerId,
                    CreatedDate = DateTime.UtcNow,
                    Status = "Pending",
                    OrderDetails = new List<OrderDetail>()
                };

                decimal total = 0m;

                // 5) Duyệt từng item: kiểm tra product tồn tại, stock đủ, snapshot unitPrice, trừ stock
                foreach (var item in dto.Items)
                {
                    // Get product from repository (DB)
                    var product = await _productRepo.GetByIdAsync(item.ProductId);
                    if (product == null)
                        throw new NotFoundException($"Product {item.ProductId} not found.");

                    // Kiểm tra tồn kho
                    if (product.StockQuantity < item.Quantity)
                        throw new BusinessException($"Product {product.Name} insufficient stock. Available: {product.StockQuantity}");

                    // Snapshot giá hiện tại
                    var unitPrice = product.Price;

                    // Tạo OrderDetail (snapshot unitPrice)
                    var detail = new OrderDetail
                    {
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = unitPrice
                    };

                    // Thêm detail vào order
                    order.OrderDetails.Add(detail);

                    // Trừ tồn kho trong entity product
                    product.StockQuantity -= item.Quantity;

                    // Cập nhật product thông qua repository (để EF track changes)
                    await _productRepo.UpdateAsync(product);

                    // Cộng vào tổng tiền
                    total += unitPrice * item.Quantity;
                }

                // 6) Gán tổng tiền
                order.TotalAmount = total;

                // 7) Lưu Order vào DB thông qua repository
                await _orderRepo.AddAsync(order);

                // 8) Persist thay đổi (cả product updates + order + orderdetails)
                await _orderRepo.SaveChangesAsync(); // hoặc _db.SaveChangesAsync() nếu repo không làm

                // 9) Commit transaction sau khi Save thành công
                await tx.CommitAsync();

                // 10) Nếu muốn đảm bảo Order có đầy đủ navigation (Product) để map tên sản phẩm,
                //     reload order với details (Include product) qua repository
                var savedOrder = await _orderRepo.GetWithDetailsAsync(order.Id);

                // 11) Map entity -> DTO trả về
                var response = _mapper.Map<OrderResponseDto>(savedOrder);

                return response;
            }
            catch
            {
                // 12) Rollback và rethrow để middleware xử lý thành HTTP error phù hợp
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

            var userId = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier);
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            // Nếu không phải admin thì chỉ được xem đơn của chính mình
            if (role != "Admin" && order.CustomerId.ToString() != userId)
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