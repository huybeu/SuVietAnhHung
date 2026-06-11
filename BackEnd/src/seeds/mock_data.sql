-- ============================================================================
-- mock_data.sql — Dữ liệu mẫu cho Sử Việt Anh Hùng (môi trường dev/demo)
--
-- !! CẢNH BÁO: Script này XÓA TOÀN BỘ DỮ LIỆU trong 16 bảng trước khi nạp
-- dữ liệu mẫu. TUYỆT ĐỐI KHÔNG chạy trên production.
--
-- Điều kiện: các bảng đã tồn tại (chạy BE ít nhất 1 lần để Sequelize sync).
--
-- Cách chạy (từ gốc repo; thông tin kết nối xem BackEnd/.env):
--   cmd /c "mysql --default-character-set=utf8mb4 -h <host> -u <user> -p<password> <db_name> < BackEnd\src\seeds\mock_data.sql"
-- Nếu MySQL chạy trong Docker (container suvietanhhung-mysql):
--   cmd /c "docker exec -i suvietanhhung-mysql mysql --default-character-set=utf8mb4 -u<user> -p<password> <db_name> < BackEnd\src\seeds\mock_data.sql"
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

-- ─── users ──────────────────────────────────────────────────────────────────
INSERT INTO users (id, username, email, password, role, avatar_url, is_active, last_login, created_at, updated_at) VALUES
(1, 'admin', 'admin@suvietanhhung.vn', '$2b$12$XddvlB7iP0gG2WO1SSLj..sKhpEEs6zMBR0enOL04y0nWVRyqOtTG', 'superadmin', 'https://picsum.photos/seed/admin/200/200', 1, '2026-06-10 08:30:00', '2026-04-10 08:00:00', '2026-04-10 08:00:00'),
(2, 'editor01', 'editor@suvietanhhung.vn', '$2b$12$0.UZYOBKVgFMHm4o.6CR8OdTiOngm.Fi9e0huC.QS9UTY.tOzL0RG', 'editor', 'https://picsum.photos/seed/editor01/200/200', 1, '2026-06-09 14:15:00', '2026-04-10 08:05:00', '2026-04-10 08:05:00'),
(3, 'viewer01', 'viewer@suvietanhhung.vn', '$2b$12$ke2WF.WDTDJTJFEzjbezyO..4T0JL8fvNJmZb5/447EzyBZ03VkFC', 'viewer', NULL, 1, '2026-06-05 19:40:00', '2026-04-10 08:10:00', '2026-04-10 08:10:00');

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

SET FOREIGN_KEY_CHECKS = 1;
