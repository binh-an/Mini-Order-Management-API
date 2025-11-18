using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
namespace Data.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int CustomerId { get; set; }
        public DateTime CreatedDate { get; set; }
        public string Status { get; set; }   
        public decimal TotalAmount { get; set; }
        public Customer Customer { get; set; }
        public ICollection<OrderDetail> OrderDetails { get; set; }
    }
}