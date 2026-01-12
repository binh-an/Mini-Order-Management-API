using FluentValidation;
using Data.DTOs.OrderDTO;
using Data.DTOs;
namespace Data.Validations
{
   public class CreateCustomerDtoValidator : AbstractValidator<CreateCustomerDto>
    {
        public CreateCustomerDtoValidator()
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^0[3|5|7|8|9]\d{8}$")
                .WithMessage("Số điện thoại Việt Nam không hợp lệ!");
            RuleFor(x => x.Address).NotEmpty().MaximumLength(200);
        }
    }

    public class UpdateCustomerDtoValidator : AbstractValidator<UpdateCustomerDto>
    {
        public UpdateCustomerDtoValidator()
        {
            RuleFor(x => x.Id).NotEmpty();

            
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.PhoneNumber)
                .NotEmpty()
                .Matches(@"^0[3|5|7|8|9]\d{8}$")
                .WithMessage("Số điện thoại Việt Nam không hợp lệ!");
            RuleFor(x => x.Address).NotEmpty().MaximumLength(200);
        }
    }
    public class OrderUpdateDtoValidator : AbstractValidator<OrderUpdateDto>
    {
        public OrderUpdateDtoValidator()
        {
            RuleFor(x => x.CustomerId)
                .GreaterThan(0).WithMessage("Khách hàng không hợp lệ!");

            RuleFor(x => x.Items)
                .NotEmpty().WithMessage("Đơn hàng phải có ít nhất 1 sản phẩm!");

            RuleForEach(x => x.Items).ChildRules(item =>
            {
                item.RuleFor(i => i.ProductId)
                    .GreaterThan(0).WithMessage("Sản phẩm không hợp lệ!");

                item.RuleFor(i => i.Quantity)
                    .GreaterThan(0).WithMessage("Số lượng phải lớn hơn 0!");

                item.RuleFor(i => i.UnitPrice)
                    .GreaterThan(0).WithMessage("Giá sản phẩm phải lớn hơn 0!");
            });
        }
    }
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