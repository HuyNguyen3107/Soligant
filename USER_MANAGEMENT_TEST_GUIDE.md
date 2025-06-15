// USER_MANAGEMENT_TEST_GUIDE.md

# Hướng dẫn Test Chức năng Quản lý Người dùng

## 1. Setup và Khởi chạy

### Backend:

```bash
cd soligant-api
npm install
npm start
```

### Frontend:

```bash
cd soligant-frontend
npm install
npm run dev
```

## 2. Tạo tài khoản Admin (nếu chưa có)

```bash
cd soligant-api
node create-admin.js
```

## 3. Test Cases cho User Management

### Test 1: Đăng nhập và truy cập User Management

1. Đăng nhập với tài khoản admin
2. Vào trang Admin Dashboard
3. Click vào "Quản lý người dùng" trong sidebar
4. Kiểm tra xem có hiển thị danh sách người dùng không

### Test 2: Tạo người dùng mới

1. Click nút "Thêm người dùng"
2. Điền thông tin:
   - Email: test@example.com
   - Mật khẩu: password123
   - Họ tên: Nguyễn Văn Test
   - Số điện thoại: 0123456789
   - Vai trò: Staff
   - Kích hoạt: true
3. Click "Tạo"
4. Kiểm tra user mới xuất hiện trong danh sách

### Test 3: Chỉnh sửa người dùng

1. Click biểu tượng chỉnh sửa (bút) của user vừa tạo
2. Sửa tên thành "Nguyễn Văn Test Updated"
3. Thay đổi vai trò thành "Manager"
4. Click "Cập nhật"
5. Kiểm tra thông tin đã được cập nhật

### Test 4: Xem thông tin người dùng

1. Click biểu tượng xem (mắt) của user
2. Kiểm tra modal hiển thị đầy đủ thông tin
3. Kiểm tra các trường không thể chỉnh sửa

### Test 5: Đổi mật khẩu

1. Click biểu tượng chìa khóa của user
2. Nhập mật khẩu mới: newpassword123
3. Xác nhận mật khẩu: newpassword123
4. Click "Đổi mật khẩu"
5. Kiểm tra thông báo thành công

### Test 6: Tìm kiếm và lọc

1. Nhập tên user vào ô tìm kiếm
2. Kiểm tra kết quả lọc
3. Thử lọc theo vai trò
4. Thử lọc theo trạng thái

### Test 7: Xóa người dùng

1. Click biểu tượng xóa (thùng rác) của user test
2. Xác nhận xóa trong modal
3. Kiểm tra user bị deactivate (trạng thái thành "Không hoạt động")

### Test 8: Phân quyền

1. Tạo user mới với vai trò "Staff"
2. Đăng nhập bằng user Staff
3. Thử truy cập trang User Management
4. Kiểm tra các nút create/update/delete có bị ẩn không

## 4. API Test bằng Postman/curl

### Lấy Access Token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@soligant.com",
    "password": "admin123"
  }'
```

### Lấy danh sách users:

```bash
curl -X GET "http://localhost:3000/api/users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Tạo user mới:

```bash
curl -X POST http://localhost:3000/api/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "full_name": "New User",
    "phone": "0123456789",
    "roles": ["Staff"],
    "is_active": true
  }'
```

### Cập nhật user:

```bash
curl -X PUT http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Updated User Name",
    "roles": ["Manager"],
    "is_active": true
  }'
```

### Đổi mật khẩu:

```bash
curl -X PUT http://localhost:3000/api/users/USER_ID/password \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "password": "newpassword123"
  }'
```

### Xóa user:

```bash
curl -X DELETE http://localhost:3000/api/users/USER_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 5. Kiểm tra Database

### Xem users:

```sql
SELECT id, email, full_name, is_active, created_at FROM users;
```

### Xem user-role relationships:

```sql
SELECT
  u.email,
  u.full_name,
  r.name as role_name
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON r.id = ur.role_id;
```

### Xem audit logs:

```sql
SELECT
  al.action,
  al.resource_type,
  al.resource_id,
  u.email as performed_by,
  al.created_at
FROM audit_logs al
JOIN users u ON u.id = al.user_id
WHERE al.resource_type = 'users'
ORDER BY al.created_at DESC;
```

## 6. Debugging

### Kiểm tra Redux DevTools:

1. Mở Redux DevTools trong browser
2. Kiểm tra actions: fetchUsers, createUser, updateUser, deleteUser
3. Kiểm tra state changes

### Kiểm tra Network Tab:

1. Mở DevTools > Network
2. Thực hiện các thao tác user management
3. Kiểm tra API calls và responses

### Kiểm tra Console:

1. Mở DevTools > Console
2. Kiểm tra có error nào không
3. Xem các console.log từ debugging

## 7. Common Issues và Solutions

### Issue 1: "Không có quyền truy cập"

- Kiểm tra user có đúng permissions không
- Kiểm tra token có hợp lệ không
- Kiểm tra middleware phân quyền

### Issue 2: API 404 hoặc 500

- Kiểm tra backend có chạy không
- Kiểm tra routes có đúng không
- Kiểm tra database connection

### Issue 3: Redux state không update

- Kiểm tra actions có dispatch đúng không
- Kiểm tra reducers có handle cases không
- Kiểm tra useSelector có đúng không

### Issue 4: Form validation errors

- Kiểm tra required fields
- Kiểm tra email format
- Kiểm tra password strength

## 8. Performance Testing

### Load Testing:

1. Tạo nhiều users (100+)
2. Test pagination
3. Test search/filter performance
4. Test concurrent user creation

### Memory Testing:

1. Monitor browser memory usage
2. Check for memory leaks
3. Test with large datasets

Chúc may mắn với việc testing! 🚀
