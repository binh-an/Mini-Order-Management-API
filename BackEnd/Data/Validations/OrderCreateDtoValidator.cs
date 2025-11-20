using FluentValidation;
using Data.DTOs.OrderDTO;

namespace Data.Validations
{
    public class OrderCreateDtoValidator : AbstractValidator<OrderCreateDto>
    {
        public OrderCreateDtoValidator()
        {
            RuleFor(x => x.CustomerId)
                .GreaterThan(0).WithMessage("CustomerId không hợp lệ.");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Đơn hàng phải có ít nhất một sản phẩm.");

            RuleForEach(x => x.Items).SetValidator(new OrderDetailCreateDtoValidator());
        }
    }
}