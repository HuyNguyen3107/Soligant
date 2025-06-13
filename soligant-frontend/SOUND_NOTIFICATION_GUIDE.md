# Chức Năng Bật/Tắt Âm Thanh và Thông Báo - Hướng Dẫn Chi Tiết

## 🔊 Chức Năng Bật/Tắt Âm Thanh

### Tác Dụng

- **Khi BẬT**: Sẽ phát âm thanh thông báo mỗi khi có thông báo mới (đặc biệt là đơn hàng mới)
- **Khi TẮT**: Chỉ hiển thị thông báo visual (icon, badge, popup) mà không có âm thanh

### Cách Hoạt Động

1. **Âm thanh tự động tạo**: Sử dụng Web Audio API để tạo âm thanh "chuông" 2 tông
2. **Tự động phát**: Khi có thông báo mới trong vòng 5 giây và âm thanh được bật
3. **Test sound**: Có nút "🔊 Test âm thanh thông báo" để kiểm tra

### Đặc Điểm Kỹ Thuật

- **Frequency**: 800Hz -> 600Hz -> 800Hz (âm thanh dễ chịu)
- **Duration**: 0.3 giây
- **Volume**: 30% (không quá to, không quá nhỏ)
- **Fallback**: Nếu không support Web Audio API, sẽ log console

## 🔔 Chức Năng Bật/Tắt Thông Báo

### Tác Dụng

- **Khi BẬT**: Hệ thống sẽ tạo thông báo mới từ mock data/API
- **Khi TẮT**: Dừng việc tạo thông báo mới (thông báo cũ vẫn còn)

### Cách Hoạt Động

1. **Auto notification**: Tạo thông báo đơn hàng mỗi 30-60 giây
2. **General notification**: Tạo thông báo khác mỗi 60-120 giây
3. **Visual indicator**: Hiển thị cảnh báo khi tắt thông báo

## 🎛️ Giao Diện Cài Đặt

### Vị Trí

- Trong NotificationCenter (icon chuông)
- Click icon "⚙️" để mở settings panel

### Các Tùy Chọn

#### 1. Toggle Thông Báo

```
[Bật thông báo] ○————●
Nhận thông báo mới
```

- **Switch button**: Màu xanh khi bật, xám khi tắt
- **Tooltip**: Hiển thị trạng thái hiện tại
- **Toast feedback**: Hiện thông báo xác nhận khi toggle

#### 2. Toggle Âm Thanh

```
[Âm thanh thông báo] 🔊
Phát âm thanh khi có thông báo mới
```

- **Icon button**: 🔊 khi bật, 🔇 khi tắt
- **Visual state**: Màu xanh + background khi bật
- **Toast feedback**: Hiện thông báo xác nhận khi toggle

#### 3. Test Âm Thanh

```
🔊 Test âm thanh thông báo
```

- **Chỉ hiện khi âm thanh BẬT**
- **Disabled khi âm thanh TẮT**
- **Click để test âm thanh**

## 📱 Toast Notifications

### Khi Toggle Settings

- **Bật thông báo**: "🔔 Đã bật thông báo"
- **Tắt thông báo**: "🔕 Đã tắt thông báo"
- **Bật âm thanh**: "🔊 Đã bật âm thanh"
- **Tắt âm thanh**: "🔇 Đã tắt âm thanh"

### Hiển thị

- **Vị trí**: Bottom-right corner
- **Duration**: 3 giây
- **Animation**: Fade in/out với scale effect
- **Style**: Dark background, white text

## ⚠️ Cảnh Báo Khi Tắt

### Thông Báo Bị Tắt

```
⚠️ Thông báo đã bị tắt. Bật lại trong cài đặt để nhận thông báo mới.
```

- **Hiển thị**: Trong notification dropdown
- **Style**: Yellow background, border trái vàng
- **Vị trí**: Trên danh sách thông báo

## 🔄 Workflow Sử Dụng

### Bật Thông Báo + Âm Thanh

```
1. Click icon chuông 🔔
2. Click icon cài đặt ⚙️
3. Bật toggle "Bật thông báo"
4. Bật toggle âm thanh 🔊
5. Test âm thanh (optional)
6. Click outside để đóng settings
```

### Tắt Chỉ Âm Thanh (Vẫn Nhận Thông Báo)

```
1. Vào settings notification
2. Giữ "Bật thông báo" ON
3. Tắt toggle âm thanh 🔇
4. Notification vẫn hiện nhưng không có âm thanh
```

### Tắt Hoàn Toàn

```
1. Vào settings notification
2. Tắt "Bật thông báo" OFF
3. Hệ thống ngừng tạo thông báo mới
4. Hiện cảnh báo trong dropdown
```

## 🎯 Use Cases Thực Tế

### Môi Trường Văn Phòng

- **Giờ làm việc**: Bật cả thông báo và âm thanh
- **Họp/Call**: Tắt âm thanh, giữ visual notification
- **Sau giờ làm**: Tắt hoàn toàn

### Làm Việc Tại Nhà

- **Focus time**: Tắt âm thanh, check thông báo định kỳ
- **Available time**: Bật đầy đủ để phản hồi nhanh
- **Break time**: Tắt hoàn toàn

### Nhiều Tab/Window

- **Primary admin tab**: Bật đầy đủ
- **Background tabs**: Tắt âm thanh (vẫn hiện badge)

## 🔧 Technical Implementation

### State Management (Redux)

```javascript
// notificationSlice.js
const initialState = {
  isEnabled: true, // Bật/tắt thông báo
  soundEnabled: true, // Bật/tắt âm thanh
  // ...
};
```

### Sound Generation

```javascript
// Web Audio API
const audioContext = new AudioContext();
const oscillator = audioContext.createOscillator();
oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
// Tạo âm thanh 2-tone bell
```

### Visual Indicators

- **Bell icon**: Solid khi có unread, outline khi không
- **Badge**: Animate pulse khi có unread
- **Settings icons**: Dynamic dựa trên state
- **Toast**: Fixed position, z-index cao

## 🚀 Tính Năng Nâng Cao (Future)

### Browser Notification API

- Permission request khi bật thông báo
- Native OS notification khi tab không active
- Rich notification với action buttons

### Custom Sound

- Upload file âm thanh tùy chỉnh
- Volume slider
- Different sounds cho different notification types

### Smart Notifications

- Quiet hours (tự động tắt âm thanh theo giờ)
- Do not disturb mode
- Priority-based sound (urgent = loud, normal = soft)

### Analytics

- Track notification engagement
- Sound effectiveness metrics
- User behavior patterns

---

## 💡 Tips Sử Dụng

1. **Test âm thanh trước** khi vào ca làm việc
2. **Tắt âm thanh khi screenshare** để tránh làm phiền
3. **Bật lại âm thanh khi multitask** để không bỏ lỡ đơn hàng
4. **Check cài đặt browser** nếu không nghe thấy âm thanh
5. **Sử dụng headphone** để âm thanh rõ hơn trong môi trường ồn

_Hệ thống được thiết kế để linh hoạt, phù hợp với nhiều tình huống làm việc khác nhau._
