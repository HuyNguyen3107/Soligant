# FIX LỖI CHỨC NĂNG ĐỔI MẬT KHẨU CÁ NHÂN

## Vấn đề

Khi gọi API `PUT /api/users/change-my-password`, backend trả về lỗi:

```
invalid input syntax for type uuid: "change-my-password"
```

## Nguyên nhân

Lỗi xảy ra do thứ tự route trong file `soligant-api/src/routes/user.routes.js` không đúng.

Express Router sẽ match routes theo thứ tự từ trên xuống dưới. Khi route:

```javascript
router.put("/:id", userController.updateUser);
```

được đặt trước route:

```javascript
router.put("/change-my-password", userController.changeMyPassword);
```

Thì khi gọi `/users/change-my-password`, Express sẽ match với pattern `/:id` và coi "change-my-password" như là một user ID, dẫn đến việc gọi hàm `updateUser` thay vì `changeMyPassword`.

## Giải pháp

Di chuyển route `/change-my-password` lên đầu file, trước tất cả các route có parameter `:id`:

### TRƯỚC (SAI):

```javascript
// Cập nhật thông tin nhân viên
router.put("/:id", checkPermission("users.update"), userController.updateUser);

// Đổi mật khẩu cá nhân
router.put("/change-my-password", userController.changeMyPassword);
```

### SAU (ĐÚNG):

```javascript
// Đổi mật khẩu cá nhân - PHẢI đặt trước tất cả routes có :id
router.put("/change-my-password", userController.changeMyPassword);

// Cập nhật thông tin nhân viên
router.put("/:id", checkPermission("users.update"), userController.updateUser);
```

## File đã sửa

- `soligant-api/src/routes/user.routes.js`: Di chuyển route `/change-my-password` lên đầu

## Kết quả

Sau khi sửa, endpoint `PUT /api/users/change-my-password` sẽ hoạt động đúng và gọi function `changeMyPassword` thay vì `updateUser`.

## Lưu ý quan trọng

**Khi làm việc với Express Router, luôn đặt các route cụ thể (specific routes) trước các route có parameter (parameterized routes).**

Ví dụ:

- ✅ `/users/change-my-password` (specific) trước `/:id` (parameterized)
- ✅ `/users/profile` (specific) trước `/:id` (parameterized)
- ❌ `/:id` (parameterized) trước `/change-my-password` (specific)

## Test

Để test chức năng:

1. Khởi động server backend: `cd soligant-api && npm start`
2. Chạy test script: `node test-endpoint-simple.js`
3. Hoặc sử dụng giao diện web tại `/admin/change-password`
