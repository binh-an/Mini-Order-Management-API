using Data.DTOs;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Services.Interfaces;
using FluentValidation;
using Data.Validations;
using System.Security.Claims;
namespace Controllers
{
    [Route("api/customers")]
    [ApiController]
    public class CustomerController : ControllerBase
    {
        private readonly ICustomerService _service;

        public CustomerController(ICustomerService service) => _service = service;
        private int CurrentUserId => int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        // admin xem tất cả khách hangf
        [HttpGet][Authorize] public async Task<ActionResult<List<CustomerDto>>> GetAll() => Ok(await _service.GetAllAsync());
        //admin xem theo id
        [HttpGet("{id:int}")] public async Task<ActionResult<CustomerDto>> GetById(int id) => Ok(await _service.GetByIdAsync(id));
        //user & admin xem thông tin của mình
        [HttpGet("me")][Authorize] public async Task<ActionResult<CustomerProfileDto>> GetMyProfile() => Ok(await _service.GetMyProfileAsync());
        //admin thêm khách hàng
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CustomerDto>> Create([FromBody] CreateCustomerDto dto)
        {
            var error = Validate(dto, new CreateCustomerDtoValidator());
            if (error is not null) return error;
            return CreatedAtAction(nameof(GetById), new { id = CurrentUserId }, await _service.CreateAsync(dto));
        }
        //admin sửa thông tin
        [HttpPut("{id:int}")]
        [Authorize]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDto dto)
        {
            if (id != dto.Id) return BadRequest("Id mismatch.");
            var error = Validate(dto, new UpdateCustomerDtoValidator());
            if (error is not null) return error;
            return (await _service.UpdateAsync(dto)) ? NoContent() : NotFound();
        }
        //admin xóa khách hàng = id
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
            => (await _service.DeleteAsync(id)) ? NoContent() : NotFound();

        // HÀM VALIDATE – DÙNG CHUNG 
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
