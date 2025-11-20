
using FluentValidation;
using Data.DTOs.OrderDetailDTO;

namespace Data.Validations
{
    public class OrderDetailCreateDtoValidator : AbstractValidator<OrderDetailCreateDto>
    {
        public OrderDetailCreateDtoValidator()
        {
            RuleFor(x => x.ProductId)
                .GreaterThan(0).WithMessage("Mã sản phẩm là bắt buộc.");

            RuleFor(x => x.Quantity)
                .GreaterThan(0).WithMessage("Số lượng mua phải lớn hơn 0.");
        }
    }
}



