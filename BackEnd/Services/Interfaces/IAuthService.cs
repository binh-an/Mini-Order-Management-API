using Data.DTOs;

namespace Services.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDTO> RegisterAsync(RegisterDTO model);
        Task<AuthResponseDTO> LoginAsync(LoginDTO model);
    }
}

