
using Data.DTOs;
using Data.Entities;

namespace Services.Interfaces
{
    public interface ICustomerService
    {
       Task<List<CustomerDto>> GetAllAsync(); // Chỉ Admin
    Task<CustomerDto?> GetByIdAsync(int id); // Admin hoặc chính chủ
    Task<CustomerProfileDto?> GetMyProfileAsync(); // User đang đăng nhập
    Task<CustomerDto> CreateAsync(CreateCustomerDto dto);
    Task<bool> UpdateAsync(UpdateCustomerDto dto); // Admin hoặc chính chủ
    Task<bool> DeleteAsync(int id); // Chỉ Admin
    }
}