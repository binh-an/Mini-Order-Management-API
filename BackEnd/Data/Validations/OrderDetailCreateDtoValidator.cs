
using FluentValidation;
using Data.DTOs.OrderDetailDTO;
using Data.DTOs;

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

    public class ProductCreateValidator : AbstractValidator<CreateProductDTO>
    {
        public ProductCreateValidator()
        {
            RuleFor(x => x.Name)
                .NotEmpty().WithMessage("Tên sản phẩm không được để trống.")
                .MaximumLength(200).WithMessage("Tên sản phẩm quá dài.");

            RuleFor(x => x.Price)
         //       .GreaterThanOrEqualTo(0).WithMessage("Giá sản phẩm không được âm!")
                .GreaterThan(0).WithMessage("Giá sản phẩm phải lớn hơn 0 đồng!")
                .LessThan(100_000_000).WithMessage("Giá không được vượt quá 100 triệu.");

            RuleFor(x => x.StockQuantity)
             //   .GreaterThanOrEqualTo(0).WithMessage("Tồn kho không được âm!");
                  .GreaterThan(0).WithMessage("Phải có ít nhất 1 sản phẩm trong kho!");
        }
    }

    public class ProductUpdateValidator : AbstractValidator<UpdateProductDTO>
    {
        public ProductUpdateValidator()
        {
            RuleFor(x => x.Price)
                .GreaterThan(0).WithMessage("Giá sản phẩm phải lớn hơn 0 đồng!");

            RuleFor(x => x.StockQuantity)
                .GreaterThan(0).WithMessage("Phải có ít nhất 1 sản phẩm trong kho!");
        }
    }

}



