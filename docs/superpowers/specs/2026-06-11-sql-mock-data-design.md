# Spec: File SQL mock data cho database Sử Việt Anh Hùng

**Ngày:** 2026-06-11
**Trạng thái:** Chờ duyệt

## Mục tiêu

Tạo một file SQL duy nhất, tự chứa, để nạp dữ liệu mẫu (mock data) vào database MySQL của dự án, phục vụ môi trường dev/demo. Chạy một lệnh là toàn bộ ứng dụng (FE + BE) có dữ liệu đẹp ở mọi trang.

## Quyết định thiết kế (đã chốt với người dùng)

1. **Phạm vi:** Tất cả các bảng (16 bảng).
2. **Chế độ chạy:** Xóa sạch rồi insert lại — `SET FOREIGN_KEY_CHECKS = 0` → `TRUNCATE` toàn bộ bảng → `INSERT` với ID tường minh → bật lại FK checks. Không idempotent kiểu cộng dồn; chạy lại bao nhiêu lần DB cũng về đúng trạng thái mẫu.
3. **Lượng dữ liệu:** Vừa đủ demo (chi tiết bên dưới).
4. **Hình thức:** Một file duy nhất (phương án A), không tách nhiều file.

## Vị trí file

`BackEnd/src/seeds/mock_data.sql`

## Nguồn chân lý về schema

**Các model Sequelize trong `BackEnd/src/models/*.js`** là nguồn chân lý duy nhất về tên bảng và tên cột.

- File `database_diagram.dbml` ở gốc repo **đã lỗi thời** — ví dụ model `era.js` thực tế có `slug`, `start_year`, `end_year`, `cover_image`, `order`, `status` trong khi dbml ghi `period`, `year_start`, `year_end`, `cover_url`, `sort_order`, `is_active`. Khi triển khai phải đọc từng model để lấy đúng tên cột, enum và ràng buộc; không được chép từ dbml.
- File `seeds/seed.js` cũ cũng dùng tên cột lỗi thời (và viết bằng CommonJS trong khi models là ESM) — chỉ tái dùng **nội dung dữ liệu** (tên triều đại, mô tả, nhân vật) từ nó, không tái dùng tên cột.
- Config Sequelize đặt `underscored: true, timestamps: true` toàn cục → mọi bảng có `created_at`, `updated_at` (trừ model nào tắt riêng — phải kiểm tra từng model, ví dụ `refresh_tokens` và `page_views` thường chỉ có `created_at`).

## Cấu trúc file SQL

Theo thứ tự:

1. **Header comment:** mô tả file, cảnh báo xóa dữ liệu, hướng dẫn chạy (`mysql -u <user> -p <db_name> < BackEnd/src/seeds/mock_data.sql` hoặc mở bằng MySQL Workbench), và 3 tài khoản đăng nhập kèm mật khẩu plaintext.
2. `SET FOREIGN_KEY_CHECKS = 0;` và `SET NAMES utf8mb4;`
3. `TRUNCATE TABLE` cho cả 16 bảng (kể cả `refresh_tokens`).
4. Các khối `INSERT` theo thứ tự phụ thuộc: `users` → `site_config` → `eras` → `heroes` → `tags` → `articles` → `article_heroes` → `article_tags` → `videos` → `donation_tiers` → `donations` → `sponsor_tiers` → `sponsors` → `media` → `page_views`.
5. `SET FOREIGN_KEY_CHECKS = 1;`

Mỗi khối có comment tiêu đề. ID gán tường minh (users 1–3, eras 1–8, …) để các bảng nối tham chiếu chắc chắn đúng.

## Dữ liệu mẫu

Toàn bộ nội dung bằng tiếng Việt, dùng nhân vật và sự kiện lịch sử thật. Ảnh dùng `https://picsum.photos/seed/<slug>/<w>/<h>`. Ngày tháng là **giá trị tĩnh** rải trong khoảng 60 ngày trước 2026-06-11 (không dùng `NOW()` cho dữ liệu nội dung, để kết quả ổn định giữa các lần chạy).

| Bảng | Số lượng | Ghi chú |
|---|---|---|
| users | 3 | `admin`/`Admin@123456` (superadmin), `editor01`/`Editor@123456` (editor), `viewer01`/`Viewer@123456` (viewer) — giống seed.js cũ. Cột password chứa **hash bcrypt tính sẵn** (bcryptjs, 12 rounds) để đăng nhập được. |
| site_config | ~10 | Tên site, mô tả, email/điện thoại liên hệ, mạng xã hội, thông tin tài khoản nhận quyên góp — theo đúng enum `group`/`value_type` của model `siteConfig.js`. |
| eras | 8 | Hùng Vương → Bắc thuộc → Ngô–Đinh–Tiền Lê → Lý–Trần → Hậu Lê → Tây Sơn → Nguyễn → Hiện đại. Tái dùng mô tả từ seed.js, ánh xạ sang cột mới (`slug`, `start_year`, `end_year`, `status='published'`...). |
| heroes | ~18 | Nhân vật thật gắn đúng era: Hai Bà Trưng, Bà Triệu, Ngô Quyền, Đinh Bộ Lĩnh, Lê Hoàn, Lý Thái Tổ, Lý Thường Kiệt, Trần Hưng Đạo, Trần Nhân Tông, Lê Lợi, Nguyễn Trãi, Quang Trung, Hồ Chí Minh, Võ Nguyên Giáp... Vài hero nổi bật (featured) nếu model có cột tương ứng. |
| tags | ~10 | Khởi nghĩa, Kháng chiến, Vua chúa, Danh tướng, Văn hóa, Ngoại giao... |
| articles | ~16 | Đa số `published` (có `published_at`), 2 `draft`, 1 `archived`. Có excerpt + content HTML vài đoạn. `view_count` giá trị tĩnh đa dạng. Tác giả luân phiên admin/editor. |
| article_heroes | ~25 liên kết | Mỗi bài gắn 1–3 hero liên quan đúng chủ đề. |
| article_tags | ~35 liên kết | Mỗi bài 2–3 tag. |
| videos | ~8 | URL/embed YouTube mẫu, gắn hero/era phù hợp, đa số `published`. |
| donation_tiers | 4 | Đồng, Bạc, Vàng, Kim Cương — mốc tiền tăng dần, `perks` JSON. |
| donations | ~12 | Đủ trạng thái: confirmed (đa số, có `confirmed_by`/`confirmed_at`), pending, rejected; 2–3 bản ghi anonymous; `public_id` là UUID tĩnh. |
| sponsor_tiers | 3 | Kim Cương, Vàng, Bạc. |
| sponsors | ~6 | Tên đơn vị hư cấu rõ ràng (không dùng thương hiệu thật), logo picsum. |
| media | ~10 | Ảnh đại diện cho bài viết/hero đã dùng ở trên, `uploaded_by` admin/editor. |
| page_views | ~30 | Path thật của FE (`/`, `/heroes/<slug>`, `/articles/<slug>`...), rải đều 30 ngày gần nhất, `ip_hash` SHA-256 giả tĩnh. |
| refresh_tokens | 0 | Chỉ TRUNCATE, không insert — token là dữ liệu runtime. |

Số lượng trên là mức tối thiểu định hướng; khi triển khai phải khớp chính xác cột/enum theo model thực tế (ví dụ nếu model `hero.js` không có `is_featured` thì bỏ qua thuộc tính đó thay vì bịa cột).

## Cách tạo hash bcrypt

Khi triển khai, tính hash một lần bằng bcryptjs có sẵn trong `BackEnd/node_modules`:

```
node -e "const b=require('bcryptjs'); ['Admin@123456','Editor@123456','Viewer@123456'].forEach(p=>console.log(b.hashSync(p,12)))"
```

(chạy trong thư mục `BackEnd`). Dán 3 hash thu được vào khối INSERT users.

## Xử lý lỗi & ràng buộc

- FK checks tắt trong suốt quá trình truncate/insert nên thứ tự không gây lỗi, nhưng vẫn insert theo thứ tự phụ thuộc để file dễ đọc và mọi FK trỏ tới ID có thật.
- Chuỗi tiếng Việt: file lưu UTF-8 (không BOM), `SET NAMES utf8mb4` ở đầu. Escape dấu nháy đơn trong nội dung (`''`).
- Không có cơ chế rollback — file này chỉ dành cho dev/demo, header phải cảnh báo rõ "XÓA TOÀN BỘ DỮ LIỆU HIỆN CÓ".

## Kiểm chứng (definition of done)

1. Chạy file trên DB dev MySQL không lỗi (lần đầu và chạy lặp lại lần hai).
2. `SELECT COUNT(*)` từng bảng: không bảng nào trống (trừ `refresh_tokens` = 0), số lượng xấp xỉ bảng trong spec.
3. Đăng nhập API thành công bằng `admin` / `Admin@123456` (xác nhận hash bcrypt đúng).
4. Mở FE: trang chủ, danh sách era/hero/article hiển thị dữ liệu, không trang nào trống.

## Ngoài phạm vi

- Không sửa `seed.js` cũ, không sửa `database_diagram.dbml`.
- Không tạo migration/schema — file SQL giả định bảng đã tồn tại (do Sequelize sync/migration tạo).
- Không seed dữ liệu production.
