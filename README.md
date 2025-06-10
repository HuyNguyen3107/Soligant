# Dự Án Website Soligant - Nền Tảng Tùy Chỉnh Quà Tặng LEGO

**Ngày cập nhật:** 2025-06-10  
**Người cập nhật:** HuyNguyen3107  
**Deadline:** 20/06/2025 (Thứ Sáu)

## Mục Lục

1. [Tổng Quan Dự Án](#1-tổng-quan-dự-án)
2. [Mục Tiêu & Phạm Vi](#2-mục-tiêu--phạm-vi)
3. [Kiến Trúc Hệ Thống](#3-kiến-trúc-hệ-thống)
4. [Luồng Chức Năng Chi Tiết](#4-luồng-chức-năng-chi-tiết)
5. [Mô Hình Dữ Liệu](#5-mô-hình-dữ-liệu)
6. [Phân Phối Dữ Liệu](#6-phân-phối-dữ-liệu)
7. [Các Vấn Đề Đặc Biệt & Giải Pháp](#7-các-vấn-đề-đặc-biệt--giải-pháp)
8. [Kế Hoạch Triển Khai](#8-kế-hoạch-triển-khai)

---

## 1. Tổng Quan Dự Án

### 1.1 Giới Thiệu

Website Soligant là một nền tảng trực tuyến chuyên bán các sản phẩm quà tặng LEGO được cá nhân hóa, phát triển nhằm thay thế quy trình thủ công hiện tại. Dự án nhằm tạo ra một trải nghiệm liền mạch giúp người dùng dễ dàng tùy chỉnh sản phẩm LEGO theo sở thích, đồng thời cung cấp công cụ hiệu quả cho đội ngũ quản lý để xử lý đơn hàng và vận hành kinh doanh.

### 1.2 Đặc Điểm Nổi Bật

- **Tùy chỉnh sản phẩm trực quan**: Người dùng có thể tùy chỉnh nhân vật LEGO (quần áo, mặt, tóc, phụ kiện) và background theo nhiều chủ đề
- **Không yêu cầu đăng nhập**: Trải nghiệm đặt hàng dễ dàng không cần tài khoản
- **Quản lý đơn hàng toàn diện**: Admin/nhân viên có đầy đủ công cụ quản lý
- **Tích hợp API**: Liên kết với Google Drive, Google Sheets và Viettel Post
- **Quản lý kho hiệu quả**: Tự động cập nhật số lượng hàng tồn kho
- **Thiết kế mở rộng**: Dễ dàng thêm bộ sưu tập và sản phẩm mới

### 1.3 Quy Mô & Tải Lượng

- **Người dùng**: 5,000 người dùng trong 3 tháng đầu
- **Đồng thời**: 200-500 người dùng hoạt động cùng lúc
- **Độ trễ API**: <500ms cho tất cả các endpoint

---

## 2. Mục Tiêu & Phạm Vi

### 2.1 Mục Tiêu Chính

- Phát triển một nền tảng web toàn diện thay thế quy trình thủ công hiện tại
- Tự động hóa quá trình tùy chỉnh sản phẩm và đặt hàng
- Cải thiện trải nghiệm người dùng và hiệu quả quản lý
- Tối ưu hóa quy trình xử lý đơn hàng từ lúc tạo đến hoàn thành
- Hỗ trợ mở rộng sang các bộ sưu tập mới

### 2.2 Tech Stack

| Thành phần            | Công nghệ             | Mục đích                              |
| --------------------- | --------------------- | ------------------------------------- |
| **Frontend**          | ReactJS               | Giao diện người dùng                  |
| **Backend**           | ExpressJS + Sequelize | API và xử lý nghiệp vụ                |
| **Database chính**    | PostgreSQL            | Lưu trữ dữ liệu quan trọng và cố định |
| **Database tạm thời** | Google Sheets         | Lưu trữ đơn hàng chưa chốt            |
| **Storage**           | Google Drive          | Lưu trữ hình ảnh và thiết kế          |
| **Shipping**          | Viettel Post API      | Tạo đơn và theo dõi vận chuyển        |

### 2.3 Phạm Vi Dự Án

**Bao gồm:**

- Hệ thống tùy chỉnh sản phẩm LEGO và background
- Hệ thống quản lý đơn hàng (từ chờ demo đến hoàn thành)
- Dashboard quản lý cho admin/nhân viên
- Quản lý tồn kho và thống kê
- Tích hợp API Viettel Post cho đơn hàng và vận chuyển
- Hệ thống phân quyền cho nhân viên

**Không bao gồm:**

- Cổng thanh toán trực tuyến (sử dụng chuyển khoản thủ công)
- Chức năng chat trực tiếp với khách hàng (liên hệ qua mạng xã hội)
- Tích hợp tự động với Canva (chỉ lưu trữ thông tin để tạo thủ công)

---

## 3. Kiến Trúc Hệ Thống

### 3.1 Kiến Trúc Tổng Thể

```
                      ┌─────────────────┐
                      │   CLIENT SIDE   │
                      │    (ReactJS)    │
                      └────────┬────────┘
                               │
                               ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Google Drive  │◄───┤   SERVER SIDE   │───►│  Google Sheets  │
│    (Storage)    │    │   (ExpressJS)   │    │  (Temp Data)    │
└─────────────────┘    └────────┬────────┘    └─────────────────┘
                               │
                               ▼
                      ┌─────────────────┐    ┌─────────────────┐
                      │   PostgreSQL    │───►│  Viettel Post   │
                      │   (Database)    │    │      API        │
                      └─────────────────┘    └─────────────────┘
```

### 3.2 Môi Trường Triển Khai

- **Development**: Máy tính cục bộ
- **Production**: VPS

### 3.3 Chiến Lược Bảo Mật

- JWT cho authentication
- RBAC (Role-Based Access Control) cho phân quyền
- HTTPS cho bảo mật dữ liệu
- Rate limiting cho API endpoints
- Logging và monitoring cho hoạt động hệ thống

---

## 4. Luồng Chức Năng Chi Tiết

### 4.1 Luồng Chức Năng Người Dùng (Không đăng nhập)

#### 4.1.1 Tùy Chỉnh Sản Phẩm LEGO

1. **Chọn Bộ Sưu Tập (Collection)**:

   - Người dùng truy cập trang chủ và chọn một bộ sưu tập (hiện tại là "DEAR YOU")
   - Hiển thị các sản phẩm mẫu đã được tùy chỉnh để tham khảo

2. **Tùy Chỉnh Nhân Vật và Phụ Kiện**:

   - Chọn màu áo, màu quần cho mỗi nhân vật
   - Chọn outfit (Vintage, Cá tính, Pastel) (Outfit chỉ là hình ảnh mà admin up lên cho khách hàng tham khảo)
   - Chọn kiểu tóc, mặt, phụ kiện
   - Chọn thú cưng (tùy chọn)
   - Chọn phiên bản (Version 1: 245k với 1 LEGO hoặc Version 2: 250k với 2 LEGO)
   - Chọn combo trọn bộ, combo phụ kiện

3. **Chuyển Sang Tùy Chỉnh Background**:
   - Chọn một mẫu background từ danh sách có sẵn
   - Tùy chỉnh nội dung: tiêu đề, thời gian, tên, nội dung tùy theo loại background
   - Hệ thống lưu lại các tùy chỉnh của người dùng

#### 4.1.2 Gửi Đơn Hàng

1. **Nhập Thông Tin Cơ Bản**:

   - Nhập họ tên, liên kết Facebook, liên kết Instagram, số điện thoại
   - Chọn tùy chọn "gấp" nếu cần (hệ thống cũng có thể tự nhận biết)
   - Gửi đơn hàng

2. **Xử Lý Đơn Hàng**:
   - Hệ thống tạo đơn hàng với trạng thái "Chờ demo" trên Google Sheets
   - Kiểm tra số lượng sản phẩm trong kho
   - Nếu đủ hàng: giữ trạng thái "Chờ demo"
   - Nếu hết hàng: chuyển sang "Pending"
   - Hệ thống gửi thông báo cho admin/nhân viên

#### 4.1.3 Tìm Kiếm Đơn Hàng

1. **Tìm Đơn Chưa Chốt**:

   - Nhập tên hoặc số điện thoại
   - Hệ thống tìm kiếm trên Google Sheets và hiển thị thông tin
   - Hiển thị trạng thái và thông tin tùy chỉnh

2. **Tìm Đơn Đã Chốt**:
   - Nhập tên hoặc số điện thoại
   - Hệ thống tìm kiếm trong PostgreSQL
   - Hiển thị 3 ảnh: ảnh nền đã chốt, ảnh demo, ảnh sản phẩm hoàn thiện

#### 4.1.4 Chốt Đơn

1. **Nhập Thông Tin Chi Tiết**:

   - Tìm đơn hàng chưa chốt
   - Nhấn nút "Chốt đơn"
   - Nhập thêm thông tin chi tiết theo form:
     - Họ tên người nhận
     - Số điện thoại người nhận
     - Địa chỉ giao hàng
     - Hình thức nhận hàng
     - Thời gian nhận mong muốn
     - Người trả ship
     - Thông tin thú cưng
     - Nội dung thiệp
     - Màu khung tranh
     - Link QR code
     - Ghi chú hoặc lưu ý đặc biệt

2. **Hoàn Tất Chốt Đơn**:
   - Gửi thông tin và chốt đơn
   - Hệ thống chuyển đơn từ Google Sheets sang PostgreSQL
   - Cập nhật trạng thái thành "Chờ thanh toán"
   - Khóa chỉnh sửa đối với người dùng (admin/nhân viên vẫn có quyền)

#### 4.1.5 Sao Chép Đơn Hàng

- Người dùng có thể sao chép đơn đã tạo để tạo đơn mới tương tự
- Giữ nguyên phần lớn thông tin, cho phép điều chỉnh một số chi tiết

### 4.2 Luồng Chức Năng Admin/Nhân Viên (Đăng nhập)

#### 4.2.1 Đăng Nhập & Phân Quyền

- Admin/nhân viên đăng nhập bằng tài khoản được cấp
- Hiển thị dashboard theo quyền hạn

#### 4.2.2 Quản Lý Đơn Hàng

1. **Nhận Thông Báo Đơn Mới**:

   - Nhận thông báo khi có đơn hàng mới với trạng thái "Chờ demo"
   - Hệ thống tự động tạo tin nhắn mẫu cho liên hệ với khách

2. **Xử Lý Demo**:

   - Tiếp nhận đơn hàng
   - Tạo demo dựa trên yêu cầu của khách
   - Upload ảnh demo lên hệ thống
   - Liên hệ với khách qua Facebook/Instagram

3. **Cập Nhật Trạng Thái Đơn**:

   - Cập nhật các trạng thái: "Chờ demo" → "Chờ thanh toán" → "Đang xử lý" → "Đang vận chuyển" → "Hoàn thành"
   - Upload các ảnh liên quan: ảnh demo, ảnh nền chốt, ảnh sản phẩm hoàn thiện

4. **Quản Lý Vận Chuyển**:

   - Tạo đơn hàng Viettel Post với một nút bấm
   - Theo dõi trạng thái vận chuyển thông qua API (khách hàng cũng có thể theo dõi trạng thái vận chuyển cho API viettel post trả về)
   - Cập nhật thông tin vận chuyển cho khách hàng

5. **Chuyển Giao Đơn Hàng**:
   - Chuyển đơn hàng giữa các nhân viên
   - Ghi nhận lý do chuyển giao

#### 4.2.3 Quản Lý Bộ Sưu Tập & Sản Phẩm

1. **Thêm/Sửa/Xóa Bộ Sưu Tập**:

   - Tạo bộ sưu tập mới với tên, mô tả, hình ảnh
   - Liên kết bộ sưu tập với danh mục

2. **Quản Lý Sản Phẩm**:

   - Thêm sản phẩm mới vào bộ sưu tập
   - Cập nhật thông tin sản phẩm: tên, giá, hình ảnh, số lượng,...
   - Quản lý biến thể của sản phẩm

3. **Quản Lý Background**:
   - Thêm/sửa/xóa các mẫu background
   - Cập nhật hình ảnh và cấu trúc nội dung

#### 4.2.4 Quản Lý Kho

1. **Cập Nhật Số Lượng**:

   - Nhập số lượng sản phẩm mới vào kho
   - Theo dõi số lượng tồn kho và số lượng đã đặt trước
   - Nhận thông báo khi sản phẩm sắp hết

2. **Báo Cáo Kho**:
   - Xem báo cáo tồn kho theo thời gian thực
   - Xuất báo cáo dưới dạng Excel

#### 4.2.5 Quản Lý Nhân Viên & Thống Kê

1. **Quản Lý Nhân Viên (Admin)**:

   - Tạo tài khoản mới cho nhân viên
   - Phân quyền cho nhân viên
   - Vô hiệu hóa tài khoản nhân viên

2. **Thống Kê**:
   - Biểu đồ doanh thu theo thời gian
   - Thống kê số đơn hàng theo trạng thái
   - Hiệu suất của từng nhân viên
   - Xuất báo cáo dưới dạng Excel

---

## 5. Mô Hình Dữ Liệu

### 5.1 Mô Hình Quan Hệ

```
users (1) ─────┬──────────► user_roles (n) ◄───────── (1) roles
                │                                       │
                │                                       │
                │                                       ▼
                │                                 role_permissions (n) ◄───── (1) permissions
                │
                │
                ▼
      orders (n) ────────────────┬───────────────────────┬─────────────────────┬────────────────────┐
                                 │                       │                     │                    │
                                 ▼                       ▼                     ▼                    ▼
                          order_items (n) ───► order_item_variants  order_customizations    order_images

categories (1) ───► collections (n) ───► products (n) ───┬───► product_variants
                                                         │
                                                         └───► inventory
```

### 5.2 Danh Sách Bảng Chi Tiết

#### 5.2.1 User Management & RBAC

- **users**: Thông tin người dùng hệ thống (admin/nhân viên)
- **roles**: Vai trò (admin, manager, employee)
- **permissions**: Quyền hạn cụ thể
- **user_roles**: Liên kết người dùng với vai trò
- **role_permissions**: Liên kết vai trò với quyền hạn
- **refresh_tokens**: JWT refresh tokens
- **password_resets**: Tokens đặt lại mật khẩu

#### 5.2.2 Product Management

- **categories**: Danh mục sản phẩm (Sinh nhật, Kỷ niệm, v.v.)
- **collections**: Bộ sưu tập (như "DEAR YOU")
- **products**: Thông tin sản phẩm (tóc, quần áo, phụ kiện, background)
- **product_variants**: Biến thể của sản phẩm (màu sắc, kích thước, v.v.)
- **product_images**: Hình ảnh sản phẩm và biến thể
- **inventory**: Số lượng tồn kho của sản phẩm và biến thể

#### 5.2.3 Order Management

- **orders**: Thông tin đơn hàng chính, bao gồm:

  - Thông tin người đặt: tên, số điện thoại, liên kết FB/IG
  - Thông tin người nhận: tên, số điện thoại, địa chỉ
  - Thông tin vận chuyển: phương thức, thời gian, người trả phí
  - Thông tin đơn hàng: trạng thái, tổng tiền, nhân viên xử lý
  - Thông tin bổ sung: thú cưng, nội dung thiệp, lưu ý đặc biệt

- **order_items**: Chi tiết từng sản phẩm trong đơn hàng
- **order_item_variants**: Biến thể đã chọn cho từng sản phẩm
- **order_customizations**: Tùy chỉnh chi tiết (nội dung background, v.v.)
- **order_images**: Hình ảnh liên quan đến đơn hàng (demo, ảnh nền, sản phẩm hoàn thiện)
- **order_designs**: Thông tin thiết kế cho đơn hàng

#### 5.2.4 Shipping Management

- **shipping_orders**: Thông tin vận chuyển, liên kết với Viettel Post API

#### 5.2.5 Analytics & System

- **employee_statistics**: Thống kê hiệu suất nhân viên
- **system_configurations**: Cấu hình hệ thống
- **audit_logs**: Nhật ký hoạt động hệ thống

### 5.3 Schema Database Chi Tiết

```sql
// Soligant Optimized Database Schema
// Chỉ giữ các trường thực sự cần thiết, đã bổ sung các trường mới cho đơn hàng

// ========== USER MANAGEMENT & RBAC (SIMPLIFIED) ==========

Table users {
id uuid [primary key, default: `gen_random_uuid()`]
email varchar(255) [unique, not null]
password_hash varchar(255) [not null]
full_name varchar(255) [not null]
phone varchar(20) [unique]
is_active boolean [default: true]
created_at timestamp [default: `now()`]
updated_at timestamp [default: `now()`]

indexes {
email [unique]
phone [unique]
}
}

Table roles {
id uuid [primary key, default: `gen_random_uuid()`]
name varchar(50) [unique, not null]
created_at timestamp [default: `now()`]

indexes {
name [unique]
}
}

// ... [Các bảng khác được giữ nguyên theo mô hình đã cung cấp]
```

---

## 6. Phân Phối Dữ Liệu

### 6.1 PostgreSQL (Dữ liệu quan trọng và cố định)

- Thông tin đăng nhập của admin/nhân viên
- Danh mục, bộ sưu tập, sản phẩm
- Đơn hàng đã chốt
- Thông tin tồn kho
- Thống kê nhân viên
- Cấu hình hệ thống

### 6.2 Google Sheets (Dữ liệu tạm thời)

- Đơn hàng chưa chốt (trạng thái "Chờ demo" hoặc "Pending")
- Tin nhắn mẫu

### 6.3 Google Drive (Lưu trữ ảnh)

- Ảnh sản phẩm và biến thể
- Ảnh demo đơn hàng
- Ảnh thiết kế background
- Ảnh sản phẩm hoàn thiện

---

## 7. Các Vấn Đề Đặc Biệt & Giải Pháp

### 7.1 Xử Lý Đơn Hàng Đồng Thời & Quản Lý Kho

**Vấn đề:** Khi 100 người dùng cùng tạo đơn hàng nhưng kho chỉ đủ cho 50 đơn

**Giải pháp:**

1. Tạo bản sao số lượng sản phẩm trong bộ nhớ tạm
2. Mỗi khi có đơn hàng mới, trừ số lượng trong bản sao
3. Khi số lượng bản sao về 0, không cho phép tạo đơn mới
4. Khi đơn được chốt, cập nhật số lượng thực trong cơ sở dữ liệu
5. Nếu đơn không được chốt, khôi phục số lượng trong bản sao
6. Làm mới bản sao theo định kỳ để đồng bộ với dữ liệu thực

### 7.2 Quản Lý Đơn Hàng Pending

**Vấn đề:** Xử lý các đơn hàng không thể tạo do hết hàng

**Giải pháp:**

1. Tạo trạng thái "Pending" cho đơn hàng không thể thực hiện ngay
2. Lưu trữ đơn "Pending" trên Google Sheets
3. Thông báo cho người dùng về trạng thái đơn hàng
4. Khi có hàng trở lại, admin/nhân viên có thể kích hoạt lại đơn "Pending"
5. Hệ thống liên hệ với khách hàng để xác nhận nhu cầu
6. Nếu cả hai bên đồng ý, chuyển đơn sang trạng thái "Chờ demo"

### 7.3 Xử Lý Dữ Liệu Trùng Lặp

**Vấn đề:** Tránh trùng lặp dữ liệu giữa các Google Sheets

**Giải pháp:**

1. Phân tách dữ liệu rõ ràng giữa các sheets:
   - Sheet 1: Đơn chờ demo (thông tin cơ bản: tên, SDT, FB, IG, tùy chỉnh sản phẩm)
   - Sheet 2: Đơn đã chốt (thông tin đầy đủ giao hàng)
2. Sử dụng ID đơn hàng duy nhất để liên kết giữa các sheets
3. Khi đơn chuyển từ "chờ demo" sang "đã chốt", sao chép thông tin cơ bản từ Sheet 1 sang Sheet 2 và bổ sung thông tin chi tiết mới
4. Đánh dấu đơn trong Sheet 1 là "đã chốt" để tránh xử lý trùng lặp

### 7.4 Đồng Bộ Dữ Liệu

**Vấn đề:** Đảm bảo dữ liệu nhất quán giữa PostgreSQL và Google Sheets/Drive

**Giải pháp:**

1. Thiết lập các jobs định kỳ để đồng bộ dữ liệu
2. Sử dụng transaction khi thao tác với nhiều nguồn dữ liệu
3. Thực hiện validation dữ liệu khi chuyển đổi giữa các nguồn
4. Lưu log đồng bộ để theo dõi và khắc phục sự cố

### 7.5 Xử Lý Đơn Hàng Gấp

**Vấn đề:** Nhận diện và ưu tiên đơn hàng gấp

**Giải pháp:**

1. Cho phép người dùng đánh dấu đơn "gấp" khi tạo đơn
2. Hệ thống tự động nhận diện đơn gấp dựa trên:
   - Thời gian giao hàng yêu cầu
   - Khoảng cách địa lý đến địa chỉ giao hàng
   - Mức độ phức tạp của sản phẩm
3. Hiển thị đơn gấp nổi bật trong dashboard admin/nhân viên
4. Tự động thông báo cho admin về đơn hàng gấp mới
5. Tạo báo cáo đơn hàng gấp hàng ngày

### 7.6 Xử Lý Tự Động Xóa Đơn Hàng

**Vấn đề:** Tự động xóa đơn chưa chốt sau 14 ngày

**Giải pháp:**

1. Tạo cron job chạy hàng ngày
2. Kiểm tra các đơn hàng chưa chốt trên Google Sheets
3. Xóa các đơn đã tạo quá 14 ngày
4. Khôi phục số lượng dự trữ trong kho (nếu có)
5. Lưu log hoạt động xóa đơn để kiểm tra nếu cần

---

## 8. Kế Hoạch Triển Khai

### 8.1 Lịch Trình Chung

| Giai đoạn                | Thời gian  | Hoạt động chính                                 |
| ------------------------ | ---------- | ----------------------------------------------- |
| **Phân tích & Thiết kế** | Tuần 1-2   | Phân tích yêu cầu, thiết kế database, API specs |
| **Phát triển**           | Tuần 3-8   | Phát triển frontend và backend                  |
| **Kiểm thử**             | Tuần 9-10  | QA và sửa lỗi                                   |
| **UAT & Training**       | Tuần 11    | Đào tạo người dùng, thử nghiệm thực tế          |
| **Go-live**              | 20/06/2025 | Ra mắt hệ thống                                 |

### 8.2 Kế Hoạch Đảm Bảo Chất Lượng

- Unit testing cho từng module
- Integration testing cho các luồng chính
- User testing với nhóm nhân viên thực tế
- Load testing với giả lập 500 người dùng đồng thời

### 8.3 Kế Hoạch Backup & Disaster Recovery

- Backup tự động hàng ngày cho PostgreSQL
- Sao lưu định kỳ dữ liệu Google Sheets và Google Drive
- Quy trình khôi phục dữ liệu được kiểm thử trước khi go-live

---

## Phụ Lục

### Phụ Lục A: Bảng Giá Sản Phẩm

- **Version 1**: 245,000 VND (01 LEGO)

  - Box quà sang trọng
  - Túi đựng xinh xắn
  - Thiệp viết tay
  - Khung tranh bền trong

- **Version 2**: 250,000 VND (02 LEGO)
  - Box quà sang trọng
  - Túi đựng xinh xắn
  - Thiệp viết tay
  - Khung tranh bền trong

_Lưu ý: Giá trên chưa bao gồm tóc và phụ kiện đi kèm._

### Phụ Lục B: Các Bước Order Thủ Công Hiện Tại

1. Xem menu + lựa chọn (không gửi nội dung nền)
2. Chụp màn hình lựa chọn gửi shop
3. Shop demo lego và gửi lại cho khách
4. Khách chốt demo + thanh toán 100%
5. Khách đăng ký Google Form thông tin nhận hàng và nội dung custom nền
6. Shop gửi demo nền + khách duyệt + in + làm đơn

### Phụ Lục C: Thời Gian Ship Đến Các Khu Vực

1. **Thời gian làm đơn**: 3-5 ngày để thiết kế và hoàn thiện sản phẩm
2. **Hình thức/Thời gian vận chuyển**:
   - **Tự đến lấy**: Phú Thượng - Tây Hồ - Hà Nội
   - **Bookship nội thành**: Giá tùy theo thời gian/địa chỉ ship
   - **Ship thường**:
     - Nội thành/Ngoại thành Hà Nội: ~18k
     - Ngoại tỉnh: 31k
   - **Ship nhanh**:
     - Nội thành/Ngoại thành Hà Nội: 18k
     - Ngoại tỉnh: 38k

_Lưu ý: Đây là giá ship trung bình, có thể thay đổi dựa trên số lượng khung đặt._

3. **Công thức đặt hàng để kịp nhận đúng ngày mong muốn**:

   - Thời gian shop làm (3-5 ngày) + Thời gian ship đến khu vực (2-5 ngày) + 2 ngày dự phòng = Thời gian cần đặt trước

   => Để đảm bảo đơn hàng đến đúng lúc, hãy đặt trước ít nhất 5-10 ngày tùy khu vực!

### Phụ Lục D: Chính Sách Hỗ Trợ & Bảo Hành

Soligant hiện chưa có chính sách bảo hành chính thức, tuy nhiên cam kết hỗ trợ tối đa cho khách hàng.

**Nếu sản phẩm gặp sự cố**:

1. **Phương án 1: Hoàn tiền 70% giá trị sản phẩm**

   - Khách hoàn trả lại toàn bộ sản phẩm lỗi
   - Báo sớm để tránh phát sinh thêm phí ship
   - Hỗ trợ đồng kiểm khi nhận hàng và miễn phí ship lại nếu đồng kiểm

2. **Phương án 2: Làm lại box quà mới 100%**
   - Khách cần hoàn trả lại hàng lỗi
   - Shop và khách chia đôi 50% phí ship

**Lưu ý:**

- Chính sách hỗ trợ chỉ áp dụng trong vòng 24 giờ sau khi nhận hàng
- Không áp dụng với các lỗi phát sinh do khách hàng làm rơi vỡ hoặc sử dụng không đúng cách
