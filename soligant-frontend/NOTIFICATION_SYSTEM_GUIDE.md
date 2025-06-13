# Notification System Guide

## Tổng quan

Hệ thống thông báo realtime cho admin/nhân viên khi có đơn hàng mới, bao gồm:

- Thông báo realtime khi có đơn hàng mới
- Tin nhắn mẫu tự động với thông tin khách hàng
- Khả năng copy tin nhắn để liên hệ khách hàng
- Admin có thể chỉnh sửa template tin nhắn

## Các Tính Năng Chính

### 1. Realtime Notifications

- **Đơn hàng mới**: Thông báo ngay khi có order mới (simulation mỗi 30-60s)
- **Thanh toán**: Thông báo khi có payment success
- **Giao hàng**: Thông báo khi đơn hàng được giao
- **Đánh giá**: Thông báo khi có review mới
- **Tồn kho**: Cảnh báo khi sản phẩm sắp hết

### 2. Tin Nhắn Mẫu Tự Động

```
Xin chào {customerName},

Cảm ọn bạn đã đặt hàng tại SOLIGANT!

📋 Thông tin đơn hàng:
• Mã đơn hàng: {orderCode}
• Tổng tiền: {totalAmount}
• Ngày đặt: {orderDate}

📱 Để xử lý đơn hàng nhanh chóng, vui lòng liên hệ với chúng tôi:
• Hotline: 0123.456.789
• Zalo: [Số Zalo của shop]

Chúng tôi sẽ liên hệ xác nhận đơn hàng trong 30 phút.

Trân trọng,
Team SOLIGANT 🎓
```

### 3. Biến Template Hỗ Trợ

- `{customerName}` - Tên khách hàng
- `{orderCode}` - Mã đơn hàng (SO-XXXX)
- `{totalAmount}` - Tổng tiền (format VND)
- `{orderDate}` - Ngày đặt hàng (dd/mm/yyyy)

## User Interface

### Notification Bell

```
🔔 [3] <- Badge hiển thị số thông báo chưa đọc
```

### Notification Panel

```
┌─ Thông báo ─────────────── ⚙️ ✕ ┐
├─ [Tất cả (5)] [Đơn hàng (3)] ─────┤
├─ Đánh dấu đã đọc    Xóa tất cả ────┤
├───────────────────────────────────┤
│ 🛒 Đơn hàng mới                   │
│ Khách hàng Nguyễn Văn A vừa đặt   │
│ đơn hàng SO-1234                  │
│ ┌─ Tin nhắn liên hệ: ───── Copy ─┐│
│ │ Xin chào Nguyễn Văn A,...      ││
│ └─────────────────────────────────┘│
│ 💰 Thanh toán thành công          │
│ 🚚 Đơn hàng đã giao               │
└───────────────────────────────────┘
```

### Settings Panel

- **Bật/tắt thông báo**: Toggle notifications on/off
- **Âm thanh**: Enable/disable notification sound
- **Chỉnh sửa template**: Customize message template

## Technical Implementation

### Redux State Structure

```javascript
// notifications slice state
{
  notifications: [
    {
      id: "order-123-1234567890",
      type: "new_order",
      title: "Đơn hàng mới",
      message: "Khách hàng X vừa đặt đơn hàng Y",
      order: { id, code, total, createdAt, ... },
      customer: { id, name, phone, email },
      generatedMessage: "Xin chào X, cảm ơn...",
      timestamp: "2025-06-13T10:30:00.000Z",
      read: false,
      priority: "high"
    }
  ],
  orderNotifications: [...], // filtered order notifications
  messageTemplate: "Xin chào {customerName}...",
  unreadCount: 3,
  isEnabled: true,
  soundEnabled: true
}
```

### Components Architecture

```
AdminLayout
├── NotificationCenter (header)
│   ├── Bell Icon + Badge
│   ├── Dropdown Panel
│   │   ├── Settings Panel
│   │   ├── Tabs (All/Orders)
│   │   ├── Notification List
│   │   └── Action Buttons
│   └── Template Editor Modal
└── useRealtimeNotifications (hook)
```

### Key Files

```
src/
├── redux/features/notificationSlice.js
├── components/admin/NotificationCenter.jsx
├── hooks/useRealtimeNotifications.js
└── layouts/AdminLayout.jsx
```

## Workflow Usage

### 1. Nhận Thông Báo Đơn Hàng Mới

1. **Auto notification**: Hệ thống tự động tạo thông báo khi có order mới
2. **Sound alert**: Phát âm thanh thông báo (nếu enabled)
3. **Badge update**: Số badge trên bell icon tăng lên
4. **Template generation**: Tự động tạo tin nhắn với thông tin khách hàng

### 2. Xử Lý Thông Báo

1. **Click bell**: Mở notification panel
2. **View order notifications**: Chuyển tab "Đơn hàng"
3. **Copy message**: Click "Copy" để copy tin nhắn liên hệ
4. **Contact customer**: Paste tin nhắn vào Zalo/SMS/WhatsApp
5. **Mark as read**: Đánh dấu đã xử lý

### 3. Quản Lý Template

1. **Open settings**: Click ⚙️ trong notification panel
2. **Edit template**: Click "Chỉnh sửa tin nhắn mẫu"
3. **Customize message**: Sửa nội dung, sử dụng biến {customerName}, etc.
4. **Save/Reset**: Lưu hoặc reset về mặc định

## Customization Options

### Message Template Variables

```javascript
// Available variables
{
  customerName;
} // -> "Nguyễn Văn A"
{
  orderCode;
} // -> "SO-1234"
{
  totalAmount;
} // -> "295.000 ₫"
{
  orderDate;
} // -> "13/06/2025"
```

### Notification Types

```javascript
const notificationTypes = {
  new_order: { icon: "🛒", priority: "high" },
  payment: { icon: "💰", priority: "normal" },
  shipping: { icon: "🚚", priority: "normal" },
  review: { icon: "⭐", priority: "low" },
  inventory: { icon: "📦", priority: "high" },
};
```

### Sound Integration

- **Default**: Browser notification sound
- **Custom**: Add audio files to `/public/` folder
- **Formats**: MP3, OGG for browser compatibility

## Development & Testing

### Mock Data Generation

- **Fake customers**: Random names, phones, emails
- **Mock orders**: Random products, quantities, totals
- **Realistic timing**: 30-60s intervals for orders

### Dev Panel (Development Only)

```jsx
// Shows in development mode
<DevPanel>
  <button onClick={triggerTestOrderNotification}>
    Test Order Notification
  </button>
  <button onClick={triggerTestGeneralNotification}>
    Test General Notification
  </button>
</DevPanel>
```

### Test Scenarios

1. **New order**: Trigger order notification with customer data
2. **Copy message**: Test clipboard functionality
3. **Template editing**: Modify and save template
4. **Sound toggle**: Enable/disable notification sounds
5. **Mark as read**: Test read state management

## Production Considerations

### Backend Integration

```javascript
// Real implementation would use WebSocket/SSE
useEffect(() => {
  const socket = io("ws://localhost:3001");

  socket.on("new_order", (orderData) => {
    dispatch(addOrderNotification(orderData));
  });

  return () => socket.disconnect();
}, []);
```

### Performance Optimizations

- **Notification limit**: Keep max 50 notifications
- **Auto cleanup**: Remove old notifications
- **Efficient updates**: Only update UI when needed
- **Memory management**: Clear intervals on unmount

### Security & Privacy

- **GDPR compliance**: Handle customer data appropriately
- **Data retention**: Auto-delete old notifications
- **Access control**: Only authenticated admin/staff
- **Audit logging**: Track notification actions

## Troubleshooting

### Common Issues

1. **No notifications**: Check `isEnabled` setting
2. **No sound**: Check `soundEnabled` and browser autoplay policy
3. **Template not saving**: Check Redux state updates
4. **Copy not working**: Browser clipboard permissions

### Browser Support

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Limited autoplay (sound)
- **Edge**: Full support
- **Mobile**: Limited notification API

Hệ thống notification giúp admin/nhân viên phản hồi nhanh chóng với khách hàng, cải thiện trải nghiệm dịch vụ và tăng conversion rate! 🎯
