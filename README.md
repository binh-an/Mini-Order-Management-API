# Mini-Order-Management-API
Mini Order Management 🛒

Hệ thống quản lý đơn hàng (Mini Order Management) được xây dựng theo kiến trúc Client-Server tách biệt. Dự án tập trung phát triển các RESTful API mạnh mẽ bằng ASP.NET Core ở phía Backend và giao diện tương tác người dùng ở phía Frontend, đảm bảo quy trình bán hàng chặt chẽ, bảo mật và hiệu năng cao.

🚀 Giới thiệu
Dự án cung cấp giải pháp quản lý bán hàng thu nhỏ với các quy tắc nghiệp vụ nghiêm ngặt:
Backend: Xử lý logic, tính toán, xác thực và lưu trữ dữ liệu.
Frontend: Giao diện người dùng (SPA) để tương tác với hệ thống.
Bảo mật: Áp dụng JWT (JSON Web Token) và phân quyền Role-based (Admin/User).

🛠 Công nghệ sử dụng
🔙 Backend (Server)

Framework: ASP.NET Core Web API (.NET 6/7/8)

Database: SQL Server

ORM: Entity Framework Core 

Authentication: JWT Bearer Token

Kiến trúc: Repository Pattern, DTOs (Data Transfer Objects)

🎨 Frontend (Client)

Framework: (ReactJS)

HTTP Client: Axios

UI Library: CSS thuần 

🏗 Kiến trúc & Cơ sở dữ liệu

Product: ID, Tên, Giá, Mô tả, Tồn kho.

Customer: ID, Tên, Email, SĐT, Địa chỉ.

Order: ID, CustomerID, Ngày tạo, Trạng thái, Tổng tiền.

OrderDetail: OrderID, ProductID, Số lượng, Đơn giá lúc đặt.

Nguyên tắc xử lý (Backend Rules)

Validation: Dữ liệu được kiểm tra chặt chẽ tại Server (Giá $\ge$ 0, Tồn kho $\ge$ 0, Email đúng định dạng).

Business Logic:

Không tin tưởng giá tiền từ Client gửi lên. 

Server tự lấy giá từ Database để tính Tổng tiền.Tự động kiểm tra tồn kho trước khi tạo đơn.

Tự động trừ tồn kho sau khi tạo đơn thành công.

✨ Tính năng chính
1. Phân quyền (Authorization)

Admin: Có toàn quyền hệ thống (CRUD Sản phẩm, Xem tất cả đơn hàng).

User: Chỉ có quyền xem sản phẩm, tạo đơn hàng mới và xem lịch sử đơn hàng của chính mình.

2. Quản lý Sản phẩm

Hiển thị danh sách sản phẩm (Public).

Thêm, Sửa, Xóa sản phẩm (Admin Only).

3. Đặt hàng (Checkout)

Hỗ trợ giỏ hàng nhiều sản phẩm.

Xử lý giao dịch tạo đơn hàng (Order) và chi tiết đơn hàng (Order Detail) trong cùng một request (Atomic Transaction).

⚙️ Cài đặt & Hướng dẫn chạy
Yêu cầu tiên quyết

.NET SDK (Phiên bản tương ứng project)

SQL Server

React

Bước 1: Cấu hình Backend
Di chuyển vào thư mục Backend.

Mở file appsettings.json, cập nhật Connection String và JWT Secret Key.

Chạy Migration để tạo Database: dotnet ef database update

Khởi chạy Server: dotnet run

Bước 2: Cấu hình Frontend

Di chuyển vào thư mục Frontend.

Cấu hình Base URL trỏ tới port của Backend đang chạy.

Cài đặt thư viện : npm install

Khởi chạy client: npm dev run


⚠️ HTTP Status Codes
Hệ thống trả về các mã lỗi chuẩn RESTful:

200 OK: Thành công.

201 Created: Tạo mới thành công.

400 Bad Request: Lỗi dữ liệu đầu vào (Validation failed, Hết hàng...).

401 Unauthorized: Chưa đăng nhập hoặc Token không hợp lệ.

403 Forbidden: Không đủ quyền truy cập (User cố vào trang Admin).

500 Internal Server Error: Lỗi máy chủ.
