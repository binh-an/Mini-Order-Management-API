using AutoMapper;
using Data.DTOs.OrderDTO;
using Data.DTOs.OrderDetailDTO;
using Data.Entities;


namespace Data
{
    // Đây là cấu hình AutoMapper map giữa Entity và DTO
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Order, OrderResponseDto>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.OrderDetails));

            CreateMap<OrderDetail, OrderDetailResponseDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name));
                  // Map: OrderCreateDto -> Order
            CreateMap<OrderCreateDto, Order>();

            // Map: OrderDetailCreateDto -> OrderDetail
            CreateMap<OrderDetailCreateDto, OrderDetail>();
        }
    }
}
