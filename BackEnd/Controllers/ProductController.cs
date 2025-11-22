using Microsoft.AspNetCore.Mvc;
using Data.DTOs;
using Data.Entities;
using Repositories.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ProductController : ControllerBase
	{
		private readonly AppDbContext _db;
		private readonly IProductRepository _productRepo;
		private readonly IMapper _mapper;

		public ProductController(AppDbContext db, IProductRepository productRepo, IMapper mapper)
		{
			_db = db;
			_productRepo = productRepo;
			_mapper = mapper;
		}

		[HttpGet]
		public async Task<IActionResult> GetAll()
		{
			var products = await _db.Set<Product>().ToListAsync();
			var dtos = products.Select(p => _mapper.Map<ProductDTO>(p));
			return Ok(dtos);
		}

		[HttpGet("{id}")]
		public async Task<IActionResult> GetById(int id)
		{
			var product = await _productRepo.GetByIdAsync(id);
			if (product == null) return NotFound();
			return Ok(_mapper.Map<ProductDTO>(product));
		}

		[Authorize(Roles = "Admin")]
		[HttpPost]
		public async Task<IActionResult> Create([FromBody] CreateProductDTO dto)
		{
			var product = new Product
			{
				Name = dto.Name,
				Price = dto.Price,
				Description = dto.Description,
				StockQuantity = dto.StockQuantity
			};
			_db.Set<Product>().Add(product);
			await _db.SaveChangesAsync();
			var result = _mapper.Map<ProductDTO>(product);
			return CreatedAtAction(nameof(GetById), new { id = product.Id }, result);
		}

		[Authorize(Roles = "Admin")]
		[HttpPut("{id}")]
		public async Task<IActionResult> Update(int id, [FromBody] UpdateProductDTO dto)
		{
			var product = await _productRepo.GetByIdAsync(id);
			if (product == null) return NotFound();
			product.Name = dto.Name;
			product.Price = dto.Price;
			product.Description = dto.Description;
			product.StockQuantity = dto.StockQuantity;
			await _productRepo.UpdateAsync(product);
			return NoContent();
		}

		[Authorize(Roles = "Admin")]
		[HttpDelete("{id}")]
		public async Task<IActionResult> Delete(int id)
		{
			var product = await _productRepo.GetByIdAsync(id);
			if (product == null) return NotFound();
			_db.Set<Product>().Remove(product);
			await _db.SaveChangesAsync();
			return NoContent();
		}
	}
}
