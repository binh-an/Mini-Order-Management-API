using Data.DTOs.OrderDTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using FluentValidation;

using Data.Validations;
namespace Controllers
{

    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _service;
        public OrderController(IOrderService service) => _service = service;

        // POST /api/orders -> user tự tạo đơn hàng
        [HttpPost]
        [Authorize]
        public async Task<IActionResult> Create([FromBody] OrderCreateDto dto)
        {
            var error = Validate(dto, new OrderCreateDtoValidator());
            if (error is not null) return error;
            var result = await _service.CreateOrderAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
        }
        
        // GET /api/orders/{id} -> user chỉ xem đơn của mình, admin xem tất cả
[HttpPut("{id:int}")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> Update(int id, [FromBody] OrderUpdateDto dto)
{
    
    // Kiểm tra Id trùng nhau
            if (id != dto.Id)
                return BadRequest("Id trong URL và body phải trùng nhau!");

    // VALIDATION
    var error = Validate(dto, new OrderUpdateDtoValidator());
    if (error is not null) return error;

    var success = await _service.UpdateOrderAsync(dto);
    if (!success)
        return NotFound($"Không tìm thấy đơn hàng có Id = {id}");

    return NoContent(); // 204 
}
        [HttpGet("{id:int}")]

        public async Task<IActionResult> GetById(int id)
        {
            var order = await _service.GetOrderByIdAsync(id);
            return Ok(order);
        }

        // GET /api/orders -> user chỉ xem của mình, admin xem toàn bộ
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var orders = await _service.GetAllOrdersAsync();
            return Ok(orders);
        }

        // PATCH /api/orders/{id}/status -> chỉ admin sửa trạng thái
        [HttpPatch("{id:int}/status")]
[Authorize(Roles = "Admin")]
public async Task<IActionResult> UpdateStatus(int id, [FromBody] StatusUpdateDto dto)
{
    var ok = await _service.UpdateOrderStatusAsync(id, dto.Status);
    if (!ok) return NotFound();
    return NoContent();
}

public class StatusUpdateDto
{
    public string Status { get; set; }
}


        // DELETE /api/orders/{id} -> chỉ admin xoá
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _service.DeleteOrderAsync(id);
            if (!ok) return NotFound();
            return NoContent();
        }
        
        private ActionResult Validate<T>(T dto, IValidator<T> validator) where T : class
{
    var result = validator.Validate(dto);
    if (!result.IsValid)
    {
        var errors = result.Errors
            .GroupBy(e => e.PropertyName)
            .ToDictionary(g => g.Key, g => g.Select(x => x.ErrorMessage).ToArray());

        return BadRequest(new { errors }); 
    }
    return null!; 
}
        
    }
}
