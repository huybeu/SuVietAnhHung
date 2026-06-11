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

SET FOREIGN_KEY_CHECKS = 1;
