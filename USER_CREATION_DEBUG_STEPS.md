# USER CREATION DEBUG GUIDE

## Tình trạng hiện tại:

- ✅ Backend API hoạt động bình thường (đã test thành công)
- ❓ Frontend có vấn đề - cần debug

## Steps để debug:

### 1. Kiểm tra Backend (Đã OK)

```bash
cd soligant-api
node debug-user-creation.js
```

**Kết quả**: ✅ Backend tạo user thành công

### 2. Debug Frontend

#### A. Khởi động frontend với debug logs

```bash
cd soligant-frontend
npm run dev
```

#### B. Mở browser và đăng nhập

- Vào http://localhost:5173
- Đăng nhập với admin@soligant.com / admin123
- Vào User Management

#### C. Mở Developer Tools

- F12 → Console tab
- Clear console

#### D. Test tạo user

1. Bấm "Thêm người dùng"
2. Điền form:
   - Email: test@example.com
   - Password: test123456
   - Họ tên: Test User
   - Số điện thoại: 0123456789
   - Vai trò: employee (chọn từ dropdown)
   - Kích hoạt: ✓
3. Bấm "Tạo"
4. **Quan sát console logs**

### 3. Các logs cần chú ý:

#### Logs thành công:

```
🚀 handleUserSubmit called with: {...}
📝 Dispatching createUser action...
✅ createUser successful: {...}
🎉 Closing modal and refreshing list...
```

#### Logs lỗi phổ biến:

**Lỗi import:**

```
❌ Error: userAPI.createUser is not a function
```

→ Vấn đề với import/export

**Lỗi validation:**

```
❌ Error: {...message: "Email đã tồn tại"}
```

→ Thay đổi email test

**Lỗi auth:**

```
❌ Error: {...status: 401}
```

→ Token hết hạn, đăng nhập lại

**Lỗi network:**

```
❌ Error: Network Error
```

→ Backend không chạy

### 4. Debug steps chi tiết:

#### Nếu không có logs:

- Form submit không được gọi
- Kiểm tra form onSubmit={handleUserSubmit}
- Kiểm tra button type="submit"

#### Nếu có lỗi "createUser is not a function":

```bash
# Check exports
grep -n "export.*createUser" soligant-frontend/src/api/userAPI.js
grep -n "import.*userAPI" soligant-frontend/src/redux/features/userSlice.js
```

#### Nếu có lỗi network:

- Kiểm tra backend đang chạy: `curl http://localhost:3000`
- Kiểm tra CORS settings
- Kiểm tra token trong localStorage/cookies

### 5. Backup plan - Test trực tiếp:

Nếu frontend không hoạt động, test API trực tiếp trong browser console:

```javascript
// Paste in browser console
fetch("http://localhost:3000/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer YOUR_TOKEN_HERE",
  },
  body: JSON.stringify({
    email: "directtest@example.com",
    password: "test123456",
    full_name: "Direct Test",
    phone: "0123456789",
    roles: ["employee"],
    is_active: true,
  }),
})
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

### 6. Checklist cuối:

- [ ] Backend chạy và accessible
- [ ] Frontend chạy không lỗi
- [ ] User đã đăng nhập
- [ ] Form fields được điền đầy đủ
- [ ] Console hiển thị debug logs
- [ ] Network tab hiển thị POST request

## Báo cáo vấn đề:

Khi test, hãy ghi lại:

1. Các bước đã thực hiện
2. Console logs (copy/paste)
3. Network requests (status code, response)
4. Error messages chính xác
