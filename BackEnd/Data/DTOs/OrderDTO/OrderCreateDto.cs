using Microsoft.AspNetCore.Mvc;
using Data.DTOs.OrderDetailDTO;
namespace Data.DTOs.OrderDTO {
    public class OrderCreateDto
    {
        public int CustomerId { get; set; }
        public List<OrderDetailCreateDto> Items{ get; set; }
    }
    
}