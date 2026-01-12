namespace Data.DTOs.OrderDTO
{
    public class OrderUpdateDto
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public List<OrderDetailUpdateDto> Items { get; set; } = new();
    }

    public class OrderDetailUpdateDto
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }
    }
}