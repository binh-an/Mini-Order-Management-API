using Data.DTOs.OrderDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;

namespace Controllers
{




   

    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrderController(IOrderService service) => _service = service;

        // POST /api/orders -> tạo order
        [HttpPost]
       // [Authorize(Roles = "Customer,Admin")]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            // Nếu FluentValidation thất bại, sẽ không chạy vào đây (ApiController + FV)
            var result = await _service.CreateOrderAsync(dto);
            // Trả 201 Created theo chuẩn REST (CreatedAtAction kèm route)
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }

    


        // GET /api/orders/{id}
        [HttpGet("{id:int}")]
       // [Authorize] // user phải đăng nhập; service sẽ check ownership nếu cần
        public async Task<IActionResult> GetById(int id)
        {
            var order = await _service.GetOrderByIdAsync(id);
            return Ok(order); // 200
        }

        // GET /api/orders (Admin only)
        [HttpGet]
      //  [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllOrdersAsync();
            return Ok(orders); // 200
        }

        // PATCH /api/orders/{id}/status (Admin)
        [HttpPatch("{id:int}/status")]
       // [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateStatus(int id, [FromBody] string status)
        {
            var ok = await _service.UpdateOrderStatusAsync(id, status);
            if (!ok) return NotFound();
            return NoContent(); // 204
        }

        // DELETE /api/orders/{id}
        [HttpDelete("{id:int}")]
     //   [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteOrderAsync(id);
            if (!ok) return NotFound();
            return NoContent(); // 204
        }
    }
}
