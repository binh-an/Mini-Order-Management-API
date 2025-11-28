# Product Management Frontend
Ứng dụng quản lý sản phẩm, cho phép thêm, sửa, xóa, tìm kiếm sản phẩm, upload ảnh, kết nối API backend.

## Công nghệ & Thư viện
- **React**: xây dựng giao diện người dùng.
- **React Router**: điều hướng giữa các trang.
- **Axios**: gọi API tới backend.
- **FormData**: xử lý upload ảnh.
- **CSS**: styling cho các component và giao diện.
- **React Context API**: quản lý state toàn cục

## Cài đặt
1. Clone repository:
   git clone <repo-url>
2. Cài dependencies:
   npm install
3. Chạy project:
   npm run dev

## Cấu trúc project
- `/src`
  - `components/` → các UI component: header, popup, productCard,...
  - `pages/` → các trang login, register, create-product,...
  - `context/` → quản lý state toàn cục (cart, user)
  - `api/` → các hàm gọi API
  - `style/` → file CSS

## Hướng dẫn sử dụng
- Người dùng login nếu có tài khoản, không thì tạo tài khoản, khi tạo thành công sẽ tự chuyển sang trang chính.
- Trang `Order` là nơi hiển thị tất cả sản phẩm.
    - Tìm kiếm sản phẩm theo tên
    - Thêm sản phẩm vào giỏ hàng
- Trang `Cart` là nơi hiển thị sản phẩm đã được thêm vào từ trang `Order`
    - Người dùng chọn sản phẩm, số lượng và order.
    - Order xong thì sẽ lưu thông tin order vào `Order List` và chuyển về trang `Order`
**User**
    - Không vào `Create` được.
    - Khi mở `Order List` thì chỉ nhìn thấy order của chính mình.
**Chỉ Admin mới làm được**
    - Mở trang `Create` để thêm/sửa/xóa sản phẩm.
        - Upload ảnh sản phẩm trực tiếp khi thêm hoặc cập nhật
        -Tìm sản phẩm theo ID
    - Mở trang `Customer` để có thể thêm customer, có thể thêm, sửa, xóa, cập nhật.
    - Mở trang `Order List` để có thể xem danh sách order, hiển thị tất cả các order, có thể sửa trạng thái, xóa order.

## Lưu ý
- Cần kết nối backend API đúng URL
- Chưa có authentication nâng cao, token có thể hết hạn
- Chưa tối ưu performance khi số lượng sản phẩm lớn
