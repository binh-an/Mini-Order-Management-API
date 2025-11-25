using Microsoft.AspNetCore.Mvc;
namespace Data.Entities
{
    public class OrderDetail
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal UnitPrice { get; set; }  // giá tại thời điểm đặt
        public Order Order { get; set; }
        public Product Product { get; set; }
    }
}
