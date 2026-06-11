/**
 * Seed script — dữ liệu mẫu cho Sử Việt Anh Hùng
 * Chạy: node src/seeds/seed.js
 *
 * Idempotent: kiểm tra dữ liệu trước khi tạo, an toàn để chạy nhiều lần.
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') })

const {
  sequelize,
  User,
  Era,
  Hero,
  Tag,
  Article,
  ArticleHero,
  ArticleTag,
  DonationTier,
  SponsorTier,
} = require('../models')

// ─── Helpers ─────────────────────────────────────────────────────────────────

const img = (seed, w = 800, h = 500) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}`

const now = new Date()
const daysAgo = (n) => new Date(now - n * 86400000)

// ─── Eras ────────────────────────────────────────────────────────────────────

const ERA_DATA = [
  {
    name: 'Thời Hùng Vương',
    period: '2879 TCN – 258 TCN',
    year_start: -2879,
    year_end: -258,
    description: 'Thời kỳ lập quốc của dân tộc Việt, với 18 đời vua Hùng cai trị nước Văn Lang. Đây là nền tảng văn hóa và bản sắc dân tộc.',
    cover_url: img('hung-vuong', 1200, 600),
    sort_order: 1,
  },
  {
    name: 'Thời Bắc Thuộc',
    period: '179 TCN – 938',
    year_start: -179,
    year_end: 938,
    description: 'Hơn 1000 năm dưới ách đô hộ phương Bắc. Dù bị áp bức, người Việt không ngừng vùng lên đấu tranh giành độc lập với nhiều cuộc khởi nghĩa anh hùng.',
    cover_url: img('bac-thuoc', 1200, 600),
    sort_order: 2,
  },
  {
    name: 'Thời Ngô – Đinh – Tiền Lê',
    period: '939 – 1009',
    year_start: 939,
    year_end: 1009,
    description: 'Nền độc lập tự chủ được khôi phục. Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, mở ra kỷ nguyên độc lập. Đinh Bộ Lĩnh thống nhất đất nước.',
    cover_url: img('ngo-dinh', 1200, 600),
    sort_order: 3,
  },
  {
    name: 'Thời Lý – Trần',
    period: '1009 – 1400',
    year_start: 1009,
    year_end: 1400,
    description: 'Đỉnh cao của nền văn minh Đại Việt. Ba lần đánh tan quân Mông Nguyên. Phật giáo phát triển rực rỡ. Văn học chữ Nôm hình thành.',
    cover_url: img('ly-tran', 1200, 600),
    sort_order: 4,
  },
  {
    name: 'Thời Hậu Lê',
    period: '1428 – 1788',
    year_start: 1428,
    year_end: 1788,
    description: 'Lê Lợi đánh đuổi giặc Minh, lập ra triều Hậu Lê. Đây là thời kỳ đất nước hưng thịnh với nhiều thành tựu về văn hóa, pháp luật và giáo dục.',
    cover_url: img('hau-le', 1200, 600),
    sort_order: 5,
  },
  {
    name: 'Thời Tây Sơn',
    period: '1778 – 1802',
    year_start: 1778,
    year_end: 1802,
    description: 'Phong trào nông dân Tây Sơn do ba anh em Nguyễn Nhạc, Nguyễn Huệ, Nguyễn Lữ lãnh đạo. Nguyễn Huệ lên ngôi Hoàng đế Quang Trung, đánh tan 29 vạn quân Thanh.',
    cover_url: img('tay-son', 1200, 600),
    sort_order: 6,
  },
]

// ─── Heroes ──────────────────────────────────────────────────────────────────

const HERO_DATA = (eraMap, adminId) => [
  {
    name: 'Hai Bà Trưng',
    title: 'Nữ Anh Hùng Chống Bắc Thuộc',
    slug: 'hai-ba-trung',
    era_id: eraMap['Thời Bắc Thuộc'],
    birth_year: 12,
    death_year: 43,
    biography: `<p>Hai Bà Trưng — Trưng Trắc và Trưng Nhị — là hai chị em nữ anh hùng của dân tộc Việt Nam, người đã lãnh đạo cuộc khởi nghĩa năm 40 – 43 chống lại ách đô hộ của nhà Đông Hán.</p>
<p>Trưng Trắc, chị cả, là người khởi xướng cuộc khởi nghĩa sau khi chồng bà — Thi Sách — bị thái thú Tô Định giết hại. Không chịu khuất phục, hai bà dựng cờ khởi nghĩa tại Mê Linh (nay thuộc Hà Nội).</p>
<blockquote>Một xin rửa sạch nước thù, Hai xin dựng lại nghiệp xưa họ Hùng...</blockquote>
<p>Chỉ trong thời gian ngắn, nghĩa quân đã giải phóng 65 thành trì, Trưng Trắc lên ngôi vua, đóng đô tại Mê Linh. Đây là lần đầu tiên trong lịch sử, phụ nữ Việt Nam nắm quyền lãnh đạo quốc gia.</p>
<p>Năm 43, quân Hán do Mã Viện chỉ huy phản công với lực lượng đông đảo. Sau nhiều trận chiến ác liệt, hai bà rút về Cẩm Khê và tử tiết để bảo toàn khí tiết anh hùng.</p>`,
    avatar_url: img('hai-ba-trung-avatar', 400, 400),
    cover_url: img('hai-ba-trung', 1200, 600),
    is_featured: true,
    sort_order: 1,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Ngô Quyền',
    title: 'Người Khai Sáng Nền Độc Lập',
    slug: 'ngo-quyen',
    era_id: eraMap['Thời Ngô – Đinh – Tiền Lê'],
    birth_year: 897,
    death_year: 944,
    biography: `<p>Ngô Quyền (897–944) là người anh hùng đã chấm dứt hơn 1.000 năm Bắc thuộc của dân tộc Việt Nam bằng chiến thắng lẫy lừng trên sông Bạch Đằng năm 938.</p>
<p>Sinh ra ở đất Đường Lâm (nay thuộc Hà Nội), Ngô Quyền là tướng dưới trướng Dương Đình Nghệ. Khi Dương Đình Nghệ bị giết bởi Kiều Công Tiễn, Ngô Quyền kéo quân về trừng phạt kẻ phản bội, đồng thời chuẩn bị đánh tan quân Nam Hán đang kéo vào nước ta.</p>
<p>Chiến thuật thiên tài: Ngô Quyền cho quân đóng cọc gỗ bịt sắt nhọn dưới lòng sông Bạch Đằng khi thủy triều xuống. Khi quân Nam Hán tiến vào, ông nhử địch vượt qua bãi cọc lúc nước lớn, rồi khi nước rút, phản công quyết liệt. Toàn bộ chiến thuyền địch bị phá hủy, Hoàng tử Nam Hán Lưu Hoằng Tháo tử trận.</p>
<blockquote>Chiến thắng Bạch Đằng năm 938 là cột mốc vàng son, mở ra kỷ nguyên độc lập, tự chủ lâu dài của dân tộc Việt.</blockquote>`,
    avatar_url: img('ngo-quyen-avatar', 400, 400),
    cover_url: img('ngo-quyen', 1200, 600),
    is_featured: true,
    sort_order: 2,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Đinh Bộ Lĩnh',
    title: 'Đinh Tiên Hoàng – Người Thống Nhất Đất Nước',
    slug: 'dinh-bo-linh',
    era_id: eraMap['Thời Ngô – Đinh – Tiền Lê'],
    birth_year: 924,
    death_year: 979,
    biography: `<p>Đinh Bộ Lĩnh (924–979), hay còn gọi là Đinh Tiên Hoàng, là vị vua đầu tiên của nhà Đinh, người đã dẹp loạn 12 sứ quân, thống nhất đất nước sau thời kỳ hỗn loạn hậu Ngô.</p>
<p>Thuở nhỏ, Đinh Bộ Lĩnh thường cùng bạn bè chơi trò đánh trận, dùng bông lau làm cờ và để bạn cõng mình như hoàng đế — câu chuyện nổi tiếng về "cờ lau tập trận". Lớn lên, ông tập hợp nghĩa quân ở Hoa Lư (nay thuộc Ninh Bình).</p>
<p>Từ năm 965 đến 967, Đinh Bộ Lĩnh lần lượt đánh dẹp tất cả 12 sứ quân, thống nhất đất nước. Năm 968, ông lên ngôi hoàng đế, lấy hiệu là Đinh Tiên Hoàng, đặt tên nước là Đại Cồ Việt, đóng đô tại Hoa Lư.</p>`,
    avatar_url: img('dinh-bo-linh-avatar', 400, 400),
    cover_url: img('dinh-bo-linh', 1200, 600),
    is_featured: true,
    sort_order: 3,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Trần Hưng Đạo',
    title: 'Quốc Công Tiết Chế – Thiên Tài Quân Sự',
    slug: 'tran-hung-dao',
    era_id: eraMap['Thời Lý – Trần'],
    birth_year: 1228,
    death_year: 1300,
    biography: `<p>Trần Hưng Đạo (1228–1300), tên thật là Trần Quốc Tuấn, được phong tước hiệu Hưng Đạo Đại Vương, là vị tướng thiên tài đã ba lần lãnh đạo quân dân Đại Việt đánh tan đội quân Mông Nguyên hùng mạnh nhất thế giới thời bấy giờ.</p>
<p>Ông là tác giả của <em>Hịch tướng sĩ</em> — một áng hùng văn bất hủ kêu gọi tinh thần chiến đấu:</p>
<blockquote>Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa; chỉ giận chưa thể xé thịt lột da, nuốt gan uống máu quân thù...</blockquote>
<p>Ba lần kháng chiến chống Mông Nguyên (1258, 1285, 1287-1288) đều kết thúc bằng thắng lợi vẻ vang cho Đại Việt. Chiến thắng Bạch Đằng năm 1288 — một lần nữa sông Bạch Đằng chứng kiến thất bại thảm hại của kẻ thù — trở thành đỉnh cao của thiên tài quân sự Trần Hưng Đạo.</p>`,
    avatar_url: img('tran-hung-dao-avatar', 400, 400),
    cover_url: img('tran-hung-dao', 1200, 600),
    is_featured: true,
    sort_order: 4,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Lê Lợi',
    title: 'Lê Thái Tổ – Người Sáng Lập Hậu Lê',
    slug: 'le-loi',
    era_id: eraMap['Thời Hậu Lê'],
    birth_year: 1385,
    death_year: 1433,
    biography: `<p>Lê Lợi (1385–1433) là người anh hùng áo vải đất Lam Sơn (Thanh Hóa), người đã lãnh đạo cuộc khởi nghĩa 10 năm (1418–1427) đánh đuổi giặc Minh, giành lại độc lập cho dân tộc.</p>
<p>Xuất thân từ một hào trưởng địa phương, Lê Lợi chứng kiến nỗi thống khổ của người dân dưới ách đô hộ tàn bạo của nhà Minh. Năm 1418, ông phát lệnh khởi nghĩa từ Lam Sơn với câu nói bất hủ: <em>"Chúng ta hãy chịu khổ nhục trước, gặp thời cơ sẽ vươn lên"</em>.</p>
<p>Nguyễn Trãi — nhà chiến lược thiên tài — đã trở thành quân sư cho Lê Lợi, đề ra đường lối "lấy nhân nghĩa thắng hung tàn, lấy chí nhân thay cường bạo". Năm 1428, giặc Minh hoàn toàn bị đánh đuổi. Lê Lợi lên ngôi hoàng đế, lập ra triều Hậu Lê.</p>`,
    avatar_url: img('le-loi-avatar', 400, 400),
    cover_url: img('le-loi', 1200, 600),
    is_featured: false,
    sort_order: 5,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Nguyễn Huệ',
    title: 'Hoàng Đế Quang Trung – Anh Hùng Dân Tộc',
    slug: 'nguyen-hue',
    era_id: eraMap['Thời Tây Sơn'],
    birth_year: 1753,
    death_year: 1792,
    biography: `<p>Nguyễn Huệ (1753–1792), còn được biết đến với danh hiệu Hoàng đế Quang Trung, là lãnh tụ kiệt xuất của phong trào Tây Sơn và là một trong những vị vua anh hùng nhất lịch sử Việt Nam.</p>
<p>Năm 1788, nhà Thanh đưa 29 vạn quân xâm lược Đại Việt, chiếm đóng Thăng Long. Nguyễn Huệ lên ngôi hoàng đế lấy hiệu Quang Trung, lập tức kéo đại quân ra Bắc. Chỉ trong 5 ngày đêm hành quân thần tốc, quân Tây Sơn đánh tan hoàn toàn đại quân Thanh.</p>
<blockquote>Đánh cho để dài tóc, Đánh cho để đen răng, Đánh cho nó chích luân bất phản, Đánh cho nó phiến giáp bất hoàn...</blockquote>
<p>Chiến thắng Đống Đa ngày mùng 5 Tết Kỷ Dậu (1789) trở thành biểu tượng của tinh thần chiến đấu kiên cường, mưu trí và sáng tạo của quân dân Đại Việt.</p>`,
    avatar_url: img('nguyen-hue-avatar', 400, 400),
    cover_url: img('nguyen-hue', 1200, 600),
    is_featured: true,
    sort_order: 6,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Lý Thường Kiệt',
    title: 'Đại Tướng Quân – Tác Giả Tuyên Ngôn Độc Lập',
    slug: 'ly-thuong-kiet',
    era_id: eraMap['Thời Lý – Trần'],
    birth_year: 1019,
    death_year: 1105,
    biography: `<p>Lý Thường Kiệt (1019–1105) là danh tướng nhà Lý, người đã chỉ huy thắng lợi hai cuộc chiến tranh: cuộc tấn công phủ đầu vào đất Tống (1075–1076) và cuộc kháng chiến chống Tống xâm lược (1076–1077).</p>
<p>Ông là tác giả của bài thơ <em>"Nam quốc sơn hà"</em> — được coi là bản Tuyên ngôn độc lập đầu tiên của Việt Nam:</p>
<blockquote>Nam quốc sơn hà Nam đế cư, Tiệt nhiên định phận tại thiên thư, Như hà nghịch lỗ lai xâm phạm, Nhữ đẳng hành khan thủ bại hư.</blockquote>
<p>Tương truyền, trong đêm giặc Tống đóng quân ở bờ bắc sông Như Nguyệt (sông Cầu), từ trong đền thờ thần sông vang lên tiếng thơ hào hùng này, làm nhuệ khí quân sĩ Đại Việt dâng cao và kẻ thù kinh hãi.</p>`,
    avatar_url: img('ly-thuong-kiet-avatar', 400, 400),
    cover_url: img('ly-thuong-kiet', 1200, 600),
    is_featured: false,
    sort_order: 7,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Triệu Thị Trinh',
    title: 'Bà Triệu – Nữ Tướng Mặc Giáp Vàng',
    slug: 'trieu-thi-trinh',
    era_id: eraMap['Thời Bắc Thuộc'],
    birth_year: 225,
    death_year: 248,
    biography: `<p>Triệu Thị Trinh (225–248), thường gọi là Bà Triệu, là nữ anh hùng dân tộc Việt Nam ở thế kỷ III. Bà đã lãnh đạo cuộc khởi nghĩa chống lại ách đô hộ của nhà Đông Ngô năm 248.</p>
<p>Khi người anh trai khuyên bà lấy chồng, bà đã khảng khái trả lời:</p>
<blockquote>Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp người ta!</blockquote>
<p>Tương truyền Bà Triệu cao chín thước, vú dài ba thước, thường mặc áo giáp vàng, đi guốc ngà, cài trâm vàng, tóc búi cao, cưỡi voi chiến xông trận. Sau 6 tháng chiến đấu kiên cường, thế địch mạnh hơn, Bà Triệu tự vẫn trên núi Tùng (nay thuộc Thanh Hóa) để giữ trọn khí tiết.</p>`,
    avatar_url: img('ba-trieu-avatar', 400, 400),
    cover_url: img('ba-trieu', 1200, 600),
    is_featured: false,
    sort_order: 8,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
]

// ─── Tags ────────────────────────────────────────────────────────────────────

const TAG_DATA = (adminId) => [
  { name: 'Kháng Chiến', slug: 'khang-chien', created_by: adminId, updated_by: adminId },
  { name: 'Nữ Tướng',    slug: 'nu-tuong',    created_by: adminId, updated_by: adminId },
  { name: 'Triều Đình',  slug: 'trieu-dinh',  created_by: adminId, updated_by: adminId },
  { name: 'Quân Sự',     slug: 'quan-su',     created_by: adminId, updated_by: adminId },
  { name: 'Văn Hóa',     slug: 'van-hoa',     created_by: adminId, updated_by: adminId },
  { name: 'Lịch Sử',     slug: 'lich-su',     created_by: adminId, updated_by: adminId },
  { name: 'Anh Hùng',    slug: 'anh-hung',    created_by: adminId, updated_by: adminId },
  { name: 'Độc Lập',     slug: 'doc-lap',     created_by: adminId, updated_by: adminId },
]

// ─── Articles ────────────────────────────────────────────────────────────────

const ARTICLE_DATA = (authorId, editorId) => [
  {
    title: 'Cuộc Khởi Nghĩa Hai Bà Trưng — Ngọn Lửa Bất Diệt Của Phụ Nữ Việt',
    slug: 'khoi-nghia-hai-ba-trung',
    excerpt: 'Năm 40 sau Công nguyên, Hai Bà Trưng phất cờ khởi nghĩa, lần đầu tiên trong lịch sử phụ nữ Việt Nam nắm quyền lãnh đạo quốc gia, giải phóng 65 thành trì khỏi ách đô hộ của nhà Đông Hán.',
    content: `<h2>Bối Cảnh Lịch Sử</h2>
<p>Vào thế kỷ I sau Công nguyên, đất Giao Chỉ (nay là miền Bắc Việt Nam) đang chìm trong ách đô hộ nặng nề của nhà Đông Hán. Thái thú Tô Định khét tiếng tàn bạo, bóc lột nhân dân bằng những chính sách thuế khóa hà khắc và văn hóa đồng hóa.</p>
<h2>Nguyên Nhân Khởi Nghĩa</h2>
<p>Thi Sách, chồng của Trưng Trắc, một hào trưởng đất Châu Diên đã cùng Trưng Trắc lên kế hoạch khởi nghĩa. Tô Định biết tin, sai người bắt và giết Thi Sách. Thù nhà nợ nước chồng chất, Trưng Trắc quyết định phất cờ khởi nghĩa.</p>
<h2>Diễn Biến Khởi Nghĩa</h2>
<p>Mùa xuân năm 40, tại cửa sông Hát Môn (nay thuộc Hà Nội), Hai Bà Trưng chính thức phát lệnh khởi nghĩa. Khí thế lan nhanh như lửa cháy đồng khô. Hào kiệt khắp nơi hưởng ứng, trong đó có nhiều nữ tướng như Lê Chân, Thiều Hoa, Lê Thị Hoa...</p>
<blockquote>Một xin rửa sạch nước thù<br>Hai xin dựng lại nghiệp xưa họ Hùng<br>Ba kêu oan ức lòng chồng<br>Bốn xin vẹn vẹn sở công lênh này</blockquote>
<p>Chỉ trong vài tháng, nghĩa quân giải phóng được 65 thành trì. Tô Định kinh hoàng bỏ chạy về Trung Quốc. Trưng Trắc lên ngôi vua, đóng đô tại Mê Linh (Vĩnh Phúc ngày nay), xưng là Trưng Nữ Vương.</p>
<h2>Kết Cục Bi Tráng</h2>
<p>Năm 42, Mã Viện — đại tướng nổi tiếng của nhà Hán — dẫn đại quân sang tái chiếm. Sau nhiều trận giao chiến ác liệt, thế địch quá mạnh, hai bà rút về Cẩm Khê. Năm 43, không muốn rơi vào tay giặc, hai bà gieo mình xuống dòng Hát Giang tuẫn tiết.</p>
<h2>Di Sản Lịch Sử</h2>
<p>Dù thất bại về mặt quân sự, cuộc khởi nghĩa Hai Bà Trưng để lại di sản vô cùng to lớn. Hàng trăm đền thờ hai bà được xây dựng khắp cả nước, đặc biệt là Đền Hai Bà Trưng tại Mê Linh và Đền Đồng Nhân tại Hà Nội. Ngày giỗ hai bà (mùng 6 tháng 2 âm lịch) được coi là ngày lễ trọng đại của dân tộc.</p>`,
    cover_url: img('hai-ba-trung-article', 800, 500),
    status: 'published',
    is_featured: true,
    published_at: daysAgo(30),
    author_id: authorId,
    updated_by: authorId,
    view_count: 1847,
  },
  {
    title: 'Chiến Thắng Bạch Đằng 938 — Kết Thúc Ngàn Năm Bắc Thuộc',
    slug: 'chien-thang-bach-dang-938',
    excerpt: 'Chiến thắng Bạch Đằng năm 938 dưới sự chỉ huy thiên tài của Ngô Quyền là cột mốc vàng son, chấm dứt hơn 1.000 năm Bắc thuộc và mở ra kỷ nguyên độc lập tự chủ lâu dài của dân tộc Việt.',
    content: `<h2>Bối Cảnh Trước Trận Đánh</h2>
<p>Sau khi Khúc Hạo thoán ngôi, Kiều Công Tiễn — kẻ phản bội — đã giết chủ là Dương Đình Nghệ để chiếm quyền, rồi cầu cứu vua Nam Hán. Đây là cơ hội để Nam Hán đưa quân tái chiếm đất Việt.</p>
<p>Ngô Quyền — con rể của Dương Đình Nghệ — không để yên. Ông kéo quân từ Ái Châu ra, trừng phạt Kiều Công Tiễn, rồi chuẩn bị đón đánh quân Nam Hán do Hoàng tử Lưu Hoằng Tháo chỉ huy.</p>
<h2>Thiên Tài Bố Trận</h2>
<p>Ngô Quyền nhận định: quân địch phải vào Bắc Việt qua cửa biển sông Bạch Đằng. Ông cho quân đóng cọc gỗ nhọn bịt sắt xuống lòng sông tại những chỗ hiểm yếu. Khi thủy triều lên, cọc chìm dưới nước — thuyền địch không hay biết. Khi thủy triều rút, cọc nhô lên — thuyền địch mắc cạn và bị đâm thủng.</p>
<blockquote>Kế hoạch thần kỳ: dùng thiên nhiên làm vũ khí, biến điểm yếu thành điểm mạnh.</blockquote>
<h2>Diễn Biến Trận Đánh</h2>
<p>Lưu Hoằng Tháo dẫn đại quân vào cửa sông lúc thủy triều đang lên cao. Ngô Quyền cho quân nhỏ ra khiêu chiến rồi giả vờ bại rút vào sâu trong sông. Địch hăm hở đuổi theo...</p>
<p>Khi toàn bộ đoàn thuyền địch đã vượt qua bãi cọc, nước triều bắt đầu rút. Ngô Quyền phát lệnh phản công. Thuyền địch không thoát ra được vì cọc nhô lên chắn đường. Hàng nghìn thuyền chiến bị đâm thủng chìm xuống sông. Lưu Hoằng Tháo tử trận.</p>
<h2>Ý Nghĩa Lịch Sử</h2>
<p>Chiến thắng Bạch Đằng năm 938 kết thúc hoàn toàn thời kỳ Bắc thuộc kéo dài hơn 1.000 năm (từ năm 179 TCN). Ngô Quyền lên ngôi vua, lập ra nước Đại Việt tự chủ. Đây là một trong những chiến thắng vĩ đại nhất trong lịch sử chống ngoại xâm của dân tộc Việt Nam.</p>`,
    cover_url: img('bach-dang-article', 800, 500),
    status: 'published',
    is_featured: true,
    published_at: daysAgo(25),
    author_id: authorId,
    updated_by: authorId,
    view_count: 2341,
  },
  {
    title: 'Trần Hưng Đạo Và Ba Lần Đánh Bại Quân Mông Nguyên',
    slug: 'tran-hung-dao-ba-lan-khang-mong',
    excerpt: 'Với Hịch tướng sĩ bất hủ và chiến lược "vườn không nhà trống", Trần Hưng Đạo đã ba lần đánh tan đội quân Mông Nguyên — đế quốc mạnh nhất thế giới thời đó — bảo vệ vẹn toàn đất nước Đại Việt.',
    content: `<h2>Quân Mông Nguyên — Đế Quốc Mạnh Nhất Thế Giới</h2>
<p>Thế kỷ XIII, đế quốc Mông Cổ của Thành Cát Tư Hãn và con cháu đã chinh phục phần lớn châu Á và châu Âu. Không quốc gia nào có thể cản được sức mạnh quân sự vô địch này — cho đến khi gặp Đại Việt.</p>
<h2>Hịch Tướng Sĩ — Áng Hùng Văn Bất Hủ</h2>
<p>Trước lần kháng chiến thứ hai (1285), Trần Hưng Đạo viết <em>Hịch tướng sĩ</em> — một trong những áng văn yêu nước xuất sắc nhất mọi thời đại:</p>
<blockquote>Ta thường tới bữa quên ăn, nửa đêm vỗ gối, ruột đau như cắt, nước mắt đầm đìa; chỉ giận chưa thể xé thịt lột da, nuốt gan uống máu quân thù...</blockquote>
<h2>Chiến Lược Thiên Tài</h2>
<p><strong>Vườn không nhà trống:</strong> Khi giặc đến, quân dân rút lui, đốt hết lương thực và của cải. Quân Mông Nguyên giỏi tác chiến nhưng không thể sống lâu nếu không có lương thực.</p>
<p><strong>Chiến tranh du kích:</strong> Tránh đối đầu trực tiếp với quân địch ở thế đông, lợi dụng địa hình rừng núi, sông nước để tiêu hao sinh lực địch.</p>
<p><strong>Đánh vào tuyến hậu cần:</strong> Liên tục tấn công đường tiếp tế lương thực của địch.</p>
<h2>Chiến Thắng Bạch Đằng 1288</h2>
<p>Lần thứ ba (1287-1288), khi quân Mông Nguyên đã kiệt sức vì thiếu lương thực, Trần Hưng Đạo phát động tổng phản công. Trên sông Bạch Đằng lịch sử — nơi Ngô Quyền từng dùng cọc nhọn 350 năm trước — lịch sử lặp lại. Toàn bộ đoàn thuyền địch bị tiêu diệt. Toa Đô tử trận, Thoát Hoan phải chui vào ống đồng để chạy trốn.</p>`,
    cover_url: img('tran-hung-dao-article', 800, 500),
    status: 'published',
    is_featured: true,
    published_at: daysAgo(20),
    author_id: editorId,
    updated_by: editorId,
    view_count: 3156,
  },
  {
    title: 'Đại Phá Quân Thanh — Chiến Công Hiển Hách Của Quang Trung',
    slug: 'dai-pha-quan-thanh-quang-trung',
    excerpt: 'Chỉ trong 5 ngày đêm hành quân thần tốc từ Phú Xuân ra Thăng Long, Hoàng đế Quang Trung đã đánh tan 29 vạn quân Thanh, giải phóng Thăng Long vào sáng mùng 5 Tết Kỷ Dậu 1789.',
    content: `<h2>Tình Thế Ngàn Cân Treo Sợi Tóc</h2>
<p>Cuối năm 1788, Lê Chiêu Thống cầu viện nhà Thanh. Tổng đốc Lưỡng Quảng Tôn Sĩ Nghị dẫn 29 vạn quân chia làm 4 đạo tiến vào Đại Việt. Quân Tây Sơn ở Bắc Hà không đủ sức chống đỡ, phải rút về phía Nam.</p>
<h2>Nguyễn Huệ Lên Ngôi Hoàng Đế</h2>
<p>Ngày 25 tháng 11 năm 1788, Nguyễn Huệ lên ngôi hoàng đế tại Phú Xuân (Huế), lấy hiệu Quang Trung. Lễ đăng quang vừa xong, ông lập tức kéo đại quân ra Bắc.</p>
<h2>Hành Quân Thần Tốc</h2>
<p>Từ Phú Xuân đến Thăng Long hơn 700 km. Quân Tây Sơn hành quân cả ngày lẫn đêm, vừa đi vừa tuyển quân thêm. Khắp nơi dân chúng hưởng ứng, thanh niên trai tráng tự nguyện tòng quân.</p>
<blockquote>Đánh cho để dài tóc<br>Đánh cho để đen răng<br>Đánh cho nó chích luân bất phản<br>Đánh cho nó phiến giáp bất hoàn<br>Đánh cho sử tri Nam quốc anh hùng chi hữu chủ</blockquote>
<h2>Trận Đống Đa — Mùng 5 Tết Kỷ Dậu</h2>
<p>Sáng mùng 5 Tết năm 1789, quân Quang Trung ào ạt tấn công. Tướng giặc Sầm Nghi Đống hoảng loạn thắt cổ tự vẫn. Tôn Sĩ Nghị bỏ cả ấn tín chạy tháo thân qua cầu phao sang sông Nhị. Cầu gãy, hàng vạn quân Thanh chết đuối.</p>
<p>Hoàng đế Quang Trung chiến thắng khải hoàn vào Thăng Long giữa tiếng reo hò vang trời của quân dân. Chỉ 5 ngày đêm — kỳ tích quân sự hiếm có trong lịch sử nhân loại.</p>`,
    cover_url: img('quang-trung-article', 800, 500),
    status: 'published',
    is_featured: true,
    published_at: daysAgo(15),
    author_id: editorId,
    updated_by: editorId,
    view_count: 2789,
  },
  {
    title: 'Khởi Nghĩa Lam Sơn — Mười Năm Nếm Mật Nằm Gai',
    slug: 'khoi-nghia-lam-son',
    excerpt: 'Mười năm kháng chiến gian khổ (1418–1427) của nghĩa quân Lam Sơn dưới sự lãnh đạo của Lê Lợi và mưu lược của Nguyễn Trãi đã đánh đuổi hoàn toàn quân Minh xâm lược, khôi phục nền độc lập cho Đại Việt.',
    content: `<h2>Nhà Minh Đô Hộ Đại Việt</h2>
<p>Năm 1407, nhà Minh chiếm Đại Ngu (Việt Nam). 20 năm đô hộ, nhà Minh áp đặt chính sách đồng hóa tàn bạo: đốt sách, xóa văn hóa, bóc lột nhân dân bằng thuế nặng. Người Việt không quên nguồn gốc, lòng yêu nước âm ỉ như lửa dưới tro.</p>
<h2>Lê Lợi Và Nguyễn Trãi</h2>
<p>Năm 1418, hào trưởng Lê Lợi ở Lam Sơn (Thanh Hóa) phát lệnh khởi nghĩa. Nguyễn Trãi — con trai của quan tể tướng nhà Trần, từng bị bắt sang Trung Quốc — đã tìm đến theo phò. Ông đề xuất đường lối:</p>
<blockquote>Lấy nhân nghĩa thắng hung tàn, lấy chí nhân thay cường bạo.</blockquote>
<h2>Mười Năm Gian Khổ</h2>
<p>Những năm đầu, nghĩa quân nhiều lần bị vây đánh, phải chạy lên núi Chí Linh ẩn thân. Có lúc thiếu lương thực đến mức phải ăn vỏ cây, củ rừng. Nhưng Lê Lợi không bao giờ từ bỏ.</p>
<p>Dần dần, lực lượng lớn mạnh. Nhiều tướng tài như Nguyễn Xí, Đinh Lễ, Lê Văn An gia nhập. Vùng giải phóng ngày càng mở rộng từ Thanh Hóa vào đến Nghệ An, rồi tiến ra Bắc.</p>
<h2>Giải Phóng Hoàn Toàn — Bình Ngô Đại Cáo</h2>
<p>Năm 1427, thành Đông Quan (Hà Nội) bị bao vây. Vương Thông xin hàng. Lê Lợi — thể hiện lòng nhân ái phi thường — cho quân Minh về nước an toàn, cấp lương thực và thuyền bè. Nguyễn Trãi viết <em>Bình Ngô Đại Cáo</em> — tuyên ngôn độc lập hùng tráng nhất trong lịch sử dân tộc.</p>`,
    cover_url: img('le-loi-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(12),
    author_id: authorId,
    updated_by: authorId,
    view_count: 1423,
  },
  {
    title: 'Nam Quốc Sơn Hà — Bản Tuyên Ngôn Độc Lập Đầu Tiên',
    slug: 'nam-quoc-son-ha-tuyen-ngon-doc-lap',
    excerpt: 'Bài thơ "Nam quốc sơn hà" tương truyền vang lên trong đêm trước trận quyết chiến sông Như Nguyệt (1077) của Lý Thường Kiệt được coi là bản tuyên ngôn độc lập đầu tiên của dân tộc Việt Nam.',
    content: `<h2>Hoàn Cảnh Ra Đời</h2>
<p>Năm 1076–1077, quân Tống do Quách Quỳ chỉ huy xâm lược Đại Việt, tiến đến bờ bắc sông Như Nguyệt (sông Cầu, Bắc Ninh ngày nay). Hai bên giằng co quyết liệt. Lý Thường Kiệt cho xây chiến tuyến phòng thủ kiên cố dọc nam bờ sông.</p>
<h2>Bài Thơ Thần</h2>
<p>Tương truyền, vào một đêm, từ trong đền thờ thần sông (theo sách sử là thần Trương Hống, Trương Hát) vang lên tiếng thơ:</p>
<blockquote>Nam quốc sơn hà Nam đế cư<br>Tiệt nhiên định phận tại thiên thư<br>Như hà nghịch lỗ lai xâm phạm<br>Nhữ đẳng hành khan thủ bại hư</blockquote>
<p><em>Dịch nghĩa: Núi sông nước Nam, vua Nam ở / Rành rành định phận tại sách trời / Cớ sao lũ giặc sang xâm phạm / Chúng bay sẽ bị đánh tơi bời.</em></p>
<h2>Ý Nghĩa Lịch Sử</h2>
<p>Bài thơ không chỉ là chiến thuật tâm lý chiến giúp nhuệ khí quân sĩ Đại Việt dâng cao. Đây là lần đầu tiên trong lịch sử, người Việt tuyên bố rõ ràng: đất này là của người Việt, do vua Việt cai quản — một tuyên ngôn chủ quyền đanh thép.</p>
<p>Sau bài thơ, Lý Thường Kiệt phát động phản công đêm tối, bất ngờ đánh sang bờ bắc, đánh tan quân Tống. Quách Quỳ xin hàng và rút quân về nước.</p>`,
    cover_url: img('ly-thuong-kiet-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(10),
    author_id: editorId,
    updated_by: editorId,
    view_count: 987,
  },
  {
    title: 'Đinh Bộ Lĩnh Dẹp Loạn 12 Sứ Quân — Thống Nhất Giang Sơn',
    slug: 'dinh-bo-linh-dep-loan-12-su-quan',
    excerpt: 'Sau cái chết của Ngô Quyền, đất nước rơi vào hỗn loạn với 12 sứ quân cát cứ. Đinh Bộ Lĩnh từ đất Hoa Lư đã dần dần dẹp yên tất cả, thống nhất giang sơn và lập ra triều Đinh.',
    content: `<h2>Loạn 12 Sứ Quân</h2>
<p>Năm 944, Ngô Quyền mất. Các con tranh quyền, đất nước loạn lạc. 12 hào trưởng hùng mạnh mỗi người chiếm một vùng, đánh lẫn nhau không ngừng. Nhân dân lầm than, ruộng đồng bỏ hoang, đời sống cực khổ.</p>
<p>12 sứ quân đó là: Ngô Xương Xí (Bình Kiều), Đỗ Cảnh Thạc (Đỗ Động Giang), Trần Lãm (Bố Hải khẩu), Kiều Công Hãn (Phong Châu), Nguyễn Khoan (Tam Đái), Nguyễn Thủ Tiệp (Tiên Du), Lý Khuê (Siêu Loại), Lưu Khánh Đàm (Đằng Châu), Nguyễn Siêu (Tây Phù Liệt), Kiều Thuận (Hồi Hồ), Phạm Bạch Hổ (Đằng Châu), và Dương Huy.</p>
<h2>Đinh Bộ Lĩnh Trưởng Thành</h2>
<p>Đinh Bộ Lĩnh lớn lên ở vùng Hoa Lư hiểm trở (Ninh Bình). Từ nhỏ đã có chí lớn, thường chơi trò "cờ lau tập trận" với bạn bè. Ông tập hợp nghĩa quân, ban đầu theo Trần Lãm, sau độc lập phát triển thế lực.</p>
<h2>Thống Nhất Đất Nước</h2>
<p>Từ năm 965 đến 967, Đinh Bộ Lĩnh lần lượt đánh dẹp từng sứ quân. Kẻ hùng mạnh nhất — Đỗ Cảnh Thạc — cũng phải đầu hàng. Đến năm 967, đất nước được thống nhất hoàn toàn lần đầu tiên sau hơn 20 năm hỗn loạn.</p>
<p>Năm 968, Đinh Bộ Lĩnh lên ngôi hoàng đế, đặt tên nước là <strong>Đại Cồ Việt</strong>, đóng đô tại Hoa Lư, đặt niên hiệu Thái Bình — khẳng định ý chí xây dựng đất nước thái bình thịnh vượng.</p>`,
    cover_url: img('dinh-bo-linh-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(8),
    author_id: authorId,
    updated_by: authorId,
    view_count: 756,
  },
  {
    title: 'Bà Triệu — Tiếng Gầm Của Cọp Cái Núi Nưa',
    slug: 'ba-trieu-nu-tuong-mat-giac-vang',
    excerpt: 'Năm 248, Triệu Thị Trinh — người con gái Thanh Hóa 23 tuổi — cưỡi voi ra trận với câu nói bất hủ "muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ", viết nên trang sử hào hùng của phụ nữ Việt Nam.',
    content: `<h2>Người Con Gái Núi Nưa</h2>
<p>Triệu Thị Trinh sinh ra và lớn lên ở vùng núi Nưa (nay thuộc huyện Triệu Sơn, Thanh Hóa) trong một gia đình có truyền thống võ nghệ. Từ nhỏ, bà đã nổi tiếng về sức mạnh phi thường, tinh thần bất khuất.</p>
<h2>Câu Trả Lời Bất Hủ</h2>
<p>Khi người anh trai Triệu Quốc Đạt khuyên bà lấy chồng, Triệu Thị Trinh đã đáp:</p>
<blockquote>Tôi muốn cưỡi cơn gió mạnh, đạp luồng sóng dữ, chém cá kình ở biển Đông, đánh đuổi quân Ngô, cởi ách nô lệ, chứ không chịu khom lưng làm tì thiếp người ta!</blockquote>
<h2>Khởi Nghĩa Năm 248</h2>
<p>Năm 248, Bà Triệu cùng anh trai phất cờ khởi nghĩa. Đội quân của bà đánh nhiều trận thắng lớn, làm quân Ngô khiếp sợ. Tương truyền giặc Ngô đồn nhau: "Có thể đối mặt với hổ dễ hơn là với vương bà."</p>
<p>Dưới sự chỉ huy của bà, nghĩa quân liên tục tấn công các đồn trại của quân Ngô. Đội kỵ binh voi của bà trở thành nỗi khiếp đảm của kẻ thù.</p>
<h2>Khí Tiết Anh Hùng</h2>
<p>Sau 6 tháng chiến đấu kiên cường, quân địch đông quá — lại dùng nhiều mưu kế xấu xa để phá vỡ tinh thần — nghĩa quân dần thất thế. Không chịu bị bắt, Triệu Thị Trinh tự vẫn trên núi Tùng (Thanh Hóa) ở tuổi 23.</p>
<p>Người đời sau lập đền thờ bà khắp nơi ở Thanh Hóa. Ngày giỗ bà — mùng 22 tháng 2 âm lịch — được tổ chức trọng thể hằng năm.</p>`,
    cover_url: img('ba-trieu-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(6),
    author_id: editorId,
    updated_by: editorId,
    view_count: 634,
  },
  {
    title: 'Nghệ Thuật Quân Sự Việt Nam — Truyền Thống Đánh Giặc Giỏi',
    slug: 'nghe-thuat-quan-su-viet-nam',
    excerpt: 'Trải qua hàng nghìn năm chống ngoại xâm, người Việt đã tích lũy kho tàng nghệ thuật quân sự độc đáo: từ chiến tranh du kích, vườn không nhà trống đến đánh bằng mưu trí hơn bằng sức mạnh.',
    content: `<h2>Đặc Trưng Nghệ Thuật Quân Sự Việt Nam</h2>
<p>Suốt chiều dài lịch sử, dân tộc Việt phải chống lại những kẻ thù mạnh hơn nhiều lần về quân số và trang bị. Điều đó buộc người Việt phải phát triển những chiến thuật đặc thù:</p>
<h3>1. Chiến Tranh Nhân Dân</h3>
<p>Từ thời Hai Bà Trưng đến kháng chiến chống Mỹ, mọi cuộc chiến đấu đều có sự tham gia rộng rãi của nhân dân. Không chỉ quân đội, mà cả người già, phụ nữ, trẻ em đều có thể đóng góp.</p>
<h3>2. Vườn Không Nhà Trống</h3>
<p>Khi giặc mạnh vào, quân ta rút lui, đốt hết lương thực và của cải, không để lại gì cho địch. Quân thù chiếm đất nhưng không có gì để ăn, không thể trụ lâu.</p>
<h3>3. Đánh Bằng Mưu Trí</h3>
<p>Từ bãi cọc Bạch Đằng (938, 1288) đến bẫy địa lôi thời hiện đại, người Việt luôn dùng trí tuệ để bù đắp sự chênh lệch về sức mạnh.</p>
<blockquote>Lấy ít địch nhiều, lấy yếu thắng mạnh, lấy nhân nghĩa thay hung bạo.</blockquote>
<h2>Những Trận Đánh Tiêu Biểu</h2>
<p><strong>Bạch Đằng 938:</strong> Cọc nhọn + thủy triều = phá tan quân Nam Hán.</p>
<p><strong>Như Nguyệt 1077:</strong> Phòng thủ kiên cường + phản công bất ngờ = đánh bại quân Tống.</p>
<p><strong>Tây Kết 1285:</strong> Vườn không nhà trống + chiến tranh du kích = kiệt sức quân Mông.</p>
<p><strong>Đống Đa 1789:</strong> Tốc độ + bất ngờ = đánh tan 29 vạn quân Thanh.</p>`,
    cover_url: img('quan-su-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(4),
    author_id: authorId,
    updated_by: authorId,
    view_count: 512,
  },
  {
    title: 'Phong Tục Thờ Cúng Anh Hùng Trong Văn Hóa Việt',
    slug: 'phong-tuc-tho-cung-anh-hung',
    excerpt: 'Việt Nam có truyền thống lâu đời thờ cúng các anh hùng dân tộc. Từ đền Hai Bà Trưng đến đền Trần Hưng Đạo, những nơi linh thiêng này là biểu tượng của đạo lý uống nước nhớ nguồn.',
    content: `<h2>Truyền Thống Uống Nước Nhớ Nguồn</h2>
<p>Người Việt có câu: "Uống nước nhớ nguồn, ăn quả nhớ kẻ trồng cây." Truyền thống thờ cúng anh hùng dân tộc xuất phát từ triết lý sống sâu sắc này — sự biết ơn những người đã xả thân vì đất nước.</p>
<h2>Các Đền Thờ Nổi Tiếng</h2>
<h3>Đền Hai Bà Trưng (Mê Linh, Hà Nội)</h3>
<p>Được xây dựng từ thế kỷ VI, đây là nơi thờ chính của Hai Bà Trưng. Hằng năm, vào ngày mùng 6 tháng 2 âm lịch, hàng nghìn người từ khắp nơi về đây dự lễ hội.</p>
<h3>Đền Kiếp Bạc (Hải Dương)</h3>
<p>Thờ Trần Hưng Đạo — vị tướng được người đời phong là "Đức Thánh Trần". Đây là một trong những nơi linh thiêng bậc nhất Việt Nam, thu hút hàng triệu người hành hương mỗi năm.</p>
<h3>Lăng Vua Đinh, Vua Lê (Ninh Bình)</h3>
<p>Khu di tích lịch sử Hoa Lư — kinh đô đầu tiên của Đại Cồ Việt — là nơi thờ Đinh Tiên Hoàng và Lê Đại Hành.</p>
<h2>Ý Nghĩa Văn Hóa</h2>
<p>Việc thờ cúng anh hùng không chỉ là tín ngưỡng tâm linh, mà còn là cách người Việt duy trì ký ức lịch sử, truyền lại cho thế hệ sau niềm tự hào dân tộc và ý chí bất khuất của ông cha.</p>`,
    cover_url: img('van-hoa-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(3),
    author_id: editorId,
    updated_by: editorId,
    view_count: 389,
  },
  {
    title: 'Tổng Quan Các Thời Kỳ Lịch Sử Việt Nam',
    slug: 'tong-quan-lich-su-viet-nam',
    excerpt: 'Từ thời Hùng Vương dựng nước đến hiện đại, lịch sử Việt Nam là bản trường ca bất tận của tinh thần yêu nước, ý chí quật cường và khát vọng độc lập tự do.',
    content: `<h2>Dòng Chảy Lịch Sử</h2>
<p>Lịch sử Việt Nam trải dài hàng nghìn năm, với những thăng trầm đặc biệt. Dù bị áp bức, đô hộ trong hàng nghìn năm, người Việt không bao giờ mất đi bản sắc và ý chí độc lập.</p>
<h2>Các Giai Đoạn Chính</h2>
<h3>Thời Hùng Vương (2879 TCN – 258 TCN)</h3>
<p>Nước Văn Lang ra đời với 18 đời Vua Hùng, đặt nền móng cho nền văn minh và bản sắc dân tộc Việt. Truyền thuyết Lạc Long Quân và Âu Cơ là biểu tượng của nguồn gốc dân tộc.</p>
<h3>Thời Bắc Thuộc (179 TCN – 938)</h3>
<p>Hơn 1.000 năm đô hộ nhưng không diệt được tinh thần Việt. Các cuộc khởi nghĩa không ngừng: Hai Bà Trưng, Bà Triệu, Lý Bí, Phùng Hưng, Khúc Thừa Dụ...</p>
<h3>Độc Lập Tự Chủ</h3>
<p>Từ chiến thắng Bạch Đằng 938, dân tộc Việt chính thức bước vào kỷ nguyên độc lập tự chủ. Các triều đại Ngô, Đinh, Tiền Lê, Lý, Trần, Lê nối tiếp nhau xây dựng và bảo vệ đất nước.</p>
<h2>Di Sản Để Lại</h2>
<p>Mỗi giai đoạn lịch sử để lại những di sản quý báu: văn hóa, kiến trúc, văn học, nghệ thuật quân sự và trên hết là tinh thần yêu nước bất diệt.</p>`,
    cover_url: img('lich-su-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(2),
    author_id: authorId,
    updated_by: authorId,
    view_count: 445,
  },
  {
    title: 'Di Sản Anh Hùng Trong Đời Sống Hiện Đại',
    slug: 'di-san-anh-hung-doi-song-hien-dai',
    excerpt: 'Tên tuổi và tinh thần của các anh hùng dân tộc vẫn hiện diện khắp nơi trong đời sống người Việt hiện đại — từ tên đường phố, trường học đến ngày lễ và nghệ thuật.',
    content: `<h2>Anh Hùng Trong Tên Đường, Tên Phố</h2>
<p>Khắp Việt Nam, tên của các anh hùng dân tộc được đặt cho đường phố, trường học, bệnh viện, quảng trường. Hai Bà Trưng, Đinh Tiên Hoàng, Lý Thường Kiệt, Trần Hưng Đạo, Lê Lợi, Quang Trung — những cái tên này không chỉ là tên đường, mà là lời nhắc nhở về lịch sử mỗi ngày.</p>
<h2>Lễ Hội Và Ngày Kỷ Niệm</h2>
<p>Nhiều ngày lễ truyền thống gắn liền với các anh hùng:</p>
<ul>
<li>Giỗ Hai Bà Trưng: mùng 6 tháng 2 âm lịch</li>
<li>Ngày Giỗ Tổ Hùng Vương: mùng 10 tháng 3 âm lịch (Quốc lễ)</li>
<li>Ngày Kỷ niệm Chiến thắng Đống Đa: mùng 5 Tết</li>
</ul>
<h2>Trong Văn Học Và Nghệ Thuật</h2>
<p>Các anh hùng dân tộc là nguồn cảm hứng vô tận cho thơ ca, tiểu thuyết, điện ảnh, hội họa. Từ những bài thơ trong sách giáo khoa đến phim lịch sử hiện đại, hình ảnh các anh hùng luôn sống mãi trong tâm thức người Việt.</p>
<h2>Ý Nghĩa Với Thế Hệ Trẻ</h2>
<p>Trong thời đại toàn cầu hóa, việc hiểu và trân trọng lịch sử dân tộc càng trở nên quan trọng hơn bao giờ hết. Những câu chuyện về Hai Bà Trưng dũng cảm, về Trần Hưng Đạo mưu trí, về Quang Trung thần tốc — là nguồn sức mạnh tinh thần để thế hệ trẻ Việt Nam bước vào tương lai với niềm tự hào và bản lĩnh.</p>`,
    cover_url: img('hien-dai-article', 800, 500),
    status: 'published',
    is_featured: false,
    published_at: daysAgo(1),
    author_id: editorId,
    updated_by: editorId,
    view_count: 203,
  },
]

// ─── Donation Tiers ───────────────────────────────────────────────────────────

const DONATION_TIER_DATA = (adminId) => [
  {
    name: 'Đồng',
    amount_min: 10000,
    amount_max: 49999,
    perks: ['Tên trong danh sách hỗ trợ', 'Huy hiệu Đồng'],
    color: '#CD7F32',
    sort_order: 1,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Bạc',
    amount_min: 50000,
    amount_max: 199999,
    perks: ['Tên nổi bật trong danh sách', 'Huy hiệu Bạc', 'Nội dung độc quyền'],
    color: '#C0C0C0',
    sort_order: 2,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Vàng',
    amount_min: 200000,
    amount_max: 999999,
    perks: ['Tên và ảnh nổi bật', 'Huy hiệu Vàng', 'Nội dung độc quyền', 'Được tham vấn nội dung'],
    color: '#FFD700',
    sort_order: 3,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
  {
    name: 'Bạch Kim',
    amount_min: 1000000,
    amount_max: null,
    perks: ['Tên và logo nổi bật trang chủ', 'Huy hiệu Bạch Kim', 'Toàn quyền truy cập', 'Được đề xuất chủ đề bài viết'],
    color: '#E5E4E2',
    sort_order: 4,
    is_active: true,
    created_by: adminId,
    updated_by: adminId,
  },
]

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  try {
    console.log('🔌 Kết nối database...')
    await sequelize.authenticate()
    console.log('✅ Kết nối thành công.\n')

    // Sync models (alter: true sẽ thêm cột is_featured vào articles nếu chưa có)
    console.log('🔄 Sync models (alter)...')
    await sequelize.sync({ alter: true })
    console.log('✅ Sync xong.\n')

    // ── 1. Users ──────────────────────────────────────────────────────────────
    console.log('👤 Tạo users...')
    const [admin] = await User.findOrCreate({
      where: { email: 'admin@suvietanhhung.vn' },
      defaults: {
        username: 'admin',
        email: 'admin@suvietanhhung.vn',
        password: 'Admin@123456',
        role: 'superadmin',
        is_active: true,
      },
    })

    const [editor] = await User.findOrCreate({
      where: { email: 'editor@suvietanhhung.vn' },
      defaults: {
        username: 'editor01',
        email: 'editor@suvietanhhung.vn',
        password: 'Editor@123456',
        role: 'editor',
        is_active: true,
      },
    })

    const [viewer] = await User.findOrCreate({
      where: { email: 'viewer@suvietanhhung.vn' },
      defaults: {
        username: 'viewer01',
        email: 'viewer@suvietanhhung.vn',
        password: 'Viewer@123456',
        role: 'viewer',
        is_active: true,
      },
    })

    console.log(`  ✅ admin: ${admin.email} (${admin.dataValues.id ? 'mới' : 'đã có'})`)
    console.log(`  ✅ editor: ${editor.email}`)
    console.log(`  ✅ viewer: ${viewer.email}\n`)

    const adminId = admin.id
    const editorId = editor.id

    // ── 2. Eras ───────────────────────────────────────────────────────────────
    console.log('🏛  Tạo eras...')
    const eraMap = {}
    for (const eraData of ERA_DATA) {
      const [era] = await Era.findOrCreate({
        where: { name: eraData.name },
        defaults: { ...eraData, created_by: adminId, updated_by: adminId },
      })
      eraMap[era.name] = era.id
    }
    console.log(`  ✅ ${Object.keys(eraMap).length} thời đại\n`)

    // ── 3. Heroes ─────────────────────────────────────────────────────────────
    console.log('⚔️  Tạo heroes...')
    const heroMap = {}
    for (const heroData of HERO_DATA(eraMap, adminId)) {
      const [hero] = await Hero.findOrCreate({
        where: { slug: heroData.slug },
        defaults: heroData,
      })
      heroMap[heroData.slug] = hero.id
    }
    console.log(`  ✅ ${Object.keys(heroMap).length} anh hùng\n`)

    // ── 4. Tags ───────────────────────────────────────────────────────────────
    console.log('🏷  Tạo tags...')
    const tagMap = {}
    for (const tagData of TAG_DATA(adminId)) {
      const [tag] = await Tag.findOrCreate({
        where: { slug: tagData.slug },
        defaults: tagData,
      })
      tagMap[tagData.slug] = tag.id
    }
    console.log(`  ✅ ${Object.keys(tagMap).length} tags\n`)

    // ── 5. Articles ───────────────────────────────────────────────────────────
    console.log('📄 Tạo articles...')
    const articleMap = {}
    for (const articleData of ARTICLE_DATA(adminId, editorId)) {
      const [article] = await Article.findOrCreate({
        where: { slug: articleData.slug },
        defaults: articleData,
      })
      articleMap[articleData.slug] = article.id
    }
    console.log(`  ✅ ${Object.keys(articleMap).length} bài viết\n`)

    // ── 6. Article ↔ Hero relations ───────────────────────────────────────────
    console.log('🔗 Tạo article-hero relations...')
    const articleHeroLinks = [
      { article: 'khoi-nghia-hai-ba-trung',         heroes: ['hai-ba-trung'] },
      { article: 'chien-thang-bach-dang-938',        heroes: ['ngo-quyen'] },
      { article: 'tran-hung-dao-ba-lan-khang-mong',  heroes: ['tran-hung-dao'] },
      { article: 'dai-pha-quan-thanh-quang-trung',   heroes: ['nguyen-hue'] },
      { article: 'khoi-nghia-lam-son',               heroes: ['le-loi'] },
      { article: 'nam-quoc-son-ha-tuyen-ngon-doc-lap', heroes: ['ly-thuong-kiet'] },
      { article: 'dinh-bo-linh-dep-loan-12-su-quan', heroes: ['dinh-bo-linh'] },
      { article: 'ba-trieu-nu-tuong-mat-giac-vang',  heroes: ['trieu-thi-trinh'] },
      { article: 'nghe-thuat-quan-su-viet-nam',      heroes: ['tran-hung-dao', 'ngo-quyen', 'nguyen-hue'] },
      { article: 'phong-tuc-tho-cung-anh-hung',      heroes: ['hai-ba-trung', 'tran-hung-dao', 'dinh-bo-linh'] },
    ]

    for (const { article, heroes } of articleHeroLinks) {
      const articleId = articleMap[article]
      if (!articleId) continue
      for (const heroSlug of heroes) {
        const heroId = heroMap[heroSlug]
        if (!heroId) continue
        await ArticleHero.findOrCreate({ where: { article_id: articleId, hero_id: heroId } })
      }
    }
    console.log('  ✅ Xong\n')

    // ── 7. Article ↔ Tag relations ────────────────────────────────────────────
    console.log('🔗 Tạo article-tag relations...')
    const articleTagLinks = [
      { article: 'khoi-nghia-hai-ba-trung',          tags: ['khang-chien', 'nu-tuong', 'doc-lap', 'anh-hung'] },
      { article: 'chien-thang-bach-dang-938',         tags: ['khang-chien', 'quan-su', 'doc-lap'] },
      { article: 'tran-hung-dao-ba-lan-khang-mong',   tags: ['khang-chien', 'quan-su', 'anh-hung'] },
      { article: 'dai-pha-quan-thanh-quang-trung',    tags: ['khang-chien', 'quan-su', 'doc-lap', 'anh-hung'] },
      { article: 'khoi-nghia-lam-son',                tags: ['khang-chien', 'doc-lap', 'lich-su'] },
      { article: 'nam-quoc-son-ha-tuyen-ngon-doc-lap', tags: ['doc-lap', 'lich-su', 'anh-hung'] },
      { article: 'dinh-bo-linh-dep-loan-12-su-quan',  tags: ['trieu-dinh', 'lich-su', 'anh-hung'] },
      { article: 'ba-trieu-nu-tuong-mat-giac-vang',   tags: ['nu-tuong', 'khang-chien', 'anh-hung'] },
      { article: 'nghe-thuat-quan-su-viet-nam',       tags: ['quan-su', 'lich-su'] },
      { article: 'phong-tuc-tho-cung-anh-hung',       tags: ['van-hoa', 'lich-su'] },
      { article: 'tong-quan-lich-su-viet-nam',        tags: ['lich-su', 'van-hoa'] },
      { article: 'di-san-anh-hung-doi-song-hien-dai', tags: ['van-hoa', 'anh-hung'] },
    ]

    for (const { article, tags } of articleTagLinks) {
      const articleId = articleMap[article]
      if (!articleId) continue
      for (const tagSlug of tags) {
        const tagId = tagMap[tagSlug]
        if (!tagId) continue
        await ArticleTag.findOrCreate({ where: { article_id: articleId, tag_id: tagId } })
      }
    }
    console.log('  ✅ Xong\n')

    // ── 8. Donation Tiers ─────────────────────────────────────────────────────
    console.log('💰 Tạo donation tiers...')
    for (const tierData of DONATION_TIER_DATA(adminId)) {
      await DonationTier.findOrCreate({
        where: { name: tierData.name },
        defaults: tierData,
      })
    }
    console.log('  ✅ 4 tầng quyên góp\n')

    // ── Summary ───────────────────────────────────────────────────────────────
    console.log('═══════════════════════════════════════════')
    console.log('🎉 SEED HOÀN TẤT!')
    console.log('═══════════════════════════════════════════')
    console.log('\n📋 Tài khoản đăng nhập:')
    console.log('  👑 Superadmin : admin@suvietanhhung.vn   / Admin@123456')
    console.log('  ✍️  Editor     : editor@suvietanhhung.vn  / Editor@123456')
    console.log('  👁  Viewer     : viewer@suvietanhhung.vn  / Viewer@123456')
    console.log('\n📊 Dữ liệu đã tạo:')
    console.log(`  🏛  ${ERA_DATA.length} thời đại lịch sử`)
    console.log(`  ⚔️  ${Object.keys(heroMap).length} anh hùng dân tộc`)
    console.log(`  🏷  ${Object.keys(tagMap).length} tags`)
    console.log(`  📄 ${Object.keys(articleMap).length} bài viết (4 nổi bật)`)
    console.log('  💰 4 tầng quyên góp\n')

  } catch (err) {
    console.error('❌ LỖI:', err.message)
    if (err.errors) err.errors.forEach(e => console.error('  -', e.message))
    process.exit(1)
  } finally {
    await sequelize.close()
    console.log('🔌 Đóng kết nối database.')
  }
}

seed()
