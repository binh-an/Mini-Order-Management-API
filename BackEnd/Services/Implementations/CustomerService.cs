// Services/Implementations/CustomerService.cs
using Data.DTOs;
using Data.Entities;
using Repositories.Interfaces;
using Services.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Helpers.Exceptions;

namespace Services.Implementations
{
    public class CustomerService : ICustomerService
    {
        private readonly ICustomerRepository _repo;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContext;


        public CustomerService(ICustomerRepository repo, IMapper mapper, IHttpContextAccessor httpContext)
        {
            _repo = repo;
            _mapper = mapper;
            _httpContext = httpContext ?? throw new ArgumentNullException(nameof(httpContext));
        }

        private int CurrentUserId => GetCurrentUserId();
        private string? CurrentUserRole => _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

        private int GetCurrentUserId()
        {
            var userIdClaim = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.NameIdentifier)
                           ?? _httpContext.HttpContext?.User?.FindFirstValue("sub");

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                throw new UnauthorizedAccessException("User not authenticated or invalid token.");

            return userId;
        }

        public async Task<List<CustomerDto>> GetAllAsync()
        {
            var role = _httpContext.HttpContext?.User?.FindFirstValue(ClaimTypes.Role);

            if (role != "Admin")
                throw new UnauthorizedAccessException("Only Admin can view all customers.");

            var customers = await _repo.GetAllAsync();
            return _mapper.Map<List<CustomerDto>>(customers);
        }

        public async Task<CustomerDto?> GetByIdAsync(int id)
        {
            var customer = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException("Customer not found.");

            if (CurrentUserRole != "Admin" && CurrentUserId != id)
                throw new UnauthorizedAccessException("You can only view your own profile.");

            return _mapper.Map<CustomerDto>(customer);
        }

        public async Task<CustomerProfileDto?> GetMyProfileAsync()
        {
            var customer = await _repo.GetByUserIdAsync(CurrentUserId);
            return customer == null ? null : _mapper.Map<CustomerProfileDto>(customer);
        }

        public async Task<CustomerDto> CreateAsync(CreateCustomerDto dto)
        {
            var customer = _mapper.Map<Customer>(dto);
            // customer.Id = CurrentUserId; // Gán Id từ token (vì Customer.Id = User.Id)
            await _repo.AddAsync(customer);
            return _mapper.Map<CustomerDto>(customer);
        }

        public async Task<bool> UpdateAsync(UpdateCustomerDto dto)
        {
            var customer = await _repo.GetByIdAsync(dto.Id)
                ?? throw new NotFoundException("Customer not found.");

            if (CurrentUserRole != "Admin" && CurrentUserId != dto.Id)
                throw new UnauthorizedAccessException("You can only update your own profile.");

            _mapper.Map(dto, customer);
            await _repo.UpdateAsync(customer);
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            if (CurrentUserRole != "Admin")
                throw new UnauthorizedAccessException("Only Admin can delete customers.");

            var customer = await _repo.GetByIdAsync(id)
                ?? throw new NotFoundException("Customer not found.");

            await _repo.DeleteAsync(customer);
            return true;
        }
    }
}