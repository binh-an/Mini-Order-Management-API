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
        private readonly IWebHostEnvironment _env;

        public ProductsController(IProductRepository productRepo, IWebHostEnvironment env)
        {
            _productRepo = productRepo;
            _env = env;
        }

        // 1. MỌI NGƯỜI ĐỀU XEM ĐƯỢC (không cần đăng nhập)
        [HttpGet]
        [AllowAnonymous]
        public async Task<ActionResult<IEnumerable<Product>>> GetAll()
        {
            var products = await _productRepo.GetAllAsync();
            var dtos = products.Select(p => new ProductDTO
            {
                Id = p.Id,
                Name = p.Name,
                Price = p.Price,
                Description = p.Description,
                StockQuantity = p.StockQuantity,
                ImageUrl = p.ImageUrl
            });
            return Ok(dtos);
        }

        // 2. Xem chi tiết sản phẩm (cũng cho mọi người)
        [HttpGet("{id:int}")]
        [AllowAnonymous]
        public async Task<ActionResult<Product>> GetById(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with Id {id} not found.");

            return Ok(new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl
            });
        }

        // 3. CHỈ ADMIN + Upload ảnh
        [HttpPost]
        [Authorize(Roles = "Admin")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<Product>> Create([FromForm] CreateProductDTO dto)
        {
            var error = Validate(dto, new ProductCreateValidator());
            if (error is not null) return error;

            string? imageUrl = null;

            // Xử lý upload ảnh (nếu có)
            if (dto.Image != null && dto.Image.Length > 0)
            {
                imageUrl = await SaveImageAsync(dto.Image);
                if (imageUrl == null)
                    return BadRequest("Chỉ chấp nhận file ảnh (jpg, png, gif, webp).");
            }
            var product = new Product
            {
                Name = dto.Name,
                Price = dto.Price,
                Description = dto.Description,
                StockQuantity = dto.StockQuantity,
                ImageUrl = imageUrl
            };



            await _productRepo.AddAsync(product);

           var resultDto = new ProductDTO
            {
                Id = product.Id,
                Name = product.Name,
                Price = product.Price,
                Description = product.Description,
                StockQuantity = product.StockQuantity,
                ImageUrl = product.ImageUrl
            };

            return CreatedAtAction(nameof(GetById), new { id = product.Id }, resultDto);
        }

        // 4. CHỈ ADMIN MỚI ĐƯỢC SỬA
        [HttpPut("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromForm] UpdateProductDTO dto)
        {

            if (id != dto.Id)
                return BadRequest("Id trong URL và body phải trùng nhau.");

            var existing = await _productRepo.GetByIdAsync(id);
            if (existing == null)
                return NotFound($"Không tìm thấy sản phẩm có Id = {id}");

            var error = Validate(dto, new ProductUpdateValidator());
            if (error is not null) return error;
            string? newImageUrl = existing.ImageUrl;

            // Nếu có ảnh mới → xóa ảnh cũ + lưu ảnh mới
            if (dto.Image != null && dto.Image.Length > 0)
            {
                // Xóa ảnh cũ
                if (!string.IsNullOrEmpty(existing.ImageUrl))
                {
                    var oldFileName = Path.GetFileName(new Uri(existing.ImageUrl).LocalPath);
                    var oldPath = Path.Combine(_env.WebRootPath, "images", "products", oldFileName);
                    if (System.IO.File.Exists(oldPath))
                        System.IO.File.Delete(oldPath);
                }

                newImageUrl = await SaveImageAsync(dto.Image);
                if (newImageUrl == null)
                    return BadRequest("File upload phải là ảnh hợp lệ.");
            }
            // Cập nhật thông tin – ĐÃ SỬA TỪ product → dto!!!
            existing.Name = dto.Name;
            existing.Price = dto.Price;
            existing.Description = dto.Description;
            existing.StockQuantity = dto.StockQuantity;

         

            await _productRepo.UpdateAsync(existing);

            return Ok(existing);
        }

        // 5. CHỈ ADMIN MỚI ĐƯỢC XÓA
        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var product = await _productRepo.GetByIdAsync(id);
            if (product == null)
                return NotFound($"Product with Id {id} not found.");
                // Xóa ảnh nếu có
            if (!string.IsNullOrEmpty(product.ImageUrl))
            {
                var fileName = Path.GetFileName(new Uri(product.ImageUrl).LocalPath);
                var filePath = Path.Combine(_env.WebRootPath, "images", "products", fileName);
                if (System.IO.File.Exists(filePath))
                    System.IO.File.Delete(filePath);
            }

            await _productRepo.DeleteAsync(id);
            return NoContent();
        }

     private async Task<string?> SaveImageAsync(IFormFile image)
        {
            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };
            var extension = Path.GetExtension(image.FileName).ToLowerInvariant();

            if (!allowedExtensions.Contains(extension))
                return null;

            if (image.Length > 10 * 1024 * 1024) // 10MB
                return null;

            var fileName = $"{Guid.NewGuid()}{extension}";
            var folderPath = Path.Combine(_env.WebRootPath, "images", "products");
            Directory.CreateDirectory(folderPath); // Tự tạo nếu chưa có

            var filePath = Path.Combine(folderPath, fileName);

            await using var stream = new FileStream(filePath, FileMode.Create);
            await image.CopyToAsync(stream);

            return $"{Request.Scheme}://{Request.Host}/images/products/{fileName}";
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