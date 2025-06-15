# Hướng dẫn Test Chức năng Tạo Người dùng

## 🚀 Tổng quan

Chức năng tạo người dùng đã được làm lại hoàn toàn với:

- Backend API chuẩn REST (Node.js + Sequelize)
- Frontend React + Redux với validation đầy đủ
- Error handling và logging chi tiết
- Response format thống nhất

## 📁 Files đã được cập nhật

### Backend:

- `soligant-api/src/controllers/user.controller.js` - API endpoints với response format mới
- `soligant-api/src/routes/user.routes.js` - Routes configuration

### Frontend:

- `soligant-frontend/src/api/userAPI.js` - API client
- `soligant-frontend/src/redux/features/userSlice.js` - Redux slice với format mới
- `soligant-frontend/src/pages/admin/UserManagement.jsx` - UI component hoàn toàn mới
- `soligant-frontend/src/components/UserCreationTest.jsx` - Component test (tùy chọn)

### Test Scripts:

- `test-user-creation-full.js` - Test backend API
- `frontend-user-creation-test.js` - Test frontend (browser)

## 🔧 Chuẩn bị Test

### 1. Khởi động Backend

```bash
cd soligant-api
npm start
# Hoặc
npm run dev
```

### 2. Khởi động Frontend

```bash
cd soligant-frontend
npm start
# Hoặc
npm run dev
```

### 3. Đăng nhập hệ thống

- Mở browser và đăng nhập với tài khoản admin
- Đảm bảo có quyền `USERS.CREATE`

## 🧪 Test Cases

### Test Case 1: Kiểm tra API Backend

**Chạy script test:**

```bash
cd soligant-api
node debug-user-creation.js
```

**Kiểm tra endpoints:**

- GET `/api/users` - Lấy danh sách users
- POST `/api/users` - Tạo user mới
- GET `/api/roles` - Lấy danh sách roles

**Expected Response Format:**

```json
{
  "success": true,
  "data": {...},
  "meta": {...}
}
```

### Test Case 2: Test Frontend UI

**Bước 1: Mở trang quản lý người dùng**

- Navigate đến `/admin/users`
- Kiểm tra danh sách users hiển thị

**Bước 2: Mở modal tạo user**

- Click nút "Tạo người dùng mới"
- Modal phải mở với form đầy đủ các trường

**Bước 3: Điền form**

- Email: `test@example.com`
- Password: `password123`
- Họ tên: `Test User`
- Số điện thoại: `0123456789`
- Vai trò: Chọn một hoặc nhiều roles
- Trạng thái: Checked (active)

**Bước 4: Submit form**

- Click "Tạo người dùng"
- Quan sát console logs
- Kiểm tra network requests trong DevTools

### Test Case 3: Validation Testing

**Test các trường bắt buộc:**

- Bỏ trống email → Hiển thị lỗi
- Bỏ trống password → Hiển thị lỗi
- Bỏ trống họ tên → Hiển thị lỗi

**Test định dạng email:**

- Email không hợp lệ → Hiển thị lỗi

**Test độ dài password:**

- Password < 6 ký tự → Hiển thị lỗi

### Test Case 4: Error Handling

**Test email trùng lặp:**

- Tạo user với email đã tồn tại
- Kiểm tra error message hiển thị

**Test lỗi server:**

- Tắt backend server
- Thử tạo user
- Kiểm tra error handling

## 🔍 Debug Instructions

### 1. Browser Console Logs

Mở DevTools Console và tìm các logs:

```
🔄 Loading users and roles...
🆕 Opening create user modal
📝 Updating create form field: email = test@example.com
🚀 Starting create user submission
📤 Dispatching createUser action...
✅ Create user successful: {...}
```

### 2. Network Tab

Kiểm tra các requests:

- `GET /api/users` - Status 200
- `GET /api/roles` - Status 200
- `POST /api/users` - Status 201

### 3. Redux DevTools

Quan sát Redux actions:

- `users/fetchUsers/pending`
- `users/fetchUsers/fulfilled`
- `users/createUser/pending`
- `users/createUser/fulfilled`

### 4. Script Test trong Browser

Mở Console và chạy:

```javascript
// Load test script
const script = document.createElement("script");
script.src = "/frontend-user-creation-test.js";
document.head.appendChild(script);

// Sau khi load xong, chạy:
testUserCreation();
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

**1. "No authentication token found"**

- Đăng nhập lại
- Kiểm tra localStorage có auth token

**2. "Permission denied"**

- Kiểm tra user có quyền USERS.CREATE
- Kiểm tra role permissions

**3. "Email đã tồn tại"**

- Sử dụng email khác
- Hoặc xóa user test cũ

**4. "Redux store not found"**

- Kiểm tra Redux DevTools
- Kiểm tra store configuration

**5. Modal không mở**

- Kiểm tra permissions
- Kiểm tra console errors
- Kiểm tra component state

### Debug Steps:

1. **Kiểm tra Backend:**

   ```bash
   curl -X GET http://localhost:5000/api/users \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

2. **Kiểm tra Frontend State:**

   ```javascript
   // Trong browser console
   console.log(window.__store__.getState());
   ```

3. **Kiểm tra API Calls:**
   - Mở Network tab
   - Thực hiện action
   - Kiểm tra request/response

## ✅ Success Criteria

**Chức năng hoạt động đúng khi:**

1. Modal tạo user mở được
2. Form validation hoạt động
3. API call thành công (Status 201)
4. User mới xuất hiện trong danh sách
5. Không có errors trong console
6. Redux state được cập nhật đúng

## 📝 Test Checklist

- [ ] Backend API hoạt động
- [ ] Frontend modal mở được
- [ ] Form validation hoạt động
- [ ] User tạo thành công
- [ ] Danh sách user được refresh
- [ ] Error handling hoạt động
- [ ] Console logs hiển thị đúng
- [ ] Network requests thành công
- [ ] Redux state cập nhật đúng
- [ ] Permissions kiểm tra đúng

## 🔄 Next Steps

Sau khi test thành công:

1. Test các edge cases khác
2. Test performance với nhiều users
3. Test integration với các features khác
4. Deploy và test trên production

---

**Ghi chú:** Nếu gặp lỗi không mong muốn, hãy ghi lại:

- Console error messages
- Network request details
- Redux state changes
- User actions performed

Để có thể debug và fix nhanh chóng.
