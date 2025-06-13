# Hệ Thống Thông Báo Realtime Đơn Hàng Mới - Hướng Dẫn Chi Tiết

## 🎯 Tổng Quan

Hệ thống thông báo realtime được xây dựng để admin/nhân viên nhận thông báo ngay lập tức khi có đơn hàng mới, kèm theo tin nhắn mẫu có thể copy và chỉnh sửa để liên hệ với khách hàng.

## 📋 Tính Năng Chính

### 1. Thông Báo Realtime

- **Tự động**: Thông báo xuất hiện ngay khi có đơn hàng mới
- **Âm thanh**: Có âm báo khi có thông báo mới (có thể tắt/bật)
- **Badge**: Hiển thị số lượng thông báo chưa đọc trên icon bell
- **Priority**: Thông báo đơn hàng mới có độ ưu tiên cao (High)

### 2. Thông Tin Khách Hàng Chi Tiết

- **Họ tên khách hàng**
- **Số điện thoại** (có nút copy riêng biệt)
- **Email**
- **Thông tin đơn hàng**: Mã đơn, sản phẩm, số lượng, tổng tiền
- **Thời gian đặt hàng**: Ngày và giờ chi tiết

### 3. Tin Nhắn Mẫu Thông Minh

- **Tự động thay thế biến**: Template sẽ tự động điền thông tin khách hàng
- **Copy nhanh**: 1 click để copy toàn bộ tin nhắn
- **Edit template**: Admin có thể chỉnh sửa template theo ý muốn
- **Reset template**: Có thể khôi phục về template mặc định

## 🔧 Cách Sử Dụng

### Bước 1: Nhận Thông Báo

1. Khi có đơn hàng mới, icon bell sẽ có badge đỏ
2. Click vào icon bell để mở notification center
3. Thông báo đơn hàng mới sẽ có border màu xanh và background highlight

### Bước 2: Xem Thông Tin Khách Hàng

- **Thông tin cơ bản** hiển thị trong khung màu vàng
- **Copy số điện thoại**: Click nút "Copy SĐT" để sao chép số điện thoại
- **Thông tin đơn hàng**: Mã đơn, tổng tiền hiển thị ngay

### Bước 3: Sử Dụng Tin Nhắn Mẫu

1. **Copy tin nhắn**: Click "Copy tin nhắn" để sao chép toàn bộ
2. **Paste và gửi**: Dán vào Zalo/SMS/WhatsApp để gửi cho khách hàng
3. **Chỉnh sửa**: Có thể edit tin nhắn trước khi gửi

### Bước 4: Quản Lý Thông Báo

- **Đánh dấu đã đọc**: Click để đánh dấu thông báo đã xử lý
- **Xóa thông báo**: Click icon thùng rác để xóa
- **Xóa tất cả**: Trong dropdown có option "Xóa tất cả"

## ⚙️ Cài Đặt Hệ Thống

### Notification Settings

1. **Bật/tắt thông báo**: Toggle switch trong settings
2. **Âm thanh**: Click icon loa để bật/tắt âm báo
3. **Chỉnh sửa template**: Click "Chỉnh sửa tin nhắn mẫu"

### Template Editor

- **Modal editor**: Giao diện chỉnh sửa full-screen
- **Biến động**: Danh sách các biến có thể sử dụng
- **Preview**: Template sẽ được áp dụng cho tất cả thông báo mới
- **Reset**: Khôi phục về template mặc định

## 📝 Template Variables

### Thông Tin Khách Hàng

- `{customerName}` - Tên khách hàng
- `{customerPhone}` - Số điện thoại
- `{customerEmail}` - Email khách hàng

### Thông Tin Đơn Hàng

- `{orderCode}` - Mã đơn hàng
- `{productName}` - Tên sản phẩm
- `{quantity}` - Số lượng
- `{totalAmount}` - Tổng tiền (đã format VND)

### Thông Tin Thời Gian

- `{orderDate}` - Ngày đặt hàng
- `{orderTime}` - Giờ đặt hàng

## 🎨 Template Mặc Định

```
Xin chào {customerName},

Cảm ơn bạn đã đặt hàng tại SOLIGANT! 🎓

📋 THÔNG TIN ĐƠN HÀNG:
• Mã đơn hàng: {orderCode}
• Sản phẩm: {productName} x{quantity}
• Tổng tiền: {totalAmount}
• Ngày đặt: {orderDate}
• Thời gian: {orderTime}

👤 THÔNG TIN KHÁCH HÀNG:
• Họ tên: {customerName}
• Số điện thoại: {customerPhone}
• Email: {customerEmail}

📞 LIÊN HỆ XÁC NHẬN ĐƠN HÀNG:
Anh/chị vui lòng xác nhận đơn hàng qua:
• Hotline: 0123.456.789
• Zalo: 0123.456.789

⏰ Chúng tôi sẽ xử lý đơn hàng trong vòng 30 phút.

Cảm ơn anh/chị đã tin tướng SOLIGANT! 💙

---
Team SOLIGANT
🎓 Chuyên nghiệp - Uy tín - Chất lượng
```

## 🔄 Workflow Thực Tế

### 1. Khi Có Đơn Hàng Mới

```
Khách hàng đặt hàng → Hệ thống tạo notification → Admin/nhân viên nhận thông báo
```

### 2. Quy Trình Xử Lý

```
Nhận thông báo → Xem thông tin KH → Copy SĐT → Copy tin nhắn → Liên hệ KH → Đánh dấu đã đọc
```

### 3. Liên Hệ Khách Hàng

```
Copy SĐT → Mở Zalo/SMS → Copy tin nhắn → Paste → Chỉnh sửa (nếu cần) → Gửi
```

## 🎯 Lợi Ích

### Cho Admin/Nhân Viên

- **Tiết kiệm thời gian**: Không cần soạn tin nhắn từ đầu
- **Chuyên nghiệp**: Template thống nhất, đầy đủ thông tin
- **Hiệu quả**: Copy nhanh, liên hệ ngay
- **Không bỏ sót**: Thông báo realtime, không miss đơn hàng

### Cho Khách Hàng

- **Phản hồi nhanh**: Được liên hệ trong 30 phút
- **Thông tin đầy đủ**: Nhận được xác nhận chi tiết đơn hàng
- **Chuyên nghiệp**: Tin nhắn có format chuẩn, thông tin rõ ràng

## 🧪 Test Tính Năng

### Dev Panel (Chỉ môi trường development)

- **Test Đơn Hàng Mới**: Tạo notification với thông tin khách hàng mẫu
- **Test Thông Báo Khác**: Tạo notification thường
- Có sẵn trong AdminDashboard để dev/test

### Thông Báo Tự Động (Production)

- Kích hoạt mỗi 30-60 giây (có thể tùy chỉnh)
- Tạo đơn hàng mẫu với thông tin ngẫu nhiên
- Dùng để demo/test hệ thống

## 🔧 Cài Đặt Technical

### Files Liên Quan

- `src/redux/features/notificationSlice.js` - Redux state management
- `src/components/admin/NotificationCenter.jsx` - UI component
- `src/hooks/useRealtimeNotifications.js` - Realtime logic
- `src/layouts/AdminLayout.jsx` - Integration

### Tùy Chỉnh

- **Thời gian interval**: Sửa trong `useRealtimeNotifications.js`
- **Template mặc định**: Sửa trong `notificationSlice.js`
- **Mock data**: Sửa customer/product data trong `useRealtimeNotifications.js`

## 🚀 Tương Lai

### Tính Năng Sẽ Phát Triển

- **WebSocket/SSE**: Kết nối backend thực
- **Push Notification**: Thông báo khi không online
- **Phân quyền**: Notification theo vai trò
- **Analytics**: Thống kê hiệu quả xử lý đơn hàng
- **Mobile App**: Thông báo trên điện thoại

### Backend Integration

- API endpoints cho notification
- WebSocket server
- Database lưu notification history
- User preferences

---

_Hệ thống được thiết kế để tối ưu hóa quy trình xử lý đơn hàng, giúp admin/nhân viên phản hồi nhanh chóng và chuyên nghiệp với khách hàng._
