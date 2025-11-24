using Data.DTOs;
using Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositories.Interfaces;
using Data.Validations;
using FluentValidation;
namespace WebAPI.Controllers
{
    [Route("api/products")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly IProductRepository _productRepo;

        public ProductsController(IProductRepository productRepo)
        {
            _productRepo = productRepo;
        }

        // 1. MỌI NGƯỜI ĐỀU XEM ĐƯỢC (không cần đăng nhập)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var products = await _productRepo.GetAllAsync();
            return Ok(products);
        }

        // 2. Xem chi tiết sản phẩm (cũng cho mọi người)
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with Id {id} not found.");

            return Ok(product);
        }

        // 3. CHỈ ADMIN MỚI ĐƯỢC TẠO SẢN PHẨM
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> Create([FromBody] CreateProductDTO dto)
        {
            var error = Validate(dto, new ProductCreateValidator());
            if (error is not null) return error;


            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                StockQuantity = dto.StockQuantity

            };

            await _productRepo.AddAsync(product);

            return CreatedAtAction(
                nameof(GetById),
                new { id = product.Id },
                product);
        }

        // 4. CHỈ ADMIN MỚI ĐƯỢC SỬA
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDTO dto)
        {

            if (id != dto.Id)
                return BadRequest("Id trong URL và body phải trùng nhau.");

            var existing = await _productRepo.GetByIdAsync(id);
            if (existing == null)
                return NotFound($"Không tìm thấy sản phẩm có Id = {id}");

            var error = Validate(dto, new ProductUpdateValidator());
            if (error is not null) return error;
            // Cập nhật thông tin – ĐÃ SỬA TỪ product → dto!!!
            existing.Name = dto.Name;
            existing.Price = dto.Price;
            existing.Description = dto.Description;
            existing.StockQuantity = dto.StockQuantity;

            await _productRepo.UpdateAsync(existing);

            return NoContent();
        }

        // 5. CHỈ ADMIN MỚI ĐƯỢC XÓA
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with Id {id} not found.");

            await _productRepo.DeleteAsync(id);
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