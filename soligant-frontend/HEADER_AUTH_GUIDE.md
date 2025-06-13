# Header Authentication Guide

## Tổng quan

Header của trang chủ đã được cập nhật để hiển thị thông tin người dùng khi admin/nhân viên đã đăng nhập, thay vì hiển thị link "Đăng nhập".

## Tính năng

### Khi chưa đăng nhập

- Hiển thị link "Đăng nhập" dẫn đến `/admin/login`
- Menu bình thường với các link: Trang chủ, Bộ sưu tập, Tìm đơn hàng

### Khi đã đăng nhập

- Hiển thị thông tin người dùng với icon user
- Dropdown menu với các tùy chọn:
  - Thông tin người dùng (username, email)
  - "Trang quản trị" - dẫn đến `/admin/dashboard`
  - "Đăng xuất" - logout và quay về trạng thái chưa đăng nhập

## User Interface

### Desktop

```
[SOLIGANT] [Trang chủ] [Bộ sưu tập] [Tìm đơn hàng] [👤 Admin ▼]
```

Khi click vào user info:

```
                                                    ┌─────────────────┐
                                                    │ Admin           │
                                                    │ admin@soligant  │
                                                    ├─────────────────┤
                                                    │ 🔧 Trang quản trị│
                                                    │ 🚪 Đăng xuất    │
                                                    └─────────────────┘
```

### Mobile

Menu hamburger với section riêng cho auth:

```
[Trang chủ]
[Bộ sưu tập]
[Tìm đơn hàng]
─────────────────
👤 Admin
🔧 Trang quản trị
🚪 Đăng xuất
```

## Luồng hoạt động

1. **Khi vào trang chủ**: AuthInitializer check auth state từ Redux
2. **Nếu có token**: Hiển thị user menu với thông tin từ Redux state
3. **Click "Trang quản trị"**: Chuyển đến `/admin/dashboard`
4. **Click "Đăng xuất"**: Dispatch logout action, clear auth state
5. **Sau logout**: Header quay về trạng thái chưa đăng nhập

## Implementation Details

### Redux State

```javascript
// Auth state structure
{
  user: {
    id: 1,
    username: "admin",
    email: "admin@soligant.com",
    role: "admin"
  },
  isAuthenticated: true,
  loading: false,
  authChecked: true
}
```

### Header Component Changes

- Import Redux hooks: `useSelector`, `useDispatch`
- Import auth action: `logout`
- Import icons: `FaUser`, `FaCog`, `FaSignOutAlt`
- Thêm state cho user menu: `userMenuOpen`
- Thêm click outside handler với `useRef`

### Responsive Design

- Desktop: Dropdown menu với absolute positioning
- Mobile: Inline menu items trong mobile menu
- Icons sử dụng React Icons (fa-user, fa-cog, fa-sign-out-alt)

## User Experience

### Smooth Transitions

- Hover effects trên menu items
- Smooth dropdown animation với CSS transitions
- Icon rotation cho dropdown arrow

### Accessibility

- Focus outline cho keyboard navigation
- Proper ARIA labels
- Click outside để đóng dropdown
- ESC key support (có thể thêm)

### Visual Feedback

- Hover states cho tất cả interactive elements
- Active states cho current page
- Loading states trong auth transitions

## Testing Scenarios

### Scenario 1: Chưa đăng nhập

1. Vào trang chủ
2. Thấy link "Đăng nhập" ở header
3. Click vào dẫn đến `/admin/login`

### Scenario 2: Đăng nhập thành công

1. Đăng nhập ở `/admin/login`
2. Quay về trang chủ
3. Thấy user info thay vì link đăng nhập
4. Click user menu thấy dropdown

### Scenario 3: Chuyển đến admin

1. Ở trang chủ khi đã đăng nhập
2. Click "Trang quản trị"
3. Chuyển đến `/admin/dashboard`
4. Sidebar vẫn có logo để quay về trang chủ

### Scenario 4: Đăng xuất

1. Ở trang chủ khi đã đăng nhập
2. Click "Đăng xuất"
3. User menu biến mất
4. Header quay về trạng thái chưa đăng nhập

## Files Modified

- `src/components/Header.jsx` - Main header component
- Import thêm Redux hooks và auth actions
- Thêm user menu state và handlers
- Responsive design cho desktop và mobile

## Future Enhancements

1. **User Profile Page**: Thêm link đến trang profile cá nhân
2. **Role-based Menu**: Hiển thị menu khác nhau cho admin vs nhân viên
3. **Notification Bell**: Thêm thông báo trong header
4. **Quick Actions**: Shortcuts đến các tính năng thường dùng
5. **Theme Toggle**: Dark/light mode toggle
