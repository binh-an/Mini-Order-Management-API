using Microsoft.AspNetCore.Mvc;
using Data.DTOs.OrderDetailDTO;
namespace Data.DTOs.OrderDTO
{
    // DTO trả về khi tạo order hoặc xem đơn hàng
    public class OrderResponseDto
    {
        public int Id { get; set; } 
        public int CustomerId { get; set; }
        public string Status { get; set; } 
        public decimal TotalAmount { get; set; }
        public DateTime CreatedDate { get; set; }

        public List<OrderDetailResponseDto> Items { get; set; }
    }

    
}
