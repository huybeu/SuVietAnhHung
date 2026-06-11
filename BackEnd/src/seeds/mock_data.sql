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

SET FOREIGN_KEY_CHECKS = 1;
