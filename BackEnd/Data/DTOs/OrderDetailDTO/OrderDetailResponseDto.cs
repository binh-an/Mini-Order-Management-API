
namespace Data.DTOs.OrderDetailDTO
{
    public class OrderDetailResponseDto
{
    public int ProductId { get; set; }
    public string ProductName { get; set; }
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; } // Giá tại thời điểm đặt

    // Không lưu DB
    public decimal SubTotal => Quantity * UnitPrice;
}
}
