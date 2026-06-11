# SQL Mock Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tạo file `BackEnd/src/seeds/mock_data.sql` tự chứa, nạp dữ liệu mẫu tiếng Việt vào toàn bộ 16 bảng MySQL của dự án.

**Architecture:** Một file SQL duy nhất: tắt FK checks → TRUNCATE 16 bảng → INSERT theo thứ tự phụ thuộc với ID tường minh → bật lại FK checks. Schema lấy từ models Sequelize (KHÔNG dùng `database_diagram.dbml` — đã lỗi thời). File được xây từng khối, mỗi khối chạy thử trên DB dev rồi mới commit.

**Tech Stack:** MySQL 8, Sequelize (`underscored: true`), bcryptjs (hash tính sẵn, có trong plan).

**Spec:** `docs/superpowers/specs/2026-06-11-sql-mock-data-design.md`

---

## Bối cảnh quan trọng cho người thực hiện

**Điều kiện tiên quyết:** Bảng phải tồn tại trước khi chạy file SQL. BE tự tạo bảng qua `sequelize.sync({ alter: true })` khi khởi động (`BackEnd/src/server.js:21`). Nếu DB trống, chạy BE một lần: `cd BackEnd; npm run dev` rồi tắt.

**Thông tin kết nối DB:** đọc từ `BackEnd/.env` các biến `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`. Mọi lệnh `mysql` bên dưới viết dạng `<DB_USER>`, `<DB_NAME>`... — thay bằng giá trị thật từ `.env` khi chạy.

**Môi trường thực tế (đã xác minh 2026-06-11):** máy dev KHÔNG có mysql CLI trên PATH. MySQL chạy trong Docker container `suvietanhhung-mysql` (map cổng 3309→3306). Khởi động nếu chưa chạy: `docker start suvietanhhung-mysql` (cần Docker Desktop đang chạy). BE chạy ở cổng **8080** (biến `PORT` trong `.env`).

**Lệnh chạy file SQL** — mọi lệnh `mysql ...` trong các task bên dưới đều thay bằng dạng `docker exec` sau (PowerShell không hỗ trợ `<` redirect nên dùng `cmd /c` khi cần nạp file):

```powershell
# Nạp toàn bộ file SQL:
cmd /c "docker exec -i suvietanhhung-mysql mysql --default-character-set=utf8mb4 -u<DB_USER> -p<DB_PASSWORD> <DB_NAME> < BackEnd\src\seeds\mock_data.sql"

# Chạy query kiểm tra:
docker exec suvietanhhung-mysql mysql --default-character-set=utf8mb4 -u<DB_USER> -p<DB_PASSWORD> <DB_NAME> -e "<QUERY>"
```

**Encoding:** file phải lưu UTF-8 không BOM (tool Write mặc định đúng). Nội dung có dấu tiếng Việt — nếu thấy `?` trong DB là sai charset, kiểm tra lại flag `--default-character-set=utf8mb4`.

**Quy tắc SQL:**
- Cột `order` (bảng `eras`), `key` và `group` (bảng `site_config`) là từ khóa MySQL → luôn viết trong backtick: `` `order` ``, `` `key` ``, `` `group` ``.
- Escape dấu nháy đơn trong chuỗi bằng cách lặp đôi: `'Nguyễn Trãi viết ''Bình Ngô đại cáo'''`.
- Bảng `site_config` KHÔNG có `created_at`; `page_views` và `refresh_tokens` KHÔNG có `updated_at`; `article_heroes`/`article_tags` không có timestamps.
- Boolean ghi `1`/`0`.

**Schema chính xác từng bảng** (nguồn: `BackEnd/src/models/*.js` — đã đối chiếu):

| Bảng | Cột |
|---|---|
| users | id, username, email, password, role enum('superadmin','editor','viewer'), avatar_url, is_active, last_login, created_at, updated_at |
| refresh_tokens | id, user_id, token_hash, expires_at, ip_address, user_agent, is_revoked, created_at |
| site_config | id, `key`, value, value_type enum('type_string','type_number','type_boolean','type_json'), `group` enum('general','hero','contact','fundraising'), updated_by, updated_at |
| eras | id, name, slug, start_year, end_year, description, cover_image, `order`, status enum('published','draft'), created_by, updated_by, created_at, updated_at |
| heroes | id, era_id, name, birth_year, death_year, title, biography, avatar_url, cover_url, slug, is_featured, sort_order, is_active, created_by, updated_by, created_at, updated_at |
| tags | id, name, slug, created_by, updated_by, created_at, updated_at |
| articles | id, title, slug, image_url, excerpt, content, cover_url, status enum('draft','published','archived'), view_count, author_id, updated_by, published_at, created_at, updated_at |
| article_heroes | article_id, hero_id |
| article_tags | article_id, tag_id |
| videos | id, title, description, url, embed_url, platform enum('youtube','tiktok','facebook','other'), thumbnail_url, duration_sec, view_count, hero_id, era_id, status enum('draft','published','archived'), published_at, created_by, updated_by, created_at, updated_at |
| donation_tiers | id, name, amount_min, amount_max, perks (JSON), badge_url, color, sort_order, is_active, created_by, updated_by, created_at, updated_at |
| donations | id, public_id (UUID), tier_id, donor_name, donor_email, donor_phone, amount, message, is_anonymous, status enum('pending','confirmed','rejected'), payment_method enum('bank_transfer','qr','other'), payment_ref, confirmed_by, confirmed_at, show_on_board, created_at, updated_at |
| sponsor_tiers | id, name, sort_order, created_by, updated_by, created_at, updated_at |
| sponsors | id, tier_id, name, logo_url, website_url, description, is_active, sort_order, sponsored_at (DATE), expires_at (DATE), created_by, updated_by, created_at, updated_at |
| media | id, filename, original_name, url, mime_type, size_bytes, uploaded_by, updated_by, created_at, updated_at |
| page_views | id, path, referrer, user_agent, ip_hash, created_at |

---

### Task 1: Xác minh hash bcrypt của 3 tài khoản

3 hash dưới đây đã được tính sẵn bằng bcryptjs 12 rounds và sẽ dùng trong Task 3. Trước khi dùng, xác minh chúng khớp mật khẩu.

| Tài khoản | Mật khẩu | Hash |
|---|---|---|
| admin | Admin@123456 | `$2b$12$XddvlB7iP0gG2WO1SSLj..sKhpEEs6zMBR0enOL04y0nWVRyqOtTG` |
| editor01 | Editor@123456 | `$2b$12$0.UZYOBKVgFMHm4o.6CR8OdTiOngm.Fi9e0huC.QS9UTY.tOzL0RG` |
| viewer01 | Viewer@123456 | `$2b$12$ke2WF.WDTDJTJFEzjbezyO..4T0JL8fvNJmZb5/447EzyBZ03VkFC` |

- [ ] **Step 1: Chạy lệnh xác minh** (PowerShell, từ gốc repo)

Tạo file tạm `BackEnd/verify-hash.tmp.cjs` (PHẢI là `.cjs` — BackEnd có `"type": "module"`; và KHÔNG dùng `node -e` vì PowerShell 5.1 nuốt nháy kép lồng nhau hoặc nội suy `$2b$...`):

```js
const b = require('bcryptjs');
console.log(
  b.compareSync('Admin@123456', '$2b$12$XddvlB7iP0gG2WO1SSLj..sKhpEEs6zMBR0enOL04y0nWVRyqOtTG'),
  b.compareSync('Editor@123456', '$2b$12$0.UZYOBKVgFMHm4o.6CR8OdTiOngm.Fi9e0huC.QS9UTY.tOzL0RG'),
  b.compareSync('Viewer@123456', '$2b$12$ke2WF.WDTDJTJFEzjbezyO..4T0JL8fvNJmZb5/447EzyBZ03VkFC')
);
```

```powershell
Set-Location BackEnd; node verify-hash.tmp.cjs; if ($?) { Remove-Item verify-hash.tmp.cjs -Confirm:$false }; Set-Location ..
```

Expected: `true true true` (đã chạy đạt ngày 2026-06-11). Nếu ra `false`, tính lại hash tương tự qua file tạm `.cjs` dùng `b.hashSync('<mật khẩu>', 12)` và thay cả 3 hash trong khối INSERT users ở Task 3.

### Task 2: Tạo khung file mock_data.sql (header + TRUNCATE)

**Files:**
- Create: `BackEnd/src/seeds/mock_data.sql`

- [ ] **Step 1: Tạo file với nội dung sau**

```sql
-- ============================================================================
-- mock_data.sql — Dữ liệu mẫu cho Sử Việt Anh Hùng (môi trường dev/demo)
--
-- !! CẢNH BÁO: Script này XÓA TOÀN BỘ DỮ LIỆU trong 16 bảng trước khi nạp
-- dữ liệu mẫu. TUYỆT ĐỐI KHÔNG chạy trên production.
--
-- Điều kiện: các bảng đã tồn tại (chạy BE ít nhất 1 lần để Sequelize sync).
--
-- Cách chạy (PowerShell, từ gốc repo; thông tin kết nối xem BackEnd/.env):
--   mysql --default-character-set=utf8mb4 -h <host> -u <user> -p"<password>" <db_name> -e "source BackEnd/src/seeds/mock_data.sql"
-- hoặc mở file trong MySQL Workbench và Execute.
--
-- Tài khoản đăng nhập sau khi nạp:
--   admin    / Admin@123456   (superadmin)
--   editor01 / Editor@123456  (editor)
--   viewer01 / Viewer@123456  (viewer)
-- ============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ─── Xóa dữ liệu cũ ─────────────────────────────────────────────────────────
TRUNCATE TABLE refresh_tokens;
TRUNCATE TABLE page_views;
TRUNCATE TABLE media;
TRUNCATE TABLE article_tags;
TRUNCATE TABLE article_heroes;
TRUNCATE TABLE videos;
TRUNCATE TABLE articles;
TRUNCATE TABLE tags;
TRUNCATE TABLE heroes;
TRUNCATE TABLE eras;
TRUNCATE TABLE donations;
TRUNCATE TABLE donation_tiers;
TRUNCATE TABLE sponsors;
TRUNCATE TABLE sponsor_tiers;
TRUNCATE TABLE site_config;
TRUNCATE TABLE users;

SET FOREIGN_KEY_CHECKS = 1;
```

(Các Task sau sẽ chèn khối INSERT vào TRƯỚC dòng `SET FOREIGN_KEY_CHECKS = 1;` — dòng này luôn nằm cuối file.)

- [ ] **Step 2: Chạy thử trên DB dev**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
```

Expected: không có output lỗi (exit code 0). Nếu lỗi `Table ... doesn't exist`: chạy BE một lần để sync tạo bảng rồi thử lại.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): add mock_data.sql skeleton (truncate 16 tables)"
```

### Task 3: Khối users + site_config

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

```sql
-- ─── users ──────────────────────────────────────────────────────────────────
INSERT INTO users (id, username, email, password, role, avatar_url, is_active, last_login, created_at, updated_at) VALUES
(1, 'admin', 'admin@suvietanhhung.vn', '$2b$12$XddvlB7iP0gG2WO1SSLj..sKhpEEs6zMBR0enOL04y0nWVRyqOtTG', 'superadmin', 'https://picsum.photos/seed/admin/200/200', 1, '2026-06-10 08:30:00', '2026-04-10 08:00:00', '2026-06-10 08:30:00'),
(2, 'editor01', 'editor@suvietanhhung.vn', '$2b$12$0.UZYOBKVgFMHm4o.6CR8OdTiOngm.Fi9e0huC.QS9UTY.tOzL0RG', 'editor', 'https://picsum.photos/seed/editor01/200/200', 1, '2026-06-09 14:15:00', '2026-04-10 08:05:00', '2026-06-09 14:15:00'),
(3, 'viewer01', 'viewer@suvietanhhung.vn', '$2b$12$ke2WF.WDTDJTJFEzjbezyO..4T0JL8fvNJmZb5/447EzyBZ03VkFC', 'viewer', NULL, 1, '2026-06-05 19:40:00', '2026-04-10 08:10:00', '2026-06-05 19:40:00');

-- ─── site_config (không có created_at) ──────────────────────────────────────
INSERT INTO site_config (id, `key`, value, value_type, `group`, updated_by, updated_at) VALUES
(1, 'site_name', 'Sử Việt Anh Hùng', 'type_string', 'general', 1, '2026-04-10 09:00:00'),
(2, 'site_description', 'Trang web tôn vinh các anh hùng dân tộc trong lịch sử Việt Nam', 'type_string', 'general', 1, '2026-04-10 09:00:00'),
(3, 'site_logo_url', 'https://picsum.photos/seed/svah-logo/300/100', 'type_string', 'general', 1, '2026-04-10 09:00:00'),
(4, 'maintenance_mode', 'false', 'type_boolean', 'general', 1, '2026-04-10 09:00:00'),
(5, 'featured_hero_limit', '6', 'type_number', 'hero', 1, '2026-04-10 09:05:00'),
(6, 'contact_email', 'lienhe@suvietanhhung.vn', 'type_string', 'contact', 1, '2026-04-10 09:10:00'),
(7, 'contact_phone', '0901234567', 'type_string', 'contact', 1, '2026-04-10 09:10:00'),
(8, 'contact_address', 'Số 1 Lê Duẩn, Quận 1, TP. Hồ Chí Minh', 'type_string', 'contact', 1, '2026-04-10 09:10:00'),
(9, 'social_links', '{"facebook":"https://facebook.com/suvietanhhung","youtube":"https://youtube.com/@suvietanhhung"}', 'type_json', 'contact', 1, '2026-04-10 09:10:00'),
(10, 'fundraising_bank_account', '{"bank":"Vietcombank","account_number":"0123456789","account_name":"QUY SU VIET ANH HUNG"}', 'type_json', 'fundraising', 1, '2026-04-10 09:15:00');
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS users FROM users; SELECT COUNT(*) AS site_config FROM site_config; SELECT username, role FROM users;"
```

Expected: `users = 3`, `site_config = 10`, tên tiếng Việt hiển thị đúng dấu.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock users and site_config"
```

### Task 4: Khối eras + heroes

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn sau khối site_config, trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

```sql
-- ─── eras (cột `order` là từ khóa — giữ backtick) ───────────────────────────
INSERT INTO eras (id, name, slug, start_year, end_year, description, cover_image, `order`, status, created_by, updated_by, created_at, updated_at) VALUES
(1, 'Thời Hùng Vương', 'thoi-hung-vuong', -2879, -258, 'Thời kỳ lập quốc của dân tộc Việt với 18 đời vua Hùng cai trị nước Văn Lang. Đây là nền tảng văn hóa và bản sắc dân tộc Việt Nam.', 'https://picsum.photos/seed/thoi-hung-vuong/1200/600', 1, 'published', 1, 1, '2026-04-12 09:00:00', '2026-04-12 09:00:00'),
(2, 'Thời Bắc thuộc', 'thoi-bac-thuoc', -179, 938, 'Hơn một nghìn năm dưới ách đô hộ phương Bắc. Dù bị áp bức, người Việt không ngừng vùng lên với nhiều cuộc khởi nghĩa anh hùng.', 'https://picsum.photos/seed/thoi-bac-thuoc/1200/600', 2, 'published', 1, 1, '2026-04-12 09:05:00', '2026-04-12 09:05:00'),
(3, 'Thời Ngô – Đinh – Tiền Lê', 'thoi-ngo-dinh-tien-le', 939, 1009, 'Nền độc lập tự chủ được khôi phục sau chiến thắng Bạch Đằng của Ngô Quyền. Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, thống nhất đất nước.', 'https://picsum.photos/seed/thoi-ngo-dinh/1200/600', 3, 'published', 1, 1, '2026-04-12 09:10:00', '2026-04-12 09:10:00'),
(4, 'Thời Lý – Trần', 'thoi-ly-tran', 1009, 1400, 'Đỉnh cao của nền văn minh Đại Việt. Ba lần đánh tan quân Mông – Nguyên, Phật giáo phát triển rực rỡ, văn học chữ Nôm hình thành.', 'https://picsum.photos/seed/thoi-ly-tran/1200/600', 4, 'published', 1, 1, '2026-04-12 09:15:00', '2026-04-12 09:15:00'),
(5, 'Thời Hậu Lê', 'thoi-hau-le', 1428, 1788, 'Lê Lợi đánh đuổi giặc Minh, lập triều Hậu Lê. Thời kỳ hưng thịnh với nhiều thành tựu về văn hóa, pháp luật và giáo dục.', 'https://picsum.photos/seed/thoi-hau-le/1200/600', 5, 'published', 1, 1, '2026-04-12 09:20:00', '2026-04-12 09:20:00'),
(6, 'Thời Tây Sơn', 'thoi-tay-son', 1778, 1802, 'Phong trào nông dân Tây Sơn lật đổ các tập đoàn phong kiến, đánh tan quân Xiêm và quân Thanh, thống nhất đất nước.', 'https://picsum.photos/seed/thoi-tay-son/1200/600', 6, 'published', 1, 1, '2026-04-12 09:25:00', '2026-04-12 09:25:00'),
(7, 'Thời Nguyễn', 'thoi-nguyen', 1802, 1945, 'Triều đại phong kiến cuối cùng của Việt Nam. Giai đoạn cuối chứng kiến phong trào yêu nước chống thực dân Pháp sôi nổi.', 'https://picsum.photos/seed/thoi-nguyen/1200/600', 7, 'published', 1, 1, '2026-04-12 09:30:00', '2026-04-12 09:30:00'),
(8, 'Thời hiện đại', 'thoi-hien-dai', 1945, 2026, 'Từ Cách mạng Tháng Tám 1945, dân tộc Việt Nam giành độc lập, trải qua hai cuộc kháng chiến vĩ đại và công cuộc xây dựng đất nước.', 'https://picsum.photos/seed/thoi-hien-dai/1200/600', 8, 'published', 1, 1, '2026-04-12 09:35:00', '2026-04-12 09:35:00');

-- ─── heroes ─────────────────────────────────────────────────────────────────
INSERT INTO heroes (id, era_id, name, birth_year, death_year, title, biography, avatar_url, cover_url, slug, is_featured, sort_order, is_active, created_by, updated_by, created_at, updated_at) VALUES
(1, 1, 'Hùng Vương', NULL, NULL, 'Quốc tổ', 'Các vua Hùng là những vị vua đầu tiên dựng nước Văn Lang, đặt nền móng cho quốc gia và dân tộc Việt Nam. Ngày Giỗ Tổ Hùng Vương 10/3 âm lịch là quốc lễ tri ân công đức dựng nước.', 'https://picsum.photos/seed/hung-vuong/400/400', 'https://picsum.photos/seed/hung-vuong-cover/1200/500', 'hung-vuong', 0, 1, 1, 1, 1, '2026-04-13 09:00:00', '2026-04-13 09:00:00'),
(2, 1, 'An Dương Vương', NULL, -179, 'Vua nước Âu Lạc', 'An Dương Vương Thục Phán hợp nhất Âu Việt và Lạc Việt lập nước Âu Lạc, xây thành Cổ Loa — công trình quân sự độc đáo bậc nhất thời cổ đại Đông Nam Á.', 'https://picsum.photos/seed/an-duong-vuong/400/400', 'https://picsum.photos/seed/an-duong-vuong-cover/1200/500', 'an-duong-vuong', 0, 2, 1, 1, 1, '2026-04-13 09:05:00', '2026-04-13 09:05:00'),
(3, 2, 'Hai Bà Trưng', NULL, 43, 'Trưng Nữ Vương', 'Trưng Trắc và Trưng Nhị phất cờ khởi nghĩa năm 40 tại Mê Linh, đánh đuổi thái thú Tô Định, lập nên chính quyền độc lập đầu tiên sau khi mất nước. Hai Bà là biểu tượng bất khuất của phụ nữ Việt Nam.', 'https://picsum.photos/seed/hai-ba-trung/400/400', 'https://picsum.photos/seed/hai-ba-trung-cover/1200/500', 'hai-ba-trung', 1, 1, 1, 1, 1, '2026-04-13 09:10:00', '2026-04-13 09:10:00'),
(4, 2, 'Bà Triệu', 226, 248, 'Nhụy Kiều Tướng Quân', 'Triệu Thị Trinh lãnh đạo khởi nghĩa chống quân Ngô năm 248 khi mới 22 tuổi. Câu nói "Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ" của bà đã trở thành bất hủ.', 'https://picsum.photos/seed/ba-trieu/400/400', 'https://picsum.photos/seed/ba-trieu-cover/1200/500', 'ba-trieu', 0, 2, 1, 1, 1, '2026-04-13 09:15:00', '2026-04-13 09:15:00'),
(5, 2, 'Lý Nam Đế', 503, 548, 'Hoàng đế nước Vạn Xuân', 'Lý Bí khởi nghĩa đánh đuổi quân Lương năm 542, lên ngôi hoàng đế năm 544, đặt quốc hiệu Vạn Xuân — nhà nước độc lập đầu tiên xưng đế của người Việt.', 'https://picsum.photos/seed/ly-nam-de/400/400', 'https://picsum.photos/seed/ly-nam-de-cover/1200/500', 'ly-nam-de', 0, 3, 1, 1, 1, '2026-04-13 09:20:00', '2026-04-13 09:20:00'),
(6, 3, 'Ngô Quyền', 897, 944, 'Tiền Ngô Vương', 'Ngô Quyền đại phá quân Nam Hán trên sông Bạch Đằng năm 938 bằng trận địa cọc ngầm thiên tài, chấm dứt hơn một nghìn năm Bắc thuộc, mở ra kỷ nguyên độc lập lâu dài cho dân tộc.', 'https://picsum.photos/seed/ngo-quyen/400/400', 'https://picsum.photos/seed/ngo-quyen-cover/1200/500', 'ngo-quyen', 1, 1, 1, 1, 1, '2026-04-13 09:25:00', '2026-04-13 09:25:00'),
(7, 3, 'Đinh Bộ Lĩnh', 924, 979, 'Đinh Tiên Hoàng', 'Từ cậu bé chăn trâu cờ lau tập trận, Đinh Bộ Lĩnh dẹp loạn 12 sứ quân, thống nhất đất nước, lập nước Đại Cồ Việt và trở thành hoàng đế đầu tiên của nhà nước phong kiến trung ương tập quyền.', 'https://picsum.photos/seed/dinh-bo-linh/400/400', 'https://picsum.photos/seed/dinh-bo-linh-cover/1200/500', 'dinh-bo-linh', 0, 2, 1, 1, 1, '2026-04-13 09:30:00', '2026-04-13 09:30:00'),
(8, 3, 'Lê Hoàn', 941, 1005, 'Lê Đại Hành', 'Lê Hoàn lên ngôi trong thế nước lâm nguy, trực tiếp cầm quân đánh tan quân Tống xâm lược năm 981, giữ vững nền độc lập non trẻ của Đại Cồ Việt.', 'https://picsum.photos/seed/le-hoan/400/400', 'https://picsum.photos/seed/le-hoan-cover/1200/500', 'le-hoan', 0, 3, 1, 1, 1, '2026-04-13 09:35:00', '2026-04-13 09:35:00'),
(9, 4, 'Lý Thái Tổ', 974, 1028, 'Hoàng đế khai sáng triều Lý', 'Lý Công Uẩn lên ngôi năm 1009, ban Chiếu dời đô năm 1010 chuyển kinh đô từ Hoa Lư về Thăng Long, mở ra thời kỳ phát triển rực rỡ nghìn năm của kinh đô Hà Nội.', 'https://picsum.photos/seed/ly-thai-to/400/400', 'https://picsum.photos/seed/ly-thai-to-cover/1200/500', 'ly-thai-to', 0, 1, 1, 1, 1, '2026-04-13 09:40:00', '2026-04-13 09:40:00'),
(10, 4, 'Lý Thường Kiệt', 1019, 1105, 'Thái úy phụ quốc', 'Danh tướng triều Lý chủ động "tiên phát chế nhân" đánh sang đất Tống, rồi chặn đứng đại quân Tống trên phòng tuyến sông Như Nguyệt. Bài thơ "Nam quốc sơn hà" gắn với tên tuổi ông được coi là bản tuyên ngôn độc lập đầu tiên.', 'https://picsum.photos/seed/ly-thuong-kiet/400/400', 'https://picsum.photos/seed/ly-thuong-kiet-cover/1200/500', 'ly-thuong-kiet', 1, 2, 1, 1, 1, '2026-04-13 09:45:00', '2026-04-13 09:45:00'),
(11, 4, 'Trần Hưng Đạo', 1228, 1300, 'Quốc công Tiết chế', 'Hưng Đạo Đại Vương Trần Quốc Tuấn ba lần lãnh đạo quân dân Đại Việt đánh tan quân Mông – Nguyên, đội quân hùng mạnh nhất thế giới thời bấy giờ. Ông là tác giả "Hịch tướng sĩ" và được tôn vinh trong hàng những nhà quân sự kiệt xuất nhất lịch sử.', 'https://picsum.photos/seed/tran-hung-dao/400/400', 'https://picsum.photos/seed/tran-hung-dao-cover/1200/500', 'tran-hung-dao', 1, 3, 1, 1, 1, '2026-04-13 09:50:00', '2026-04-13 09:50:00'),
(12, 4, 'Trần Nhân Tông', 1258, 1308, 'Phật hoàng', 'Vị vua anh minh hai lần lãnh đạo kháng chiến chống Mông – Nguyên thắng lợi, sau nhường ngôi xuất gia, sáng lập Thiền phái Trúc Lâm Yên Tử — dòng thiền riêng của Phật giáo Việt Nam.', 'https://picsum.photos/seed/tran-nhan-tong/400/400', 'https://picsum.photos/seed/tran-nhan-tong-cover/1200/500', 'tran-nhan-tong', 0, 4, 1, 1, 1, '2026-04-13 09:55:00', '2026-04-13 09:55:00'),
(13, 5, 'Lê Lợi', 1385, 1433, 'Lê Thái Tổ', 'Bình Định Vương Lê Lợi dấy nghĩa Lam Sơn năm 1418, sau mười năm "nếm mật nằm gai" đánh đuổi giặc Minh, giành lại độc lập và sáng lập triều Hậu Lê.', 'https://picsum.photos/seed/le-loi/400/400', 'https://picsum.photos/seed/le-loi-cover/1200/500', 'le-loi', 1, 1, 1, 1, 1, '2026-04-13 10:00:00', '2026-04-13 10:00:00'),
(14, 5, 'Nguyễn Trãi', 1380, 1442, 'Anh hùng dân tộc, Danh nhân văn hóa thế giới', 'Quân sư của khởi nghĩa Lam Sơn, tác giả "Bình Ngô đại cáo" — bản tuyên ngôn độc lập thứ hai của dân tộc. Tư tưởng "việc nhân nghĩa cốt ở yên dân" của ông vượt thời đại.', 'https://picsum.photos/seed/nguyen-trai/400/400', 'https://picsum.photos/seed/nguyen-trai-cover/1200/500', 'nguyen-trai', 0, 2, 1, 1, 1, '2026-04-13 10:05:00', '2026-04-13 10:05:00'),
(15, 6, 'Quang Trung', 1753, 1792, 'Hoàng đế Quang Trung', 'Nguyễn Huệ — thiên tài quân sự bách chiến bách thắng, đánh tan 5 vạn quân Xiêm tại Rạch Gầm – Xoài Mút và 29 vạn quân Thanh trong chiến dịch thần tốc Tết Kỷ Dậu 1789.', 'https://picsum.photos/seed/quang-trung/400/400', 'https://picsum.photos/seed/quang-trung-cover/1200/500', 'quang-trung', 1, 1, 1, 1, 1, '2026-04-13 10:10:00', '2026-04-13 10:10:00'),
(16, 8, 'Hồ Chí Minh', 1890, 1969, 'Chủ tịch nước Việt Nam Dân chủ Cộng hòa', 'Người sáng lập Đảng Cộng sản Việt Nam, lãnh đạo Cách mạng Tháng Tám 1945 và đọc Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa ngày 2/9/1945.', 'https://picsum.photos/seed/ho-chi-minh/400/400', 'https://picsum.photos/seed/ho-chi-minh-cover/1200/500', 'ho-chi-minh', 1, 1, 1, 1, 1, '2026-04-13 10:15:00', '2026-04-13 10:15:00'),
(17, 8, 'Võ Nguyên Giáp', 1911, 2013, 'Đại tướng Tổng Tư lệnh', 'Vị Đại tướng đầu tiên của Quân đội nhân dân Việt Nam, Tổng chỉ huy chiến dịch Điện Biên Phủ 1954 "lừng lẫy năm châu, chấn động địa cầu", được thế giới xếp vào hàng những thống soái kiệt xuất.', 'https://picsum.photos/seed/vo-nguyen-giap/400/400', 'https://picsum.photos/seed/vo-nguyen-giap-cover/1200/500', 'vo-nguyen-giap', 1, 2, 1, 1, 1, '2026-04-13 10:20:00', '2026-04-13 10:20:00'),
(18, 7, 'Phan Bội Châu', 1867, 1940, 'Chí sĩ yêu nước', 'Lãnh tụ phong trào Đông Du đầu thế kỷ XX, đưa thanh niên Việt Nam sang Nhật học tập với khát vọng canh tân cứu nước. Cuộc đời ông là tấm gương sáng về tinh thần yêu nước bất khuất.', 'https://picsum.photos/seed/phan-boi-chau/400/400', 'https://picsum.photos/seed/phan-boi-chau-cover/1200/500', 'phan-boi-chau', 0, 1, 1, 1, 1, '2026-04-13 10:25:00', '2026-04-13 10:25:00');
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS eras FROM eras; SELECT COUNT(*) AS heroes FROM heroes; SELECT COUNT(*) AS featured FROM heroes WHERE is_featured = 1; SELECT h.name, e.name AS era FROM heroes h JOIN eras e ON e.id = h.era_id LIMIT 5;"
```

Expected: `eras = 8`, `heroes = 18`, `featured = 8`, JOIN trả về tên hero kèm era đúng.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock eras and heroes"
```

### Task 5: Khối tags + articles + bảng nối

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn sau khối heroes, trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

```sql
-- ─── tags ───────────────────────────────────────────────────────────────────
INSERT INTO tags (id, name, slug, created_by, updated_by, created_at, updated_at) VALUES
(1, 'Khởi nghĩa', 'khoi-nghia', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(2, 'Kháng chiến', 'khang-chien', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(3, 'Danh tướng', 'danh-tuong', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(4, 'Vua chúa', 'vua-chua', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(5, 'Văn hóa', 'van-hoa', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(6, 'Ngoại giao', 'ngoai-giao', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(7, 'Hải chiến', 'hai-chien', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(8, 'Độc lập dân tộc', 'doc-lap-dan-toc', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(9, 'Danh nhân', 'danh-nhan', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00'),
(10, 'Di sản', 'di-san', 1, 1, '2026-04-14 09:00:00', '2026-04-14 09:00:00');

-- ─── articles (13 published, 2 draft, 1 archived) ───────────────────────────
INSERT INTO articles (id, title, slug, image_url, excerpt, content, cover_url, status, view_count, author_id, updated_by, published_at, created_at, updated_at) VALUES
(1, 'Hai Bà Trưng phất cờ khởi nghĩa Mê Linh', 'hai-ba-trung-phat-co-khoi-nghia-me-linh', 'https://picsum.photos/seed/article-1/800/450', 'Mùa xuân năm 40, tiếng trống đồng Mê Linh vang lên, mở đầu cuộc khởi nghĩa đầu tiên giành lại độc lập sau hơn hai thế kỷ Bắc thuộc.', '<p>Mùa xuân năm 40, trước ách cai trị tàn bạo của thái thú Tô Định, Trưng Trắc cùng em là Trưng Nhị phất cờ khởi nghĩa tại cửa sông Hát, đất Mê Linh.</p><p>Cuộc khởi nghĩa nhanh chóng lan rộng, nghĩa quân hạ 65 thành trì, Tô Định phải cắt tóc cạo râu trốn về nước. Trưng Trắc lên ngôi vua, đóng đô ở Mê Linh.</p><p>Dù chỉ giữ được nền độc lập trong ba năm, khởi nghĩa Hai Bà Trưng đã chứng minh ý chí quật cường không gì khuất phục nổi của người Việt.</p>', 'https://picsum.photos/seed/article-1-cover/1200/600', 'published', 1542, 1, 1, '2026-04-15 08:00:00', '2026-04-14 10:00:00', '2026-04-15 08:00:00'),
(2, 'Chiến thắng Bạch Đằng năm 938 — mốc son chấm dứt nghìn năm Bắc thuộc', 'chien-thang-bach-dang-nam-938', 'https://picsum.photos/seed/article-2/800/450', 'Trận địa cọc ngầm trên sông Bạch Đằng của Ngô Quyền đã nhấn chìm chiến thuyền Nam Hán, mở ra kỷ nguyên độc lập lâu dài cho dân tộc.', '<p>Cuối năm 938, đoàn chiến thuyền Nam Hán do Lưu Hoằng Tháo chỉ huy tiến vào cửa sông Bạch Đằng với tham vọng thôn tính Tĩnh Hải quân.</p><p>Ngô Quyền cho đóng cọc gỗ đầu bịt sắt nhọn xuống lòng sông, nhử địch vào sâu khi triều lên rồi tổng phản công khi triều rút. Toàn bộ thủy quân địch tan vỡ, Hoằng Tháo tử trận.</p><p>Chiến thắng Bạch Đằng chấm dứt hơn một nghìn năm Bắc thuộc. Năm 939, Ngô Quyền xưng vương, khẳng định nền độc lập tự chủ của người Việt.</p>', 'https://picsum.photos/seed/article-2-cover/1200/600', 'published', 2310, 2, 2, '2026-04-18 08:00:00', '2026-04-17 09:00:00', '2026-04-18 08:00:00'),
(3, 'Đinh Bộ Lĩnh dẹp loạn 12 sứ quân', 'dinh-bo-linh-dep-loan-12-su-quan', 'https://picsum.photos/seed/article-3/800/450', 'Từ cậu bé cờ lau tập trận đất Hoa Lư, Đinh Bộ Lĩnh thống nhất giang sơn, lập nên nhà nước Đại Cồ Việt.', '<p>Sau khi nhà Ngô suy yếu, đất nước rơi vào cảnh cát cứ với 12 sứ quân chia nhau chiếm giữ các vùng.</p><p>Đinh Bộ Lĩnh từ căn cứ Hoa Lư lần lượt thu phục và đánh dẹp các sứ quân, được tôn xưng là Vạn Thắng Vương. Năm 968, ông lên ngôi hoàng đế, đặt quốc hiệu Đại Cồ Việt.</p><p>Việc xưng đế và đặt quốc hiệu riêng khẳng định vị thế ngang hàng với phương Bắc của quốc gia độc lập non trẻ.</p>', 'https://picsum.photos/seed/article-3-cover/1200/600', 'published', 876, 1, 1, '2026-04-21 08:00:00', '2026-04-20 09:00:00', '2026-04-21 08:00:00'),
(4, 'Lý Thái Tổ và Chiếu dời đô', 'ly-thai-to-va-chieu-doi-do', 'https://picsum.photos/seed/article-4/800/450', 'Năm 1010, Lý Công Uẩn ban Chiếu dời đô, chuyển kinh đô về thành Đại La — quyết định khai sinh nghìn năm Thăng Long – Hà Nội.', '<p>Lên ngôi năm 1009, Lý Công Uẩn nhận thấy Hoa Lư chật hẹp, không xứng tầm trung tâm của một quốc gia đang vươn mình.</p><p>Trong Chiếu dời đô, ông viết về thành Đại La: "ở vào nơi trung tâm trời đất, được cái thế rồng cuộn hổ ngồi". Tương truyền khi thuyền vua cập bến, rồng vàng bay lên — kinh đô mới mang tên Thăng Long.</p><p>Quyết định dời đô thể hiện tầm nhìn chiến lược vượt thời đại, mở ra thời kỳ phát triển rực rỡ của văn minh Đại Việt.</p>', 'https://picsum.photos/seed/article-4-cover/1200/600', 'published', 654, 2, 2, '2026-04-24 08:00:00', '2026-04-23 09:00:00', '2026-04-24 08:00:00'),
(5, 'Nam quốc sơn hà — bản tuyên ngôn độc lập đầu tiên', 'nam-quoc-son-ha-ban-tuyen-ngon-doc-lap-dau-tien', 'https://picsum.photos/seed/article-5/800/450', 'Bài thơ thần vang lên bên phòng tuyến sông Như Nguyệt khẳng định chủ quyền "sông núi nước Nam vua Nam ở".', '<p>Năm 1077, đại quân Tống tràn sang xâm lược Đại Việt và bị chặn đứng trước phòng tuyến sông Như Nguyệt do Lý Thường Kiệt chỉ huy.</p><p>Tương truyền trong đêm, từ đền thờ Trương Hống, Trương Hát vang lên bài thơ: "Nam quốc sơn hà Nam đế cư / Tiệt nhiên định phận tại thiên thư". Quân sĩ nức lòng, quân Tống hoảng loạn.</p><p>"Nam quốc sơn hà" được coi là bản tuyên ngôn độc lập đầu tiên của dân tộc, khẳng định chủ quyền thiêng liêng bất khả xâm phạm.</p>', 'https://picsum.photos/seed/article-5-cover/1200/600', 'published', 1120, 1, 1, '2026-04-27 08:00:00', '2026-04-26 09:00:00', '2026-04-27 08:00:00'),
(6, 'Ba lần đại phá quân Mông – Nguyên', 'ba-lan-dai-pha-quan-mong-nguyen', 'https://picsum.photos/seed/article-6/800/450', 'Ba lần đế chế hùng mạnh nhất thế giới tràn xuống Đại Việt, ba lần đều đại bại trước ý chí "Sát Thát" của quân dân nhà Trần.', '<p>Trong các năm 1258, 1285 và 1288, đế chế Mông – Nguyên ba lần xâm lược Đại Việt với những đạo quân khổng lồ từng san phẳng nửa thế giới.</p><p>Dưới sự lãnh đạo của các vua Trần và Quốc công Tiết chế Trần Hưng Đạo, quân dân Đại Việt thực hiện "vườn không nhà trống", phản công đúng thời cơ với những chiến thắng Đông Bộ Đầu, Chương Dương, Hàm Tử và đỉnh cao là trận Bạch Đằng 1288.</p><p>Hào khí Đông A trở thành biểu tượng của sức mạnh đoàn kết toàn dân "vua tôi đồng lòng, anh em hòa mục".</p>', 'https://picsum.photos/seed/article-6-cover/1200/600', 'published', 2895, 2, 2, '2026-04-30 08:00:00', '2026-04-29 09:00:00', '2026-04-30 08:00:00'),
(7, 'Khởi nghĩa Lam Sơn — mười năm nếm mật nằm gai', 'khoi-nghia-lam-son-muoi-nam-nem-mat-nam-gai', 'https://picsum.photos/seed/article-7/800/450', 'Từ núi rừng Thanh Hóa, nghĩa quân Lam Sơn của Lê Lợi trường kỳ kháng chiến, quét sạch giặc Minh ra khỏi bờ cõi.', '<p>Năm 1418, Lê Lợi dựng cờ khởi nghĩa tại Lam Sơn trong cảnh giặc Minh đô hộ tàn khốc "nướng dân đen trên ngọn lửa hung tàn".</p><p>Vượt qua những năm tháng gian khổ nhất ở núi Chí Linh, nghĩa quân chuyển hướng vào Nghệ An theo kế của Nguyễn Chích, rồi tiến ra Bắc với các chiến thắng Tốt Động – Chúc Động và Chi Lăng – Xương Giang vang dội.</p><p>Cuối năm 1427, Vương Thông buộc phải mở hội thề Đông Quan rút quân về nước. Đất nước sạch bóng quân thù sau hai mươi năm đô hộ.</p>', 'https://picsum.photos/seed/article-7-cover/1200/600', 'published', 1764, 1, 1, '2026-05-03 08:00:00', '2026-05-02 09:00:00', '2026-05-03 08:00:00'),
(8, 'Bình Ngô đại cáo — tuyên ngôn độc lập thứ hai', 'binh-ngo-dai-cao-tuyen-ngon-doc-lap-thu-hai', 'https://picsum.photos/seed/article-8/800/450', 'Áng "thiên cổ hùng văn" của Nguyễn Trãi tổng kết cuộc kháng chiến chống Minh và tuyên bố nền độc lập của Đại Việt.', '<p>Đầu năm 1428, thay lời Lê Lợi, Nguyễn Trãi viết "Bình Ngô đại cáo" bố cáo thiên hạ về thắng lợi của khởi nghĩa Lam Sơn.</p><p>Mở đầu bằng tư tưởng "việc nhân nghĩa cốt ở yên dân", bản đại cáo khẳng định Đại Việt là quốc gia "núi sông bờ cõi đã chia, phong tục Bắc Nam cũng khác" với nền văn hiến lâu đời.</p><p>Tác phẩm được hậu thế tôn vinh là bản tuyên ngôn độc lập thứ hai và là áng văn chính luận mẫu mực bậc nhất của văn học Việt Nam.</p>', 'https://picsum.photos/seed/article-8-cover/1200/600', 'published', 932, 2, 2, '2026-05-06 08:00:00', '2026-05-05 09:00:00', '2026-05-06 08:00:00'),
(9, 'Quang Trung đại phá quân Thanh Tết Kỷ Dậu 1789', 'quang-trung-dai-pha-quan-thanh-tet-ky-dau-1789', 'https://picsum.photos/seed/article-9/800/450', 'Cuộc hành quân thần tốc từ Phú Xuân ra Thăng Long và chiến thắng Ngọc Hồi – Đống Đa chỉ trong năm ngày Tết.', '<p>Cuối năm 1788, 29 vạn quân Thanh kéo sang chiếm đóng Thăng Long. Nguyễn Huệ lên ngôi hoàng đế lấy hiệu Quang Trung rồi lập tức tiến quân ra Bắc.</p><p>Với cuộc hành quân thần tốc có một không hai, đêm 30 Tết quân Tây Sơn vượt sông Gián Khẩu, mùng 5 Tết hạ đồn Ngọc Hồi và Đống Đa. Tôn Sĩ Nghị bỏ cả ấn tín tháo chạy.</p><p>Lời dụ "Đánh cho để dài tóc, đánh cho để đen răng... Đánh cho sử tri Nam quốc anh hùng chi hữu chủ" trở thành tuyên ngôn đanh thép về chủ quyền dân tộc.</p>', 'https://picsum.photos/seed/article-9-cover/1200/600', 'published', 2107, 1, 1, '2026-05-09 08:00:00', '2026-05-08 09:00:00', '2026-05-09 08:00:00'),
(10, 'Bà Triệu — nữ tướng cưỡi voi đánh giặc', 'ba-trieu-nu-tuong-cuoi-voi-danh-giac', 'https://picsum.photos/seed/article-10/800/450', 'Ở tuổi 22, Triệu Thị Trinh đã khiến quân Ngô khiếp sợ: "Vung tay đánh cọp xem còn dễ, đối diện Bà Vương mới khó sao".', '<p>Năm 248, Triệu Thị Trinh cùng anh là Triệu Quốc Đạt dấy binh chống ách đô hộ của nhà Ngô tại vùng núi Nưa, Thanh Hóa.</p><p>Hình ảnh nữ tướng mặc áo giáp vàng, cưỡi voi trắng một ngà xung trận đã trở thành huyền thoại. Câu nói của bà về khát vọng "đạp luồng sóng dữ, chém cá kình ở biển Đông" còn vang vọng đến hôm nay.</p><p>Dù khởi nghĩa thất bại, tinh thần Bà Triệu tiếp nối truyền thống Hai Bà Trưng, khẳng định vai trò phi thường của phụ nữ Việt trong sự nghiệp giữ nước.</p>', 'https://picsum.photos/seed/article-10-cover/1200/600', 'published', 743, 2, 2, '2026-05-12 08:00:00', '2026-05-11 09:00:00', '2026-05-12 08:00:00'),
(11, 'Phan Bội Châu và phong trào Đông Du', 'phan-boi-chau-va-phong-trao-dong-du', 'https://picsum.photos/seed/article-11/800/450', 'Đầu thế kỷ XX, hàng trăm thanh niên Việt Nam bí mật sang Nhật học tập theo tiếng gọi cứu nước của cụ Phan.', '<p>Năm 1905, Phan Bội Châu sang Nhật Bản và khởi xướng phong trào Đông Du, đưa thanh niên ưu tú sang học tập tại các trường quân sự và chính trị Nhật.</p><p>Lúc cao điểm có khoảng 200 du học sinh. Phong trào thắp lên ngọn lửa duy tân và khát vọng giành độc lập bằng con đường học hỏi văn minh hiện đại.</p><p>Dù bị thực dân Pháp câu kết với Nhật đàn áp năm 1909, Đông Du để lại bài học lớn về tự cường và chuẩn bị nhân tài cho công cuộc giải phóng dân tộc.</p>', 'https://picsum.photos/seed/article-11-cover/1200/600', 'published', 521, 2, 2, '2026-05-15 08:00:00', '2026-05-14 09:00:00', '2026-05-15 08:00:00'),
(12, 'Hồ Chí Minh đọc Tuyên ngôn Độc lập 2/9/1945', 'ho-chi-minh-doc-tuyen-ngon-doc-lap-2-9-1945', 'https://picsum.photos/seed/article-12/800/450', 'Tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh trịnh trọng tuyên bố với thế giới về nền độc lập của nước Việt Nam mới.', '<p>Ngày 2/9/1945, trước hàng chục vạn đồng bào tại Quảng trường Ba Đình, Chủ tịch Hồ Chí Minh đọc bản Tuyên ngôn Độc lập khai sinh nước Việt Nam Dân chủ Cộng hòa.</p><p>Mở đầu bằng chân lý "Tất cả mọi người đều sinh ra có quyền bình đẳng", bản Tuyên ngôn khẳng định: "Nước Việt Nam có quyền hưởng tự do và độc lập, và sự thật đã thành một nước tự do, độc lập".</p><p>Sự kiện chấm dứt hơn 80 năm đô hộ của thực dân Pháp và nghìn năm chế độ quân chủ, mở ra kỷ nguyên độc lập gắn liền chủ quyền nhân dân.</p>', 'https://picsum.photos/seed/article-12-cover/1200/600', 'published', 3201, 1, 1, '2026-05-18 08:00:00', '2026-05-17 09:00:00', '2026-05-18 08:00:00'),
(13, 'Võ Nguyên Giáp và chiến thắng Điện Biên Phủ', 'vo-nguyen-giap-va-chien-thang-dien-bien-phu', 'https://picsum.photos/seed/article-13/800/450', 'Quyết định đổi phương châm "đánh nhanh thắng nhanh" sang "đánh chắc tiến chắc" đã làm nên chiến thắng "chấn động địa cầu".', '<p>Đầu năm 1954, tập đoàn cứ điểm Điện Biên Phủ được Pháp xây dựng thành "pháo đài bất khả xâm phạm" giữa lòng chảo Tây Bắc.</p><p>Đại tướng Võ Nguyên Giáp đã có "quyết định khó khăn nhất cuộc đời cầm quân": kéo pháo ra, chuyển sang phương châm "đánh chắc, tiến chắc". Sau 56 ngày đêm "khoét núi ngủ hầm, mưa dầm cơm vắt", ngày 7/5/1954 lá cờ Quyết chiến Quyết thắng tung bay trên nóc hầm De Castries.</p><p>Chiến thắng Điện Biên Phủ buộc Pháp ký Hiệp định Genève, cổ vũ mạnh mẽ phong trào giải phóng dân tộc trên toàn thế giới.</p>', 'https://picsum.photos/seed/article-13-cover/1200/600', 'published', 4150, 1, 1, '2026-05-21 08:00:00', '2026-05-20 09:00:00', '2026-05-21 08:00:00'),
(14, 'Văn Miếu – Quốc Tử Giám: trường đại học đầu tiên của Việt Nam', 'van-mieu-quoc-tu-giam-truong-dai-hoc-dau-tien', 'https://picsum.photos/seed/article-14/800/450', 'Được lập từ thời Lý, Văn Miếu – Quốc Tử Giám là biểu tượng nghìn năm của truyền thống hiếu học Việt Nam.', '<p>Văn Miếu được xây dựng năm 1070 dưới triều vua Lý Thánh Tông, đến năm 1076 vua Lý Nhân Tông lập Quốc Tử Giám — trường học cao cấp đầu tiên của quốc gia.</p><p>82 bia tiến sĩ đặt trên lưng rùa đá ghi danh các nhà khoa bảng từ thế kỷ XV đến XVIII, được UNESCO công nhận là Di sản tư liệu thế giới.</p><p>Nơi đây ngày nay vẫn là điểm đến của sĩ tử trước mỗi kỳ thi, biểu tượng sống động của đạo học Việt Nam.</p>', 'https://picsum.photos/seed/article-14-cover/1200/600', 'draft', 0, 2, 2, NULL, '2026-06-05 09:00:00', '2026-06-05 09:00:00'),
(15, 'An Dương Vương và thành Cổ Loa', 'an-duong-vuong-va-thanh-co-loa', 'https://picsum.photos/seed/article-15/800/450', 'Tòa thành ốc ba vòng xoáy độc đáo và bài học giữ nước từ truyền thuyết nỏ thần.', '<p>Sau khi lập nước Âu Lạc, An Dương Vương cho xây thành Cổ Loa với ba vòng thành xoáy trôn ốc, hào nước bao quanh — công trình phòng thủ quy mô bậc nhất Đông Nam Á cổ đại.</p><p>Truyền thuyết nỏ thần Kim Quy bắn một phát hạ trăm tên gắn với những chiến thắng trước quân Triệu Đà, và bi kịch Mỵ Châu – Trọng Thủy để lại bài học cảnh giác muôn đời.</p><p>Di tích Cổ Loa ngày nay vẫn còn dấu tích các vòng thành, là chứng tích của nhà nước Việt cổ thứ hai trong lịch sử.</p>', 'https://picsum.photos/seed/article-15-cover/1200/600', 'draft', 0, 2, 2, NULL, '2026-06-08 09:00:00', '2026-06-08 09:00:00'),
(16, 'Tổng quan các triều đại phong kiến Việt Nam', 'tong-quan-cac-trieu-dai-phong-kien-viet-nam', 'https://picsum.photos/seed/article-16/800/450', 'Bài viết tổng hợp về các triều đại trong lịch sử Việt Nam — đã được thay thế bằng chuyên mục Thời kỳ.', '<p>Lịch sử phong kiến Việt Nam trải qua các triều đại Ngô, Đinh, Tiền Lê, Lý, Trần, Hồ, Hậu Lê, Mạc, Tây Sơn và Nguyễn.</p><p>Mỗi triều đại đều để lại dấu ấn riêng trong công cuộc dựng nước và giữ nước của dân tộc.</p>', 'https://picsum.photos/seed/article-16-cover/1200/600', 'archived', 312, 1, 1, '2026-04-16 08:00:00', '2026-04-15 09:00:00', '2026-05-30 10:00:00');

-- ─── article_heroes ─────────────────────────────────────────────────────────
INSERT INTO article_heroes (article_id, hero_id) VALUES
(1, 3), (2, 6), (3, 7), (4, 9), (5, 10), (6, 11), (6, 12), (7, 13), (7, 14), (8, 14), (9, 15), (10, 4), (11, 18), (12, 16), (12, 17), (13, 17), (13, 16), (15, 2), (16, 1);

-- ─── article_tags ───────────────────────────────────────────────────────────
INSERT INTO article_tags (article_id, tag_id) VALUES
(1, 1), (1, 8), (2, 7), (2, 8), (2, 3), (3, 4), (3, 8), (4, 4), (4, 5), (4, 10), (5, 5), (5, 8), (6, 2), (6, 3), (7, 1), (7, 2), (8, 5), (8, 8), (8, 10), (9, 3), (9, 2), (10, 1), (10, 9), (11, 9), (11, 8), (12, 8), (12, 9), (13, 2), (13, 3), (14, 5), (14, 10), (15, 4), (15, 10), (16, 4), (16, 5);
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS tags FROM tags; SELECT status, COUNT(*) AS n FROM articles GROUP BY status; SELECT COUNT(*) AS ah FROM article_heroes; SELECT COUNT(*) AS at FROM article_tags;"
```

Expected: `tags = 10`; articles: `published 13, draft 2, archived 1`; `ah = 19`; `at = 35`.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock tags, articles and junction tables"
```

### Task 6: Khối videos

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn sau khối article_tags, trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

(URL YouTube là link mẫu cho demo, ID video không có thật.)

```sql
-- ─── videos ─────────────────────────────────────────────────────────────────
INSERT INTO videos (id, title, description, url, embed_url, platform, thumbnail_url, duration_sec, view_count, hero_id, era_id, status, published_at, created_by, updated_by, created_at, updated_at) VALUES
(1, 'Phim tài liệu: Khởi nghĩa Hai Bà Trưng', 'Tái hiện cuộc khởi nghĩa Mê Linh năm 40 qua tư liệu lịch sử và hoạt cảnh.', 'https://www.youtube.com/watch?v=svahdemo001', 'https://www.youtube.com/embed/svahdemo001', 'youtube', 'https://picsum.photos/seed/video-1/640/360', 1260, 8540, 3, 2, 'published', '2026-04-20 10:00:00', 1, 1, '2026-04-20 10:00:00', '2026-04-20 10:00:00'),
(2, 'Bạch Đằng 938 — Trận thủy chiến lịch sử', 'Phân tích trận địa cọc ngầm của Ngô Quyền trên sông Bạch Đằng.', 'https://www.youtube.com/watch?v=svahdemo002', 'https://www.youtube.com/embed/svahdemo002', 'youtube', 'https://picsum.photos/seed/video-2/640/360', 980, 12300, 6, 3, 'published', '2026-04-25 10:00:00', 1, 1, '2026-04-25 10:00:00', '2026-04-25 10:00:00'),
(3, 'Trần Hưng Đạo và nghệ thuật quân sự Đại Việt', 'Hào khí Đông A và ba lần đại thắng quân Mông – Nguyên.', 'https://www.youtube.com/watch?v=svahdemo003', 'https://www.youtube.com/embed/svahdemo003', 'youtube', 'https://picsum.photos/seed/video-3/640/360', 1545, 15800, 11, 4, 'published', '2026-05-02 10:00:00', 2, 2, '2026-05-02 10:00:00', '2026-05-02 10:00:00'),
(4, 'Khởi nghĩa Lam Sơn toàn tập', 'Hành trình mười năm từ núi rừng Lam Sơn đến hội thề Đông Quan.', 'https://www.youtube.com/watch?v=svahdemo004', 'https://www.youtube.com/embed/svahdemo004', 'youtube', 'https://picsum.photos/seed/video-4/640/360', 2130, 9650, 13, 5, 'published', '2026-05-08 10:00:00', 2, 2, '2026-05-08 10:00:00', '2026-05-08 10:00:00'),
(5, 'Hoàng đế Quang Trung — thiên tài quân sự', 'Cuộc hành quân thần tốc và chiến thắng Ngọc Hồi – Đống Đa Tết Kỷ Dậu 1789.', 'https://www.youtube.com/watch?v=svahdemo005', 'https://www.youtube.com/embed/svahdemo005', 'youtube', 'https://picsum.photos/seed/video-5/640/360', 1820, 11200, 15, 6, 'published', '2026-05-14 10:00:00', 1, 1, '2026-05-14 10:00:00', '2026-05-14 10:00:00'),
(6, 'Chiến dịch Điện Biên Phủ 1954', '56 ngày đêm làm nên chiến thắng lừng lẫy năm châu, chấn động địa cầu.', 'https://www.youtube.com/watch?v=svahdemo006', 'https://www.youtube.com/embed/svahdemo006', 'youtube', 'https://picsum.photos/seed/video-6/640/360', 2745, 21500, 17, 8, 'published', '2026-05-20 10:00:00', 1, 1, '2026-05-20 10:00:00', '2026-05-20 10:00:00'),
(7, 'Tinh hoa văn hóa Đại Việt thời Lý – Trần', 'Kiến trúc, Phật giáo và văn học thời kỳ hoàng kim của văn minh Đại Việt.', 'https://www.youtube.com/watch?v=svahdemo007', 'https://www.youtube.com/embed/svahdemo007', 'youtube', 'https://picsum.photos/seed/video-7/640/360', 1410, 6320, NULL, 4, 'published', '2026-05-26 10:00:00', 2, 2, '2026-05-26 10:00:00', '2026-05-26 10:00:00'),
(8, 'Lịch sử Việt Nam qua các thời kỳ (bản nháp)', 'Video tổng quan đang trong quá trình biên tập.', 'https://www.youtube.com/watch?v=svahdemo008', 'https://www.youtube.com/embed/svahdemo008', 'youtube', 'https://picsum.photos/seed/video-8/640/360', 3600, 0, NULL, NULL, 'draft', NULL, 2, 2, '2026-06-07 10:00:00', '2026-06-07 10:00:00');
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS videos FROM videos; SELECT status, COUNT(*) AS n FROM videos GROUP BY status;"
```

Expected: `videos = 8`; `published 7, draft 1`.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock videos"
```

### Task 7: Khối donation_tiers + donations + sponsor_tiers + sponsors

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn sau khối videos, trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

```sql
-- ─── donation_tiers ─────────────────────────────────────────────────────────
INSERT INTO donation_tiers (id, name, amount_min, amount_max, perks, badge_url, color, sort_order, is_active, created_by, updated_by, created_at, updated_at) VALUES
(1, 'Đồng', 10000, 199000, '["Ghi tên trên bảng vinh danh"]', 'https://picsum.photos/seed/badge-dong/100/100', '#b87333', 1, 1, 1, 1, '2026-04-11 09:00:00', '2026-04-11 09:00:00'),
(2, 'Bạc', 200000, 999000, '["Ghi tên trên bảng vinh danh","Huy hiệu Bạc"]', 'https://picsum.photos/seed/badge-bac/100/100', '#c0c0c0', 2, 1, 1, 1, '2026-04-11 09:05:00', '2026-04-11 09:05:00'),
(3, 'Vàng', 1000000, 4999000, '["Ghi tên trên bảng vinh danh","Huy hiệu Vàng","Thư cảm ơn từ dự án"]', 'https://picsum.photos/seed/badge-vang/100/100', '#ffd700', 3, 1, 1, 1, '2026-04-11 09:10:00', '2026-04-11 09:10:00'),
(4, 'Kim Cương', 5000000, NULL, '["Ghi tên trên bảng vinh danh","Huy hiệu Kim Cương","Thư cảm ơn từ dự án","Vinh danh trên trang chủ"]', 'https://picsum.photos/seed/badge-kim-cuong/100/100', '#b9f2ff', 4, 1, 1, 1, '2026-04-11 09:15:00', '2026-04-11 09:15:00');

-- ─── donations (7 confirmed, 3 pending, 2 rejected; 3 anonymous) ────────────
INSERT INTO donations (id, public_id, tier_id, donor_name, donor_email, donor_phone, amount, message, is_anonymous, status, payment_method, payment_ref, confirmed_by, confirmed_at, show_on_board, created_at, updated_at) VALUES
(1, 'd0000000-0000-4000-8000-000000000001', 2, 'Nguyễn Văn An', 'an.nguyen@example.com', '0911000001', 500000, 'Ủng hộ dự án lan tỏa lịch sử nước nhà!', 0, 'confirmed', 'bank_transfer', 'FT26041500001', 1, '2026-04-16 10:00:00', 1, '2026-04-15 09:30:00', '2026-04-16 10:00:00'),
(2, 'd0000000-0000-4000-8000-000000000002', 1, 'Trần Thị Bình', 'binh.tran@example.com', '0911000002', 100000, 'Chúc dự án ngày càng phát triển.', 0, 'confirmed', 'qr', 'QR26042000002', 1, '2026-04-21 11:00:00', 1, '2026-04-20 14:20:00', '2026-04-21 11:00:00'),
(3, 'd0000000-0000-4000-8000-000000000003', 4, NULL, NULL, NULL, 10000000, 'Mong các bạn trẻ thêm yêu sử Việt.', 1, 'confirmed', 'bank_transfer', 'FT26042800003', 1, '2026-04-29 09:00:00', 1, '2026-04-28 16:45:00', '2026-04-29 09:00:00'),
(4, 'd0000000-0000-4000-8000-000000000004', 3, 'Lê Minh Châu', 'chau.le@example.com', '0911000004', 2000000, 'Tự hào lịch sử Việt Nam!', 0, 'confirmed', 'bank_transfer', 'FT26050500004', 1, '2026-05-06 10:30:00', 1, '2026-05-05 08:15:00', '2026-05-06 10:30:00'),
(5, 'd0000000-0000-4000-8000-000000000005', 1, 'Phạm Quốc Dũng', 'dung.pham@example.com', '0911000005', 50000, NULL, 0, 'confirmed', 'qr', 'QR26051200005', 1, '2026-05-13 09:00:00', 1, '2026-05-12 19:30:00', '2026-05-13 09:00:00'),
(6, 'd0000000-0000-4000-8000-000000000006', 2, NULL, NULL, NULL, 300000, NULL, 1, 'confirmed', 'qr', 'QR26051800006', 1, '2026-05-19 10:00:00', 1, '2026-05-18 12:00:00', '2026-05-19 10:00:00'),
(7, 'd0000000-0000-4000-8000-000000000007', 3, 'Hoàng Thu Hà', 'ha.hoang@example.com', '0911000007', 1500000, 'Ủng hộ đội ngũ làm nội dung lịch sử chất lượng.', 0, 'confirmed', 'bank_transfer', 'FT26052500007', 1, '2026-05-26 14:00:00', 1, '2026-05-25 10:45:00', '2026-05-26 14:00:00'),
(8, 'd0000000-0000-4000-8000-000000000008', 1, 'Vũ Đức Em', 'em.vu@example.com', '0911000008', 150000, 'Cố lên các bạn!', 0, 'pending', 'bank_transfer', NULL, NULL, NULL, 1, '2026-06-08 09:20:00', '2026-06-08 09:20:00'),
(9, 'd0000000-0000-4000-8000-000000000009', 2, NULL, NULL, NULL, 250000, NULL, 1, 'pending', 'qr', NULL, NULL, NULL, 1, '2026-06-09 15:40:00', '2026-06-09 15:40:00'),
(10, 'd0000000-0000-4000-8000-000000000010', 4, 'Đặng Gia Phúc', 'phuc.dang@example.com', '0911000010', 7000000, 'Mong dự án có thêm nhiều tư liệu quý.', 0, 'pending', 'bank_transfer', NULL, NULL, NULL, 1, '2026-06-10 11:10:00', '2026-06-10 11:10:00'),
(11, 'd0000000-0000-4000-8000-000000000011', 1, 'Bùi Văn Giang', 'giang.bui@example.com', '0911000011', 20000, NULL, 0, 'rejected', 'bank_transfer', NULL, 1, '2026-05-30 09:00:00', 0, '2026-05-29 20:00:00', '2026-05-30 09:00:00'),
(12, 'd0000000-0000-4000-8000-000000000012', 2, 'Đỗ Thị Hoa', 'hoa.do@example.com', '0911000012', 400000, 'Giao dịch trùng, vui lòng hủy giúp mình.', 0, 'rejected', 'qr', NULL, 1, '2026-06-02 10:00:00', 0, '2026-06-01 13:25:00', '2026-06-02 10:00:00');

-- ─── sponsor_tiers ──────────────────────────────────────────────────────────
INSERT INTO sponsor_tiers (id, name, sort_order, created_by, updated_by, created_at, updated_at) VALUES
(1, 'Kim Cương', 1, 1, 1, '2026-04-11 10:00:00', '2026-04-11 10:00:00'),
(2, 'Vàng', 2, 1, 1, '2026-04-11 10:00:00', '2026-04-11 10:00:00'),
(3, 'Bạc', 3, 1, 1, '2026-04-11 10:00:00', '2026-04-11 10:00:00');

-- ─── sponsors (tên đơn vị hư cấu) ───────────────────────────────────────────
INSERT INTO sponsors (id, tier_id, name, logo_url, website_url, description, is_active, sort_order, sponsored_at, expires_at, created_by, updated_by, created_at, updated_at) VALUES
(1, 1, 'Công ty TNHH Văn Hóa Việt', 'https://picsum.photos/seed/sponsor-1/300/150', 'https://vanhoaviet.example.com', 'Doanh nghiệp xuất bản sách và ấn phẩm văn hóa lịch sử.', 1, 1, '2026-04-15', '2027-04-15', 1, 1, '2026-04-15 09:00:00', '2026-04-15 09:00:00'),
(2, 1, 'Quỹ Khuyến học Đại Việt', 'https://picsum.photos/seed/sponsor-2/300/150', 'https://daiviet.example.org', 'Quỹ hỗ trợ giáo dục và truyền bá tri thức lịch sử cho học sinh.', 1, 2, '2026-04-20', '2027-04-20', 1, 1, '2026-04-20 09:00:00', '2026-04-20 09:00:00'),
(3, 2, 'Nhà sách Sử Xanh', 'https://picsum.photos/seed/sponsor-3/300/150', 'https://suxanh.example.com', 'Chuỗi nhà sách chuyên về sách lịch sử và văn hóa dân tộc.', 1, 1, '2026-05-01', '2026-11-01', 1, 1, '2026-05-01 09:00:00', '2026-05-01 09:00:00'),
(4, 2, 'Công ty Du lịch Cội Nguồn', 'https://picsum.photos/seed/sponsor-4/300/150', 'https://coinguon.example.com', 'Đơn vị tổ chức tour tham quan di tích lịch sử trên cả nước.', 1, 2, '2026-05-10', '2026-11-10', 1, 1, '2026-05-10 09:00:00', '2026-05-10 09:00:00'),
(5, 3, 'Xưởng phim Hồn Việt', 'https://picsum.photos/seed/sponsor-5/300/150', 'https://honviet.example.com', 'Đơn vị sản xuất phim tài liệu lịch sử.', 1, 1, '2026-05-20', '2026-08-20', 1, 1, '2026-05-20 09:00:00', '2026-05-20 09:00:00'),
(6, 3, 'Trà Việt Cổ Truyền', 'https://picsum.photos/seed/sponsor-6/300/150', 'https://traviet.example.com', 'Thương hiệu trà truyền thống đồng hành cùng các sự kiện văn hóa.', 0, 2, '2025-12-01', '2026-06-01', 1, 1, '2026-04-11 09:00:00', '2026-06-02 09:00:00');
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS dt FROM donation_tiers; SELECT status, COUNT(*) AS n FROM donations GROUP BY status; SELECT COUNT(*) AS st FROM sponsor_tiers; SELECT COUNT(*) AS sp FROM sponsors;"
```

Expected: `dt = 4`; donations: `confirmed 7, pending 3, rejected 2`; `st = 3`; `sp = 6`.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock donations and sponsors"
```

### Task 8: Khối media + page_views

**Files:**
- Modify: `BackEnd/src/seeds/mock_data.sql` (chèn sau khối sponsors, trước `SET FOREIGN_KEY_CHECKS = 1;`)

- [ ] **Step 1: Chèn khối SQL sau**

```sql
-- ─── media ──────────────────────────────────────────────────────────────────
INSERT INTO media (id, filename, original_name, url, mime_type, size_bytes, uploaded_by, updated_by, created_at, updated_at) VALUES
(1, 'hero-tran-hung-dao-avatar.jpg', 'tran hung dao.jpg', 'https://picsum.photos/seed/tran-hung-dao/400/400', 'image/jpeg', 245760, 1, 1, '2026-04-13 09:50:00', '2026-04-13 09:50:00'),
(2, 'hero-ngo-quyen-avatar.jpg', 'ngo quyen chan dung.jpg', 'https://picsum.photos/seed/ngo-quyen/400/400', 'image/jpeg', 198452, 1, 1, '2026-04-13 09:25:00', '2026-04-13 09:25:00'),
(3, 'article-bach-dang-cover.jpg', 'bach dang 938.jpg', 'https://picsum.photos/seed/article-2-cover/1200/600', 'image/jpeg', 512000, 2, 2, '2026-04-17 09:10:00', '2026-04-17 09:10:00'),
(4, 'article-dien-bien-phu-cover.jpg', 'dien bien phu 1954.jpg', 'https://picsum.photos/seed/article-13-cover/1200/600', 'image/jpeg', 487230, 1, 1, '2026-05-20 09:10:00', '2026-05-20 09:10:00'),
(5, 'era-ly-tran-cover.jpg', 'thoi ly tran.jpg', 'https://picsum.photos/seed/thoi-ly-tran/1200/600', 'image/jpeg', 534120, 1, 1, '2026-04-12 09:15:00', '2026-04-12 09:15:00'),
(6, 'video-thumb-dien-bien-phu.jpg', 'thumb dbp.jpg', 'https://picsum.photos/seed/video-6/640/360', 'image/jpeg', 145890, 1, 1, '2026-05-20 10:05:00', '2026-05-20 10:05:00'),
(7, 'sponsor-van-hoa-viet-logo.png', 'logo VHV.png', 'https://picsum.photos/seed/sponsor-1/300/150', 'image/png', 56320, 1, 1, '2026-04-15 09:05:00', '2026-04-15 09:05:00'),
(8, 'badge-kim-cuong.png', 'badge kc.png', 'https://picsum.photos/seed/badge-kim-cuong/100/100', 'image/png', 23450, 1, 1, '2026-04-11 09:15:00', '2026-04-11 09:15:00'),
(9, 'site-logo.png', 'logo chinh thuc.png', 'https://picsum.photos/seed/svah-logo/300/100', 'image/png', 34210, 1, 1, '2026-04-10 09:00:00', '2026-04-10 09:00:00'),
(10, 'hero-quang-trung-cover.jpg', 'quang trung cover.jpg', 'https://picsum.photos/seed/quang-trung-cover/1200/500', 'image/jpeg', 467800, 2, 2, '2026-04-13 10:10:00', '2026-04-13 10:10:00');

-- ─── page_views (không có updated_at) ───────────────────────────────────────
INSERT INTO page_views (id, path, referrer, user_agent, ip_hash, created_at) VALUES
(1, '/', 'https://www.google.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', '2026-05-12 08:15:00'),
(2, '/heroes', 'https://suvietanhhung.vn/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', '2026-05-12 08:17:00'),
(3, '/heroes/tran-hung-dao', 'https://suvietanhhung.vn/heroes', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'a3f5b8c2d1e4f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1', '2026-05-12 08:20:00'),
(4, '/', NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'b4a6c9d3e2f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2026-05-13 12:30:00'),
(5, '/articles', 'https://www.facebook.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'b4a6c9d3e2f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2026-05-13 12:32:00'),
(6, '/articles/vo-nguyen-giap-va-chien-thang-dien-bien-phu', 'https://suvietanhhung.vn/articles', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'b4a6c9d3e2f5a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2', '2026-05-13 12:35:00'),
(7, '/eras', NULL, 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'c5b7d0e4f3a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', '2026-05-15 09:00:00'),
(8, '/eras/thoi-ly-tran', 'https://suvietanhhung.vn/eras', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'c5b7d0e4f3a6b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3', '2026-05-15 09:05:00'),
(9, '/heroes/ngo-quyen', 'https://www.google.com/', 'Mozilla/5.0 (Linux; Android 14)', 'd6c8e1f5a4b7c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', '2026-05-17 14:20:00'),
(10, '/articles/chien-thang-bach-dang-nam-938', 'https://www.google.com/', 'Mozilla/5.0 (Linux; Android 14)', 'd6c8e1f5a4b7c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4', '2026-05-17 14:25:00'),
(11, '/', 'https://www.youtube.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'e7d9f2a6b5c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', '2026-05-19 19:45:00'),
(12, '/videos', 'https://suvietanhhung.vn/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'e7d9f2a6b5c8d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5', '2026-05-19 19:47:00'),
(13, '/donate', NULL, 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'f8e0a3b7c6d9e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6', '2026-05-21 10:10:00'),
(14, '/heroes/quang-trung', 'https://www.facebook.com/', 'Mozilla/5.0 (Linux; Android 14)', 'a9f1b4c8d7e0f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', '2026-05-23 16:30:00'),
(15, '/articles/quang-trung-dai-pha-quan-thanh-tet-ky-dau-1789', 'https://suvietanhhung.vn/heroes/quang-trung', 'Mozilla/5.0 (Linux; Android 14)', 'a9f1b4c8d7e0f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7', '2026-05-23 16:35:00'),
(16, '/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'b0a2c5d9e8f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', '2026-05-25 08:00:00'),
(17, '/heroes', 'https://suvietanhhung.vn/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'b0a2c5d9e8f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', '2026-05-25 08:03:00'),
(18, '/heroes/hai-ba-trung', 'https://suvietanhhung.vn/heroes', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'b0a2c5d9e8f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', '2026-05-25 08:06:00'),
(19, '/articles/hai-ba-trung-phat-co-khoi-nghia-me-linh', 'https://suvietanhhung.vn/heroes/hai-ba-trung', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'b0a2c5d9e8f1a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8', '2026-05-25 08:10:00'),
(20, '/eras/thoi-hung-vuong', 'https://www.google.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'c1b3d6e0f9a2b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9', '2026-05-27 11:20:00'),
(21, '/heroes/ho-chi-minh', 'https://www.google.com/', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'd2c4e7f1a0b3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', '2026-05-29 20:15:00'),
(22, '/articles/ho-chi-minh-doc-tuyen-ngon-doc-lap-2-9-1945', 'https://suvietanhhung.vn/heroes/ho-chi-minh', 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)', 'd2c4e7f1a0b3c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0', '2026-05-29 20:18:00'),
(23, '/videos', 'https://www.youtube.com/', 'Mozilla/5.0 (Linux; Android 14)', 'e3d5f8a2b1c4d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1', '2026-06-01 13:40:00'),
(24, '/', NULL, 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'f4e6a9b3c2d5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', '2026-06-03 09:30:00'),
(25, '/donate', 'https://suvietanhhung.vn/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'f4e6a9b3c2d5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', '2026-06-03 09:35:00'),
(26, '/sponsors', 'https://suvietanhhung.vn/donate', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'f4e6a9b3c2d5e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2', '2026-06-03 09:40:00'),
(27, '/heroes/le-loi', 'https://www.facebook.com/', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'a5f7b0c4d3e6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', '2026-06-05 15:50:00'),
(28, '/articles/khoi-nghia-lam-son-muoi-nam-nem-mat-nam-gai', 'https://suvietanhhung.vn/heroes/le-loi', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', 'a5f7b0c4d3e6f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3', '2026-06-05 15:55:00'),
(29, '/heroes/vo-nguyen-giap', 'https://www.google.com/', 'Mozilla/5.0 (Linux; Android 14)', 'b6a8c1d5e4f7a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4', '2026-06-08 18:25:00'),
(30, '/', 'https://www.google.com/', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'c7b9d2e6f5a8b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5', '2026-06-10 07:45:00');
```

- [ ] **Step 2: Chạy file và kiểm tra**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT COUNT(*) AS media FROM media; SELECT COUNT(*) AS page_views FROM page_views;"
```

Expected: `media = 10`, `page_views = 30`.

- [ ] **Step 3: Commit**

```powershell
git add BackEnd/src/seeds/mock_data.sql
git commit -m "feat(seed): mock media and page_views"
```

### Task 9: Kiểm chứng toàn bộ (definition of done của spec)

- [ ] **Step 1: Chạy file 2 lần liên tiếp** — xác nhận chạy lại không lỗi (tính chất truncate-rồi-insert)

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "source BackEnd/src/seeds/mock_data.sql"
```

Expected: cả 2 lần đều exit 0, không lỗi.

- [ ] **Step 2: Kiểm tra số lượng tất cả các bảng**

```powershell
mysql --default-character-set=utf8mb4 -h <DB_HOST> -u <DB_USER> -p"<DB_PASSWORD>" <DB_NAME> -e "SELECT 'users' t, COUNT(*) n FROM users UNION ALL SELECT 'site_config', COUNT(*) FROM site_config UNION ALL SELECT 'eras', COUNT(*) FROM eras UNION ALL SELECT 'heroes', COUNT(*) FROM heroes UNION ALL SELECT 'tags', COUNT(*) FROM tags UNION ALL SELECT 'articles', COUNT(*) FROM articles UNION ALL SELECT 'article_heroes', COUNT(*) FROM article_heroes UNION ALL SELECT 'article_tags', COUNT(*) FROM article_tags UNION ALL SELECT 'videos', COUNT(*) FROM videos UNION ALL SELECT 'donation_tiers', COUNT(*) FROM donation_tiers UNION ALL SELECT 'donations', COUNT(*) FROM donations UNION ALL SELECT 'sponsor_tiers', COUNT(*) FROM sponsor_tiers UNION ALL SELECT 'sponsors', COUNT(*) FROM sponsors UNION ALL SELECT 'media', COUNT(*) FROM media UNION ALL SELECT 'page_views', COUNT(*) FROM page_views UNION ALL SELECT 'refresh_tokens', COUNT(*) FROM refresh_tokens;"
```

Expected: users 3, site_config 10, eras 8, heroes 18, tags 10, articles 16, article_heroes 19, article_tags 35, videos 8, donation_tiers 4, donations 12, sponsor_tiers 3, sponsors 6, media 10, page_views 30, refresh_tokens 0.

- [ ] **Step 3: Kiểm tra đăng nhập qua API** — khởi động BE rồi gọi login

```powershell
# Terminal 1 (hoặc chạy nền):
Set-Location BackEnd; npm run dev
# Terminal 2:
curl.exe -s -X POST http://localhost:3000/api/v1/auth/login -H "Content-Type: application/json" -d '{\"email\":\"admin@suvietanhhung.vn\",\"password\":\"Admin@123456\"}'
```

(Port mặc định 3000 — kiểm tra biến `PORT` trong `BackEnd/.env` nếu khác.)

Expected: JSON chứa `accessToken` và thông tin user `admin`. Nếu 401: hash bcrypt sai — quay lại Task 1.

- [ ] **Step 4: Kiểm tra FE không trang nào trống** — chạy FE (`Set-Location FrontEnd; npm run dev`), mở trang chủ, danh sách thời kỳ, anh hùng, bài viết — tất cả hiển thị dữ liệu tiếng Việt đúng dấu.

- [ ] **Step 5: Commit cuối (nếu còn thay đổi) và dọn dẹp**

```powershell
git status
# nếu còn file thay đổi liên quan: git add + git commit -m "chore(seed): finalize mock_data.sql"
# dừng các tiến trình dev đã bật ở Step 3-4
```
