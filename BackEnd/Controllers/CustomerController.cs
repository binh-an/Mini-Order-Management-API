using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AutoMapper;
using Data.DTOs;
using Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly AppDbContext _db;
        private readonly IMapper _mapper;

        public CustomerController(AppDbContext db, IMapper mapper)
        {
            _db = db;
            _mapper = mapper;
        }

        // GET /api/customers -> Admin only
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetAll()
        {
            var customers = await _db.Set<Customer>().ToListAsync();
            var dtos = customers.Select(c => _mapper.Map<CustomerDTO>(c));
            return Ok(dtos);
        }

        // GET /api/customers/me -> authenticated user gets their own customer profile
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> GetMe()
        {
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdClaim)) return Forbid();
            if (!int.TryParse(userIdClaim, out var id)) return Forbid();

            var customer = await _db.Set<Customer>().FindAsync(id);
            if (customer == null) return NotFound();
            return Ok(_mapper.Map<CustomerDTO>(customer));
        }

        // GET /api/customers/{id} -> Admin or owner
        [HttpGet("{id:int}")]
        [Authorize]
        public async Task<IActionResult> GetById(int id)
        {
            var customer = await _db.Set<Customer>().FindAsync(id);
            if (customer == null) return NotFound();

            var role = User.FindFirst(System.Security.Claims.ClaimTypes.Role)?.Value;
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (role != "Admin")
            {
                if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId) || userId != id)
                    return Forbid();
            }

            return Ok(_mapper.Map<CustomerDTO>(customer));
        }

        // POST /api/customers -> Admin only
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] CreateCustomerDTO dto)
        {
            var customer = _mapper.Map<Customer>(dto);
            _db.Set<Customer>().Add(customer);
            await _db.SaveChangesAsync();
            var res = _mapper.Map<CustomerDTO>(customer);
            return CreatedAtAction(nameof(GetById), new { id = customer.Id }, res);
        }

        // PUT /api/customers/{id} -> Admin only
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateCustomerDTO dto)
        {
            var customer = await _db.Set<Customer>().FindAsync(id);
            if (customer == null) return NotFound();
            _mapper.Map(dto, customer);
            await _db.SaveChangesAsync();
            return NoContent();
        }

        // DELETE /api/customers/{id} -> Admin only
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var customer = await _db.Set<Customer>().FindAsync(id);
            if (customer == null) return NotFound();
            _db.Set<Customer>().Remove(customer);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
