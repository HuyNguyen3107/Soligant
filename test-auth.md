# Test Auth System

## Hướng dẫn test auth system với backend

### 1. Chuẩn bị

- Backend đã chạy tại http://localhost:3000
- Frontend chạy tại http://localhost:5173
- Tài khoản admin đã tạo: email `admin@soligant.com`, password `admin123`

### 2. Test Cases

#### A. Test Login

1. Truy cập http://localhost:5173/admin/login
2. Đăng nhập với:
   - Username/Email: `admin@soligant.com`
   - Password: `admin123`
3. Kiểm tra:
   - Redirect về /admin/dashboard sau khi login thành công
   - Token được lưu vào localStorage
   - Thông tin user hiển thị trong sidebar

#### B. Test Permissions

1. Truy cập /admin/categories
2. Kiểm tra:
   - Trang hiển thị đúng với quyền admin
   - Các nút Create, Edit, Delete hiển thị (admin có tất cả quyền)
   - API calls hoạt động đúng

#### C. Test Token Refresh

1. Đợi token hết hạn (24h) hoặc thử với token ngắn hạn
2. Thực hiện API call bất kỳ
3. Kiểm tra:
   - Token tự động refresh
   - Request được retry thành công
   - User không bị logout

#### D. Test Logout

1. Click nút logout trong sidebar
2. Kiểm tra:
   - Redirect về /admin/login
   - Token bị xóa khỏi localStorage
   - Không thể truy cập admin pages nữa

### 3. Debug Info

- Check Network tab để xem API calls
- Check Console để xem Redux state changes
- Check Application > Local Storage để xem tokens

### 4. Expected API Endpoints

- POST /api/auth/login
- POST /api/auth/logout
- POST /api/auth/refresh-token
- GET /api/auth/me
- GET /api/categories
- POST /api/categories (với auth)
- PUT /api/categories/:id (với auth)
- DELETE /api/categories/:id (với auth)
