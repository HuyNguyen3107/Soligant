# Logo Admin Guide

## Tổng quan

Logo trong khu vực admin chỉ hiển thị ở **Sidebar** và có thể click để quay về trang chủ.

## Logo trong Sidebar

### Vị trí và tính năng

- Logo được hiển thị ở đầu sidebar với text "SOLIGANT"
- Có thể click để chuyển về trang chủ (`/`)
- Có hiệu ứng hover với opacity
- Bên cạnh có text "ADMIN" để phân biệt

### Code implementation

```jsx
// Trong Sidebar.jsx
<Logo
  variant="text"
  size="md"
  color="white"
  to="/"
  className="hover:opacity-80 transition-opacity"
/>
```

## Logo Component

### Cách sử dụng

```jsx
import Logo from '../ui/Logo';

// Logo text đơn giản
<Logo />

// Logo với tùy chỉnh
<Logo
  variant="text"
  size="lg"
  color="white"
  to="/"
  className="hover:opacity-80"
/>
```

### Props

- `variant`: 'text' | 'image' | 'combined' (mặc định: 'text')
- `size`: 'sm' | 'md' | 'lg' (mặc định: 'md')
- `color`: 'primary' | 'white' | 'dark' (mặc định: 'primary')
- `to`: Đường dẫn khi click logo (mặc định: '/')
- `className`: CSS classes bổ sung
- `clickable`: Có thể click được không (mặc định: true)

### Variants

- **text**: Chỉ hiển thị text "SOLIGANT"
- **image**: Hiển thị hình ảnh logo (cần file `/logo.png`)
- **combined**: Hiển thị cả hình ảnh và text

## AdminHeader Component

### Cách sử dụng

```jsx
import AdminHeader from '../../components/admin/AdminHeader';

// Header đơn giản (không có logo)
<AdminHeader title="Dashboard" />

// Header với action buttons
<AdminHeader title="Quản lý sản phẩm">
  <button>Thêm mới</button>
  <button>Export</button>
</AdminHeader>
```

### Props

- `title`: Tiêu đề trang
- `children`: Các nút action hoặc controls khác
- ~~`showLogo`: Đã loại bỏ, logo chỉ hiển thị ở sidebar~~

## Nguyên tắc sử dụng

### ✅ Logo chỉ ở Sidebar

- Logo "SOLIGANT" được hiển thị cố định ở sidebar
- Có thể click để về trang chủ
- Không hiển thị ở bất kỳ AdminHeader nào khác

### ✅ AdminHeader cho các trang

- Tất cả trang admin sử dụng AdminHeader với `showLogo={false}` (hoặc bỏ prop này)
- Chỉ hiển thị title và action buttons
- Consistent design across admin pages
  <AdminHeader title="Quản lý sản phẩm" showLogo={true} />

// Không có logo (chỉ title)
<AdminHeader title="Chi tiết đơn hàng" showLogo={false} />

````

## Tùy chỉnh Logo

### Thay đổi logo hình ảnh

1. Thêm file logo vào thư mục `public/` (ví dụ: `logo.png`, `logo.svg`)
2. Sử dụng variant 'image' hoặc 'combined':

```jsx
<Logo variant="image" />
<Logo variant="combined" />
````

### Tùy chỉnh style

Bạn có thể override CSS classes:

```jsx
<Logo className="text-3xl font-black tracking-wider hover:scale-105 transition-transform" />
```

### Thay đổi màu sắc

Thêm màu mới trong `Logo.jsx`:

```jsx
const colorClasses = {
  primary: "text-soligant-primary",
  white: "text-white",
  dark: "text-gray-900",
  gold: "text-yellow-500", // Màu mới
};
```

## Ví dụ thực tế

### Dashboard

```jsx
const AdminDashboard = () => {
  return (
    <div className="flex-1">
      <AdminHeader title="Dashboard">
        <div className="flex items-center space-x-4">
          <LiveIndicator />
          <LastUpdateTime />
          <ToggleButton />
        </div>
      </AdminHeader>

      {/* Nội dung dashboard */}
    </div>
  );
};
```

### Trang quản lý với action buttons

```jsx
const ProductManagement = () => {
  return (
    <div>
      <AdminHeader title="Quản lý sản phẩm">
        <div className="flex space-x-2">
          <button>Import</button>
          <button>Export</button>
          <Link to="/admin/products/new">+ Thêm mới</Link>
        </div>
      </AdminHeader>

      {/* Bảng sản phẩm */}
    </div>
  );
};
```

## Lưu ý

1. **Logo chỉ ở Sidebar**: Logo chỉ hiển thị ở sidebar và có thể click về trang chủ
2. **AdminHeader không có logo**: Tất cả AdminHeader trong các trang đều không hiển thị logo
3. **Responsive**: Logo tự động điều chỉnh kích thước trên mobile
4. **Accessibility**: Có title tooltip và proper link attributes
5. **Consistent UI**: Giao diện nhất quán với logo chỉ ở sidebar

## Các file đã được cập nhật

- `src/components/ui/Logo.jsx` - Logo component
- `src/components/admin/AdminHeader.jsx` - AdminHeader component
- `src/components/admin/Sidebar.jsx` - Sidebar với logo
- `src/pages/admin/AdminDashboard.jsx` - Sử dụng AdminHeader không có logo
- `src/pages/admin/ProductManagement.jsx` - Sử dụng AdminHeader với action buttons
