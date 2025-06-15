# USER CREATION FIX GUIDE

## Vấn đề đã sửa:

- **Lỗi**: `userAPI.createUser is not a function`
- **Nguyên nhân**: Xung đột giữa named exports và default export trong userAPI.js
- **Giải pháp**: Chỉ sử dụng named exports

## Thay đổi đã thực hiện:

### 1. userAPI.js

- Loại bỏ default export object
- Chỉ sử dụng named exports để tránh xung đột

### 2. userSlice.js

- Giữ nguyên import `* as userAPI`
- Cải thiện error handling

### 3. UserManagement.jsx

- Cải thiện error display cho user
- Giữ lại error handling trong try-catch

### 4. axiosClient.js

- Loại bỏ debug logs
- Giữ nguyên interceptors

## Cách test:

1. **Khởi động backend**:

   ```bash
   cd soligant-api
   npm start
   ```

2. **Khởi động frontend**:

   ```bash
   cd soligant-frontend
   npm run dev
   ```

3. **Test tạo user**:
   - Đăng nhập với admin@soligant.com / admin123
   - Vào User Management
   - Bấm "Thêm người dùng"
   - Điền thông tin và bấm "Tạo"
   - Kiểm tra console để xem có lỗi không

## Lỗi có thể gặp:

### 1. Server không chạy

- **Lỗi**: Network Error hoặc connection refused
- **Giải pháp**: Đảm bảo backend đang chạy ở port 3000

### 2. Token hết hạn

- **Lỗi**: 401 Unauthorized
- **Giải pháp**: Đăng nhập lại để lấy token mới

### 3. Thiếu quyền

- **Lỗi**: 403 Forbidden
- **Giải pháp**: Đảm bảo user có permission "users.create"

### 4. Validation error

- **Lỗi**: 400 Bad Request với chi tiết lỗi
- **Giải pháp**: Kiểm tra required fields: email, password, full_name

## Debug steps:

1. **Kiểm tra console Browser**:

   - F12 → Console tab
   - Tìm lỗi màu đỏ

2. **Kiểm tra Network tab**:

   - F12 → Network tab
   - Xem request POST /api/users
   - Kiểm tra status code và response

3. **Kiểm tra backend logs**:
   - Terminal chạy server
   - Xem có lỗi server không

## Nếu vẫn lỗi:

1. Clear browser cache và reload
2. Restart cả frontend và backend
3. Kiểm tra database connection
4. Verify .env file có đầy đủ config
