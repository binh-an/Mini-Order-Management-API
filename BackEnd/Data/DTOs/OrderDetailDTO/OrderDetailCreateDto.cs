namespace Data.DTOs.OrderDetailDTO
{
    // DTO dùng để truyền dữ liệu cho từng dòng sản phẩm khi TẠO Order
    // Chỉ chứa thông tin cần client nhập (ProductId và Quantity)
    public class OrderDetailCreateDto
    {
       
        public int ProductId { get; set; } // Id sản phẩm

       
       
        public int Quantity { get; set; } 
    }
}