# Hệ Thống Quản Lý Đơn Hàng Được Assigned - Hướng Dẫn Chi Tiết

## 🎯 Tổng Quan

Hệ thống quản lý đơn hàng cho phép admin/nhân viên "nhận xử lý" đơn hàng từ thông báo và quản lý toàn bộ vòng đời của đơn hàng đó, từ liên hệ khách hàng đến hoàn thành và giao hàng.

## 📋 Tính Năng Chính

### 1. Nhận Xử Lý Đơn Hàng

- **Từ thông báo**: Click "Nhận đơn" trong notification center
- **Tự động assign**: Đơn hàng được gán cho user hiện tại
- **Navigate**: Tự động chuyển đến trang "Đơn hàng của tôi"
- **Timeline**: Ghi lại lịch sử "đã nhận xử lý"

### 2. Quản Lý Đơn Hàng Chi Tiết

- **Thông tin khách hàng**: Tên, SĐT (copy nhanh), email
- **Thông tin đơn hàng**: Sản phẩm, số lượng, tổng tiền, mã đơn
- **Tin nhắn mẫu**: Tự động generate, có thể copy và chỉnh sửa
- **Cập nhật trạng thái**: Workflow từ assigned → completed
- **Ghi chú**: Thêm note cho từng bước xử lý

### 3. Upload Files & Attachments

- **Ảnh Background**: Upload background đã chốt với khách hàng
- **Ảnh Demo**: Upload ảnh demo sản phẩm để khách hàng duyệt
- **Ảnh Sản phẩm hoàn thiện**: Upload ảnh cuối cùng trước giao hàng
- **Drag & Drop**: Kéo thả files dễ dàng
- **Preview & Delete**: Xem trước và xóa files

### 4. Workflow Quản Lý

- **Xác nhận thanh toán**: Khi khách hàng đã chuyển khoản
- **Chuyển giao đơn hàng**: Transfer cho admin/nhân viên khác
- **Timeline tracking**: Theo dõi toàn bộ lịch sử đơn hàng

## 🔄 Workflow Chi Tiết

### Bước 1: Nhận Đơn Hàng Mới

```
Thông báo đơn hàng mới → Click "Nhận đơn" → Auto navigate → Đơn hàng trong "My Orders"
```

### Bước 2: Liên Hệ Khách Hàng

```
Xem thông tin KH → Copy SĐT → Copy tin nhắn mẫu → Gửi Zalo/SMS → Add note "đã liên hệ"
```

### Bước 3: Xử Lý Đơn Hàng

```
Nhận yêu cầu → Upload ảnh background → Cập nhật trạng thái "processing" → Thông báo KH
```

### Bước 4: Demo & Duyệt

```
Hoàn thành demo → Upload ảnh demo → Gửi cho KH xem → Chờ feedback → Add note
```

### Bước 5: Xác Nhận Thanh Toán

```
KH chuyển khoản → Click "Xác nhận đã thanh toán" → Status: confirmed → Bắt đầu sản xuất
```

### Bước 6: Hoàn Thành & Giao Hàng

```
Upload ảnh sản phẩm cuối → Cập nhật "completed" → Thông báo giao hàng → Archive
```

## 🏗️ Cấu Trúc Dữ Liệu

### Order Object

```javascript
{
  id: "order-123456",
  code: "SO-1234",
  customer: {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0123456789",
    email: "customer@email.com"
  },
  productName: "Version 1 (Cơ bản)",
  quantity: 1,
  total: 245000,
  status: "assigned", // assigned, processing, waiting_payment, confirmed, completed, cancelled
  assignedTo: "user123",
  assignedBy: "Admin",
  assignedAt: "2025-06-13T10:30:00Z",

  // Files & Attachments
  attachments: {
    backgroundImages: [],
    demoImages: [],
    finalProductImages: []
  },

  // Notes & Communication
  notes: [
    {
      id: 1,
      content: "Đã liên hệ khách hàng qua Zalo",
      user: "Nhân viên A",
      timestamp: "2025-06-13T10:35:00Z"
    }
  ],

  // Timeline & History
  timeline: [
    {
      id: 1,
      action: "order_created",
      message: "Đơn hàng được tạo",
      user: "System",
      timestamp: "2025-06-13T10:30:00Z"
    },
    {
      id: 2,
      action: "order_assigned",
      message: "Đơn hàng được nhận xử lý bởi Nhân viên A",
      user: "Nhân viên A",
      timestamp: "2025-06-13T10:32:00Z"
    }
  ],

  // Payment Info
  paymentInfo: {
    method: "bank_transfer",
    amount: 245000,
    confirmedAt: "2025-06-13T14:00:00Z"
  },

  createdAt: "2025-06-13T10:30:00Z",
  updatedAt: "2025-06-13T10:32:00Z"
}
```

## 📱 Giao Diện Sử Dụng

### Trang "Đơn hàng của tôi" (/admin/my-orders)

#### Header Section

- **Title**: "Đơn hàng của tôi (X đơn)"
- **Filter**: Dropdown lọc theo trạng thái
- **Stats**: Hiển thị số lượng đơn hàng

#### Orders Grid

- **Card Layout**: Hiển thị dạng cards, responsive
- **Order Info**: Mã đơn, tên KH, trạng thái, giá, ngày tạo
- **Quick Actions**: "Xem chi tiết", Copy SĐT
- **Status Badge**: Màu sắc theo trạng thái

#### Order Detail Modal

```
┌─────────────────────────────────────────┐
│ Đơn hàng SO-1234 - Nguyễn Văn A    [X]  │
├─────────────────────────────────────────┤
│ [Chi tiết] [Timeline] [Files]           │
├─────────────────────────────────────────┤
│                                         │
│ 👤 Thông tin khách hàng                 │
│ ┌─────────────────────────────────────┐ │
│ │ Tên: Nguyễn Văn A                   │ │
│ │ SĐT: 0123456789 [Copy]              │ │
│ │ Email: customer@email.com           │ │
│ │ Mã đơn: SO-1234                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🛒 Thông tin đơn hàng                   │
│ ┌─────────────────────────────────────┐ │
│ │ Sản phẩm: Version 1 (Cơ bản)        │ │
│ │ Số lượng: 1                         │ │
│ │ Tổng tiền: 245,000₫                 │ │
│ │ Trạng thái: Đang xử lý              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 💬 Tin nhắn liên hệ [Copy tin nhắn]     │
│ ┌─────────────────────────────────────┐ │
│ │ Xin chào Nguyễn Văn A,              │ │
│ │ Cảm ơn bạn đã đặt hàng...           │ │
│ │ ...                                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ⚡ Cập nhật trạng thái                   │
│ ┌─────────────────────────────────────┐ │
│ │ Trạng thái: [Dropdown] Ghi chú: []  │ │
│ │ [Cập nhật] [Xác nhận TT] [Chuyển]   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 📝 Ghi chú                              │
│ ┌─────────────────────────────────────┐ │
│ │ • Đã liên hệ qua Zalo - Admin       │ │
│ │ • Khách hàng OK với design - Staff  │ │
│ │ [Thêm ghi chú...] [Thêm]            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

#### Timeline Tab

- **Vertical Timeline**: Hiển thị chronological
- **Action Icons**: Biểu tượng cho từng hành động
- **User & Time**: Người thực hiện và thời gian
- **Auto-generated**: Tự động ghi khi có thay đổi

#### Files Tab

```
┌─────────────────────────────────────────┐
│ 📎 Quản lý Files                        │
│                                         │
│ [Ảnh Background] [Ảnh Demo] [Sản phẩm]  │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │     📤 Drag & Drop Upload Zone      │ │
│ │   Kéo thả files vào đây hoặc       │ │
│ │        [chọn files]                 │ │
│ │   Đang upload cho: Ảnh Background   │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ 🖼️ Ảnh Background (2)                  │
│ ┌─────┐ ┌─────┐                       │
│ │ IMG │ │ IMG │                       │
│ │ [🗑] │ │ [🗑] │                       │
│ └─────┘ └─────┘                       │
│                                         │
│ 🖼️ Ảnh Demo (0)                        │
│ Chưa có ảnh demo nào                    │
│                                         │
│ 🖼️ Ảnh Sản phẩm (0)                    │
│ Chưa có ảnh sản phẩm nào                │
└─────────────────────────────────────────┘
```

## 🎨 Status & Colors

### Trạng Thái Đơn Hàng

- **assigned** (Đã nhận) - Blue
- **processing** (Đang xử lý) - Yellow
- **waiting_payment** (Chờ thanh toán) - Orange
- **confirmed** (Đã xác nhận) - Green
- **completed** (Hoàn thành) - Emerald
- **cancelled** (Đã hủy) - Red

### Timeline Actions

- **order_created** - 📋 System
- **order_assigned** - 👤 User
- **status_updated** - ⚡ User
- **note_added** - 📝 User
- **file_uploaded** - 📤 User
- **file_removed** - 🗑️ User
- **order_confirmed** - ✅ User
- **order_transferred** - 🔄 User

## 🚀 Tính Năng Nâng Cao

### Transfer Order

```
┌─────────────────────────────────────────┐
│ Chuyển giao đơn hàng                    │
├─────────────────────────────────────────┤
│ Chuyển cho: [Dropdown Users]            │
│ ┌─────────────────────────────────────┐ │
│ │ Admin Chính (Super Admin)           │ │
│ │ Quản lý A (Manager)                 │ │
│ │ Nhân viên B (Staff)                 │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Lý do chuyển giao:                      │
│ ┌─────────────────────────────────────┐ │
│ │ Khách hàng yêu cầu thay đổi lớn...  │ │
│ │                                     │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              [Hủy] [Chuyển giao]        │
└─────────────────────────────────────────┘
```

### Quick Actions

- **Copy SĐT**: 1 click copy số điện thoại
- **Copy Message**: 1 click copy tin nhắn hoàn chỉnh
- **Status Update**: Quick change status với dropdown
- **File Upload**: Drag & drop với preview

### Notifications & Feedback

- **Toast Messages**: Thông báo thành công/lỗi
- **Visual Feedback**: Loading states, hover effects
- **Badge Counter**: Số đơn hàng trong sidebar menu

## 🔧 Technical Implementation

### Redux State Structure

```javascript
// orderManagement slice
{
  orders: [], // All orders in system
  myAssignedOrders: [], // Orders assigned to current user
  orderDetails: {}, // Cached order details
  uploadProgress: {}, // File upload progress
  isLoading: false,
  error: null
}
```

### Key Actions

- `addNewOrder` - Add order from notification
- `assignOrder` - Assign order to user
- `transferOrder` - Transfer order to another user
- `updateOrderStatus` - Change order status
- `addOrderNote` - Add note to order
- `uploadAttachment` - Upload file
- `removeAttachment` - Remove file
- `confirmOrder` - Confirm payment

### File Upload Flow

```
User selects files → Validate file types → Create file objects →
Dispatch uploadAttachment → Update Redux state → Show in UI
```

## 💡 Best Practices

### Workflow Suggestions

1. **Luôn add note** khi thay đổi trạng thái
2. **Upload ảnh demo** trước khi yêu cầu thanh toán
3. **Xác nhận thanh toán** ngay khi nhận được chuyển khoản
4. **Chuyển giao có lý do** rõ ràng khi cần thiết
5. **Copy tin nhắn** và customize trước khi gửi

### UI/UX Guidelines

- **Responsive Design**: Mobile-friendly
- **Loading States**: Show progress for uploads
- **Error Handling**: Clear error messages
- **Keyboard Navigation**: Accessible
- **Touch-Friendly**: Large tap targets

## 🎯 Benefits

### Cho Admin/Nhân Viên

- **Ownership**: Rõ ràng ai xử lý đơn nào
- **Tracking**: Timeline đầy đủ, không bỏ sót
- **Efficiency**: Tools hỗ trợ liên hệ KH nhanh chóng
- **Collaboration**: Transfer orders khi cần
- **Organization**: Files được quản lý có hệ thống

### Cho Khách Hàng

- **Transparency**: Thấy được tiến độ xử lý
- **Communication**: Nhận tin nhắn chuyên nghiệp
- **Visual Updates**: Nhận ảnh demo/progress
- **Trust**: Quy trình minh bạch, đáng tin cậy

### Cho Hệ Thống

- **Scalability**: Dễ mở rộng thêm tính năng
- **Maintainability**: Code có cấu trúc rõ ràng
- **Analytics**: Dữ liệu để phân tích hiệu suất
- **Integration**: Dễ tích hợp với backend/API

---

_Hệ thống được thiết kế để tối ưu hóa quy trình xử lý đơn hàng, từ việc nhận đơn đến hoàn thành, đảm bảo không có đơn hàng nào bị bỏ sót và khách hàng luôn được cập nhật tiến độ._
