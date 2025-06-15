# NotificationBadge Component - Hướng Dẫn Sử Dụng

## Tổng Quan

`NotificationBadge` là một component React hiển thị badge thông báo với khả năng tự động điều chỉnh kích thước dựa trên số lượng thông báo. Component này giúp tối ưu hóa việc hiển thị số lượng lớn thông báo một cách dễ nhìn và chuyên nghiệp.

## Tính Năng Chính

### 🎯 Tự Động Điều Chỉnh Kích Thước

- **1-9**: Badge tròn nhỏ (20x20px)
- **10-99**: Badge hình chữ nhật nhỏ (20x24px)
- **100-999**: Badge hình chữ nhật vừa (24x28px)
- **1000+**: Badge hình chữ nhật lớn (24x32px)

### 🎨 Hỗ Trợ Nhiều Variant

- `danger` (đỏ) - Mặc định cho thông báo quan trọng
- `primary` (xanh dương) - Thông báo thông thường
- `success` (xanh lá) - Thông báo tích cực
- `warning` (vàng) - Thông báo cảnh báo

### 📍 Flexible Positioning

- `top-right` - Góc trên bên phải (mặc định)
- `top-left` - Góc trên bên trái
- `inline` - Nằm trong dòng text

### ⚡ Smart Number Display

- Hiển thị số chính xác (1-99)
- Rút gọn thành "99+" (100-999)
- Rút gọn thành "999+" (1000+)
- Có thể tùy chỉnh maxCount

## Cách Sử Dụng

### Import Component

```jsx
import NotificationBadge from "../ui/NotificationBadge";
```

### Sử Dụng Cơ Bản

```jsx
// Badge thông báo cơ bản
<NotificationBadge count={5} />

// Badge không có animation
<NotificationBadge count={23} animate={false} />

// Badge với variant khác
<NotificationBadge count={100} variant="primary" />
```

### Trong Notification Bell

```jsx
<button className="relative p-2">
  <BellIcon className="h-6 w-6" />
  <NotificationBadge count={unreadCount} />
</button>
```

### Trong Sidebar Menu

```jsx
<Link className="flex items-center justify-between">
  <span>Đơn hàng</span>
  <NotificationBadge
    count={orderCount}
    position="inline"
    animate={false}
    variant="primary"
  />
</Link>
```

## Props API

| Prop        | Type    | Default     | Description                   |
| ----------- | ------- | ----------- | ----------------------------- |
| `count`     | number  | -           | Số lượng thông báo (bắt buộc) |
| `className` | string  | ''          | CSS classes tùy chỉnh         |
| `animate`   | boolean | true        | Bật/tắt animation pulse       |
| `position`  | string  | 'top-right' | Vị trí badge                  |
| `variant`   | string  | 'danger'    | Kiểu màu sắc                  |
| `maxCount`  | number  | 999         | Số tối đa hiển thị            |

### Position Values

- `'top-right'` - Absolute positioned ở góc trên phải
- `'top-left'` - Absolute positioned ở góc trên trái
- `'inline'` - Inline với nội dung

### Variant Values

- `'danger'` - Màu đỏ (bg-red-500)
- `'primary'` - Màu xanh dương (bg-blue-500)
- `'success'` - Màu xanh lá (bg-green-500)
- `'warning'` - Màu vàng (bg-yellow-500)

## Ví Dụ Thực Tế

### 1. Notification Bell với Animation

```jsx
const NotificationBell = () => {
  const unreadCount = useSelector(selectUnreadCount);

  return (
    <button className="relative p-2">
      <BellIcon className="h-6 w-6" />
      <NotificationBadge count={unreadCount} animate={true} variant="danger" />
    </button>
  );
};
```

### 2. Sidebar Menu Item

```jsx
const SidebarItem = ({ title, count, icon }) => {
  return (
    <Link className="flex items-center justify-between p-3">
      <div className="flex items-center space-x-3">
        {icon}
        <span>{title}</span>
      </div>
      <NotificationBadge
        count={count}
        position="inline"
        animate={false}
        variant="primary"
      />
    </Link>
  );
};
```

### 3. Dashboard Stats Card

```jsx
const StatsCard = ({ title, count, type }) => {
  const variant = type === "urgent" ? "danger" : "primary";

  return (
    <div className="bg-white p-4 rounded-lg relative">
      <h3>{title}</h3>
      <NotificationBadge
        count={count}
        position="top-right"
        variant={variant}
        maxCount={9999}
      />
    </div>
  );
};
```

## Responsive Design

Component tự động responsive và hoạt động tốt trên:

- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 768px)

## Accessibility

- Tự động thêm `title` attribute với thông tin số lượng
- Hỗ trợ screen readers
- High contrast colors
- Keyboard navigation friendly

## Performance

- Lightweight (~2KB gzipped)
- Không render khi count = 0
- Optimized re-rendering
- CSS-in-JS với Tailwind classes

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Migration Guide

### Từ Badge Cũ

```jsx
// Cũ
<span className="bg-red-500 text-white text-xs rounded-full h-5 w-5">
  {count > 99 ? '99+' : count}
</span>

// Mới
<NotificationBadge count={count} />
```

### Từ Custom Badge

```jsx
// Cũ
{
  count > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
      {count}
    </span>
  );
}

// Mới
<NotificationBadge count={count} />;
```

## Troubleshooting

### Badge Không Hiển Thị

1. Kiểm tra container có `position: relative`
2. Đảm bảo `count > 0`
3. Kiểm tra z-index conflicts

### Badge Bị Cắt

1. Thêm padding cho container
2. Kiểm tra overflow settings
3. Điều chỉnh position values

### Animation Không Hoạt Động

1. Đảm bảo `animate={true}`
2. Kiểm tra CSS animations enabled
3. Browser có hỗ trợ CSS animations

---

**Lưu ý**: Component này được thiết kế để thay thế tất cả các badge notification cũ trong hệ thống, đảm bảo tính nhất quán và dễ bảo trì.
