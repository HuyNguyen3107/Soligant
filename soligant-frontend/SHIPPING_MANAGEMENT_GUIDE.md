# Hướng Dẫn Hệ Thống Quản Lý Vận Chuyển

## Tổng Quan

Hệ thống quản lý vận chuyển được thiết kế để tích hợp với Viettel Post API, cho phép:

- Tạo đơn hàng vận chuyển với một nút bấm
- Theo dõi trạng thái vận chuyển realtime
- Khách hàng có thể tra cứu trạng thái vận chuyển công khai
- Cập nhật thông tin vận chuyển cho khách hàng

## Cấu Trúc Files

### Redux Store

- **shippingSlice.js**: Quản lý state và async actions cho shipping
  - Actions: fetchShippingOrders, createShippingOrder, updateShippingStatus, trackShippingPublic
  - State: orders, loading, error, filters, statistics, trackingResult
  - Selectors: selectShippingOrders, selectShippingLoading, etc.

### Admin Components

- **ShippingManagement.jsx**: Trang quản lý vận chuyển cho admin
  - Hiển thị danh sách đơn hàng vận chuyển
  - Tạo đơn vận chuyển mới
  - Cập nhật trạng thái vận chuyển
  - Xem chi tiết đơn hàng

### Public Components

- **TrackingPage.jsx**: Trang tra cứu công khai cho khách hàng
  - Nhập mã vận đơn Viettel Post
  - Hiển thị thông tin chi tiết vận chuyển
  - Timeline trạng thái vận chuyển

## Tính Năng Chính

### 1. Tạo Đơn Vận Chuyển

```javascript
// Tạo đơn vận chuyển từ đơn hàng có sẵn
const handleCreateOrder = async (orderData) => {
  try {
    await dispatch(createShippingOrder(orderData)).unwrap();
    // Tự động tạo mã Viettel Post
    // Tính phí vận chuyển
    // Gửi thông tin đến Viettel Post API
  } catch (error) {
    console.error("Error creating shipping order:", error);
  }
};
```

### 2. Theo Dõi Trạng Thái

```javascript
// Cập nhật trạng thái vận chuyển
const handleUpdateStatus = async (updateData) => {
  try {
    await dispatch(updateShippingStatus(updateData)).unwrap();
    // Cập nhật trạng thái trong database
    // Gửi notification cho khách hàng
    // Cập nhật timeline tracking
  } catch (error) {
    console.error("Error updating shipping status:", error);
  }
};
```

### 3. Tra Cứu Công Khai

```javascript
// Khách hàng tra cứu bằng mã vận đơn
const handleSearch = async () => {
  try {
    await dispatch(trackShippingPublic(trackingCode.trim())).unwrap();
    // Lấy thông tin từ Viettel Post API
    // Hiển thị timeline chi tiết
    // Thông tin khách hàng được ẩn một phần
  } catch (err) {
    console.error("Error tracking shipping:", err);
  }
};
```

## Trạng Thái Vận Chuyển

### Status Flow

1. **pending**: Chờ xử lý - Đơn hàng được tạo, chờ Viettel Post nhận hàng
2. **picked_up**: Đã nhận hàng - Viettel Post đã nhận hàng từ người gửi
3. **in_transit**: Đang vận chuyển - Hàng đang được vận chuyển
4. **out_for_delivery**: Đang giao hàng - Hàng đang được giao đến khách hàng
5. **delivered**: Đã giao hàng - Giao hàng thành công
6. **failed**: Giao thất bại - Không thể giao hàng, cần giao lại

### Status Configuration

```javascript
const statusConfig = {
  pending: {
    icon: ClockIcon,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100",
    label: "Chờ xử lý",
  },
  // ... other statuses
};
```

## Mock Data vs Real API

### Hiện Tại (Mock Data)

- Dữ liệu fake được hardcode trong shippingSlice.js
- Simulate API delay với setTimeout
- Fake tracking codes: VP2025061401, VP2025061402, etc.

### Tương Lai (Real API)

```javascript
// Thay thế mock functions bằng real API calls
export const fetchShippingOrders = createAsyncThunk(
  "shipping/fetchOrders",
  async (filters) => {
    const response = await fetch("/api/shipping/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(filters),
    });
    return response.json();
  }
);

export const createShippingOrder = createAsyncThunk(
  "shipping/createOrder",
  async (orderData) => {
    // Call Viettel Post API
    const viettelResponse = await fetch("/api/viettel-post/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });

    const viettelData = await viettelResponse.json();

    // Save to our database
    const dbResponse = await fetch("/api/shipping/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...orderData,
        viettelPostCode: viettelData.tracking_code,
      }),
    });

    return dbResponse.json();
  }
);
```

## Navigation & Routes

### Admin Routes

- `/admin/shipping` - Trang quản lý vận chuyển
- Menu trong Sidebar với badge hiển thị số lượng đơn hàng

### Public Routes

- `/tracking` - Trang tra cứu công khai
- Link trong Header chính

## UI/UX Features

### Admin Dashboard

- Statistics cards: Tổng đơn hàng, Chờ xử lý, Đang vận chuyển, Đã giao hàng
- Filter và search: Tìm theo tên, SĐT, mã vận chuyển, trạng thái
- Action buttons: Xem chi tiết, Copy mã, Cập nhật trạng thái
- Pagination cho danh sách lớn

### Public Tracking

- Clean, user-friendly interface
- Search box để nhập mã vận đơn
- Timeline hiển thị lịch sử vận chuyển
- Responsive design cho mobile

### Modals

- Create Modal: Chọn đơn hàng, nhập thông tin vận chuyển
- Detail Modal: Hiển thị đầy đủ thông tin, copy functions, print option
- Update Modal: Cập nhật trạng thái và vị trí hiện tại

## Integration Points

### Với Order Management

- Chọn từ danh sách orders chưa có shipping
- Tự động sync thông tin khách hàng và sản phẩm
- Cập nhật trạng thái order khi shipping hoàn thành

### Với Notification System

- Gửi notification khi tạo đơn vận chuyển
- Cập nhật realtime khi trạng thái thay đổi
- Email/SMS notification cho khách hàng (future)

### Với Customer Interface

- Public tracking không cần đăng nhập
- Khách hàng có thể bookmark link tracking
- Share tracking link qua social media

## Performance Considerations

### Redux Optimization

- Normalize shipping data structure
- Implement proper caching
- Use RTK Query for better caching (future upgrade)

### API Optimization

- Implement pagination for large datasets
- Use debounced search to avoid excessive API calls
- Cache frequently accessed tracking data

## Future Enhancements

### Advanced Features

1. **Push Notifications**: Realtime notifications khi trạng thái thay đổi
2. **Analytics Dashboard**: Báo cáo hiệu suất vận chuyển
3. **Multiple Shipping Providers**: Tích hợp thêm Giao Hàng Nhanh, J&T, etc.
4. **Auto Status Updates**: Webhook từ Viettel Post để tự động cập nhật
5. **Shipping Labels**: In tem vận chuyển trực tiếp
6. **Bulk Operations**: Xử lý hàng loạt đơn hàng
7. **Cost Optimization**: So sánh giá các nhà vận chuyển
8. **Delivery Scheduling**: Lên lịch giao hàng theo yêu cầu

### Technical Improvements

1. **WebSocket**: Realtime tracking updates
2. **Service Worker**: Offline tracking capability
3. **QR Code**: Scan QR để tracking nhanh
4. **Map Integration**: Hiển thị vị trí trên bản đồ
5. **Export Functions**: Xuất báo cáo Excel/PDF

## Testing

### Mock Data cho Development

- Đa dạng trạng thái để test UI
- Edge cases: failed delivery, long addresses, etc.
- Performance testing với large datasets

### Integration Testing

- Test tạo đơn vận chuyển end-to-end
- Test tracking flow từ public interface
- Test error handling khi API fails

## Deployment Notes

### Environment Variables

```
VIETTEL_POST_API_URL=https://api.viettelpost.vn
VIETTEL_POST_API_KEY=your_api_key
VIETTEL_POST_SECRET=your_secret
```

### Database Schema

```sql
CREATE TABLE shipping_orders (
  id VARCHAR(50) PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL,
  viettel_post_code VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_address TEXT NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  tracking_history JSON
);
```

Hệ thống đã sẵn sàng để tích hợp với API thật và có thể mở rộng dễ dàng theo nhu cầu kinh doanh.
