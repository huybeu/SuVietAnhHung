import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const LEADER_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCJOZOokhcFoQvpJioq8a8l6mBekKDN0J62jLD7b_I7c6R8_tXi1OWqRdXSZS5wsIkDdc9JEO3hBTRuBGApVXQk6xNVu9ip-C2T1fca1oeRl57XRnhkQDW7DXc9xGCV0U92uzimuMmVHXVf3zunKKsZjd8SS1e_8srDiH0w2LARXvlTAB5U48ZBogHMMK-xQEbtBG1-CIlcKJBBnY7or30AWoWAsfH8FQEmVdQMhxagdZAyQmjDiPffWwfGGj4NuWshN3BIzYjtVg8";

const VIDEO_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAAgMOdcQ-_kkn6_kwCc8PNubsmbqokwETghyhsBnM964W39p0dKLcEtMtrXYId2lXXTqcjWqUo-hhV62FilL1w1eqDx8bP1Xpy5sBylePikEd2MJKGKcuENxMAufJsdjZHo3encalJ6xJcUWuOHrONBZSuZ3umZUfA42ZfQnAJyH74KikOEnI49wzupE_fQ6Mj8WjsjcJitmPOShU7z1OaWX0SJWvPWNuICWSsRSngtC2jHSMWw28Hwj3LX_DfSlg5vbKcRDJx3e0";

const QR_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCSRKbdVrNCOtyunpvDWauBhkS5QH4iZ_bwOrPlJVCoW3Uvpe4Gu8oSNmE5XewufaKA1AttDkhv6nHbxkwxM_hfl6K1WLlkRG36oWp9pu-WKCYsCKerpIl7Cwk3Z4v2AlnbGzFMw3gAKR_3OBeP8Fsg5wPP0DI3nmo1_SHLkgbG5RwpCCWtHkLRnKR3Vfu6WYcdKmVMwUfvH6M";

const TARGET_DATE = new Date("2027-05-05T00:00:00");

function getTimeLeft() {
  const now = new Date();
  const diff = TARGET_DATE - now;
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(n) {
  return String(n).padStart(2, "0");
}

const MARQUEE_NAMES_LEFT =
  "Nguyễn Văn An • Trần Thị Bích • Lê Minh Đức • Phạm Thu Hà • Hoàng Quốc Bảo • Vũ Thị Lan • Đặng Hữu Phước • Bùi Thị Ngọc • Ngô Văn Thành • Lý Thị Mai • Đinh Xuân Hùng • Cao Thị Thanh • ".repeat(3);

const MARQUEE_NAMES_RIGHT =
  "Trịnh Thị Hoa • Dương Văn Minh • Tô Thị Xuân • Hồ Văn Long • Nguyễn Thị Dung • Lê Văn Quân • Phạm Thị Yến • Hoàng Văn Dũng • Vũ Thị Phương • Đặng Văn Khoa • Bùi Thị Hằng • Ngô Thị Linh • ".repeat(3);

const TIMELINE = [
  {
    period: "Thời Hồng Bàng",
    years: "2879 TCN – 258 TCN",
    desc: "Khởi nguồn dân tộc Việt, thời đại các Vua Hùng dựng nước Văn Lang. Nền văn minh lúa nước, trống đồng Đông Sơn vang vọng ngàn đời.",
    color: "#7B4A00",
    dotBorder: "#FAE8DA",
    align: "right",
  },
  {
    period: "Thời Bắc Thuộc",
    years: "111 TCN – 938 SCN",
    desc: "Hơn 1000 năm đô hộ phương Bắc nhưng không thể dập tắt ngọn lửa yêu nước. Hai Bà Trưng, Lý Bí, Mai Thúc Loan... những anh hùng bất khuất.",
    color: "#5C3A1E",
    dotBorder: "#FAE8DA",
    align: "left",
  },
  {
    period: "Thời Phong Kiến Độc Lập",
    years: "938 – 1884",
    desc: "Ngô Quyền chiến thắng Bạch Đằng, mở ra kỷ nguyên độc lập. Các triều đại Đinh, Lý, Trần, Lê... xây dựng nền văn hiến rực rỡ.",
    color: "#C4956A",
    dotBorder: "#FAE8DA",
    align: "right",
  },
  {
    period: "Cận – Hiện Đại",
    years: "1884 – Nay",
    desc: "Chống Pháp, chống Mỹ, thống nhất đất nước. Hồ Chí Minh, Võ Nguyên Giáp... những huyền thoại của thế kỷ XX.",
    color: "#8B1A1A",
    dotBorder: "#FAE8DA",
    align: "left",
  },
];

const TIERS = [
  {
    name: "Đồng Hành",
    price: "100.000đ",
    icon: "volunteer_activism",
    perks: [
      "Tên trong danh sách tri ân",
      "Wallpaper lịch sử độc quyền",
      "Bản tin điện tử hàng tháng",
    ],
    highlighted: false,
  },
  {
    name: "Hào Kiệt",
    price: "500.000đ",
    icon: "military_tech",
    perks: [
      "Tất cả quyền lợi Đồng Hành",
      "Sách điện tử Sử Việt Anh Hùng",
      "Tên khắc trên Bảng Danh Dự",
      "Xem trước phim ngắn",
    ],
    highlighted: true,
  },
  {
    name: "Anh Hùng",
    price: "2.000.000đ",
    icon: "emoji_events",
    perks: [
      "Tất cả quyền lợi Hào Kiệt",
      "Sách in ấn có chữ ký tác giả",
      "Được phỏng vấn trong phim tài liệu",
      "Gặp gỡ nhóm sản xuất",
    ],
    highlighted: false,
  },
];

const STATS_HONOR = [
  { label: "Người Đóng Góp", value: "1,247" },
  { label: "Tỉnh Thành", value: "63" },
  { label: "Quốc Gia", value: "12" },
  { label: "Triệu Đồng", value: "623" },
];

export default function LandingPage() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  /* ── Countdown ── */
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── Reveal on scroll ── */
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("revealed");
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen" style={{ background: "#FDF5EE", color: "#3D2B1A" }}>

      {/* ── Scoped animations ── */}
      <style>{`
        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.4; }
        }
        .bounce-arrow { animation: bounce-arrow 1.8s ease-in-out infinite; }

        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }

        .video-thumb {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          cursor: pointer;
          box-shadow: 0 2px 12px rgba(61,43,26,0.1);
        }
        .video-thumb img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          transition: transform 0.4s;
          filter: brightness(0.85);
        }
        .video-thumb:hover img {
          transform: scale(1.05);
          filter: brightness(0.65);
        }
        .video-thumb .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          background: rgba(139,26,26,0.12);
        }
        .video-thumb:hover .play-overlay { opacity: 1; }

        .mission-img-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          box-shadow: 0 4px 24px rgba(61,43,26,0.12);
        }
        .mission-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(20%);
          transition: filter 0.6s;
        }
        .mission-img-wrap:hover img { filter: grayscale(0%); }
        .mission-img-wrap .deco-ring {
          position: absolute;
          inset: -8px;
          border: 0.5px solid rgba(139,26,26,0.25);
          border-radius: 1rem;
          pointer-events: none;
        }
        .mission-img-wrap .deco-ring-2 {
          position: absolute;
          inset: -16px;
          border: 0.5px solid rgba(196,149,106,0.18);
          border-radius: 1.25rem;
          pointer-events: none;
        }

        .progress-fill {
          background: linear-gradient(90deg, #8B1A1A, #C4956A);
          height: 100%;
          border-radius: 9999px;
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        .reveal {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity 0.75s ease, transform 0.75s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left { animation: marquee-left 30s linear infinite; display: flex; white-space: nowrap; }
        .marquee-right { animation: marquee-right 30s linear infinite; display: flex; white-space: nowrap; }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-14px); }
        }
        .float-anim { animation: float 5s ease-in-out infinite; }

        .tier-card {
          border: 0.5px solid #D4B896;
          border-radius: 12px;
          padding: 2rem;
          background: #FDF5EE;
          box-shadow: 0 2px 12px rgba(61,43,26,0.07);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .tier-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 32px rgba(139,26,26,0.12);
        }
        .tier-card.highlighted {
          border-color: #C4956A;
          background: #FDF5EE;
          box-shadow: 0 4px 24px rgba(196,149,106,0.15);
          transform: scale(1.04);
        }
        .tier-card.highlighted:hover {
          transform: scale(1.04) translateY(-5px);
          box-shadow: 0 16px 40px rgba(196,149,106,0.2);
        }
      `}</style>

      {/* ── Navbar ── */}
      <Navbar activePage="khoi-kien" />

      {/* ════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
          background: "linear-gradient(180deg, #FDF5EE 0%, #FAE8DA 55%, #F5D5C0 100%)",
        }}
      >
        {/* Đông Sơn grid overlay */}
        <div className="dong-son-bg" style={{ position: "absolute", inset: 0, zIndex: 0 }} />

        {/* Warm glow */}
        <div
          style={{
            position: "absolute",
            top: "25%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            background: "radial-gradient(ellipse, rgba(139,26,26,0.06) 0%, transparent 70%)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "820px",
            padding: "0 1.5rem",
            paddingTop: "90px",
          }}
        >
          {/* Floating castle icon */}
          <div className="float-anim" style={{ marginBottom: "2.5rem", display: "inline-block" }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <span
                className="animate-pulse"
                style={{
                  position: "absolute",
                  inset: "-14px",
                  borderRadius: "50%",
                  border: "1.5px solid #C4956A",
                  display: "block",
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "72px",
                  color: "#8B1A1A",
                  fontVariationSettings: '"FILL" 1',
                  filter: "drop-shadow(0 4px 16px rgba(139,26,26,0.25))",
                }}
              >
                castle
              </span>
            </div>
          </div>

          {/* Label */}
          <p
            style={{
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#8B1A1A",
              marginBottom: "1rem",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}
          >
            Dự án bảo tồn lịch sử cộng đồng
          </p>

          {/* H1 — Playfair Display #8B1A1A */}
          <h1 style={{ marginBottom: "1.25rem", lineHeight: 1.15, fontFamily: "'Playfair Display', serif" }}>
            <span
              style={{
                display: "block",
                fontSize: "clamp(2.4rem, 7vw, 4.5rem)",
                fontWeight: 700,
                color: "#8B1A1A",
                letterSpacing: "-0.01em",
              }}
            >
              Giữ Lấy Sử Việt
            </span>
            {/* H2 — Lora italic #7B4A00 */}
            <span
              style={{
                display: "block",
                fontSize: "clamp(0.95rem, 2.5vw, 1.35rem)",
                fontWeight: 600,
                color: "#7B4A00",
                marginTop: "0.6rem",
                letterSpacing: "0.06em",
                fontFamily: "'Lora', serif",
                fontStyle: "italic",
              }}
            >
              Giữ truyền thống yêu nước, giữ hồn dân tộc ngàn đời
            </span>
          </h1>

          {/* Decorative divider */}
          <div
            style={{
              height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(196,149,106,0.45), transparent)",
              maxWidth: "320px",
              margin: "0 auto 1.5rem",
            }}
          />

          {/* Quote — Merriweather italic */}
          <blockquote
            style={{
              fontFamily: "'Merriweather', serif",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#5C3A1E",
              fontSize: "0.97rem",
              maxWidth: "520px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.9,
              borderLeft: "2px solid #C4956A",
              paddingLeft: "1rem",
              textAlign: "left",
            }}
          >
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."
            <footer style={{ color: "#A0794E", fontSize: "0.82rem", fontStyle: "normal", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, marginTop: "0.5rem" }}>
              — Hồ Chí Minh
            </footer>
          </blockquote>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              style={{
                background: "#8B1A1A",
                color: "#FDF5EE",
                border: "none",
                borderRadius: "8px",
                padding: "0.9rem 2.25rem",
                fontWeight: 700,
                fontSize: "0.85rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 18px rgba(139,26,26,0.32)",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#6B1414";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 28px rgba(139,26,26,0.38)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#8B1A1A";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 18px rgba(139,26,26,0.32)";
              }}
            >
              KHÁM PHÁ NGAY
            </button>
            <button
              style={{
                background: "transparent",
                color: "#7B4A00",
                border: "1px solid #C4956A",
                borderRadius: "8px",
                padding: "0.9rem 2.25rem",
                fontWeight: 600,
                fontSize: "0.85rem",
                letterSpacing: "0.08em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,149,106,0.10)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "";
              }}
            >
              XEM PHIM NGẮN
            </button>
          </div>
        </div>

        {/* Bounce arrow */}
        <div
          className="bounce-arrow"
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(196,149,106,0.55)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "32px" }}>
            keyboard_double_arrow_down
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. PROGRESS & COUNTDOWN
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{ padding: "6rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Left card: progress + countdown */}
          <div
            style={{
              background: "#FDF5EE",
              border: "0.5px solid #D4B896",
              borderRadius: "12px",
              padding: "2rem",
              boxShadow: "0 2px 12px rgba(61,43,26,0.07)",
            }}
          >
            {/* H3 — Playfair Display */}
            <h2
              style={{ color: "#C4956A", fontSize: "1.1rem", marginBottom: "0.5rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              Tiến Độ Gây Quỹ
            </h2>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", fontSize: "0.88rem" }}>
              <span style={{ color: "#8B1A1A", fontWeight: 700, fontFamily: "'Be Vietnam Pro', sans-serif" }}>623 triệu đồng</span>
              <span style={{ color: "#A0794E", fontFamily: "'Be Vietnam Pro', sans-serif" }}>Mục tiêu: 830 triệu</span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: "10px",
                background: "rgba(61,43,26,0.08)",
                borderRadius: "9999px",
                overflow: "hidden",
                marginBottom: "0.5rem",
              }}
            >
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
            <p style={{ color: "#A0794E", fontSize: "0.78rem", marginBottom: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              75% mục tiêu đạt được • 1,247 người đóng góp
            </p>

            {/* Countdown */}
            <h3
              style={{ color: "#C4956A", fontSize: "0.9rem", marginBottom: "1rem", fontFamily: "'Playfair Display', serif" }}
            >
              Thời Gian Còn Lại
            </h3>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
              {[
                { val: timeLeft.days, label: "Ngày" },
                { val: timeLeft.hours, label: "Giờ" },
                { val: timeLeft.minutes, label: "Phút" },
                { val: timeLeft.seconds, label: "Giây" },
              ].map(({ val, label }) => (
                <div key={label} style={{ textAlign: "center", flex: 1 }}>
                  <div
                    style={{
                      background: "#FAE8DA",
                      border: "0.5px solid rgba(139,26,26,0.18)",
                      borderRadius: "8px",
                      padding: "0.75rem 0.25rem",
                      fontSize: "1.7rem",
                      fontWeight: 700,
                      color: "#8B1A1A",
                      fontFamily: "'Be Vietnam Pro', monospace",
                    }}
                  >
                    {pad(val)}
                  </div>
                  <div style={{ fontSize: "0.68rem", color: "#A0794E", marginTop: "0.35rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right card: content items */}
          <div
            style={{
              background: "#FDF5EE",
              border: "0.5px solid #D4B896",
              borderRadius: "12px",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.75rem",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(61,43,26,0.07)",
            }}
          >
            {[
              {
                icon: "menu_book",
                title: "Bộ Sách Lịch Sử",
                desc: "Tái hiện 4000 năm lịch sử Việt qua góc nhìn học thuật và nghệ thuật, phù hợp mọi lứa tuổi.",
              },
              {
                icon: "movie",
                title: "Phim Tài Liệu",
                desc: "Series phim ngắn kể lại những trận chiến huyền thoại, những anh hùng bất khuất của dân tộc.",
              },
            ].map(({ icon, title, desc }) => (
              <div key={icon} style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
                <div
                  style={{
                    background: "#FAE8DA",
                    border: "0.5px solid rgba(139,26,26,0.15)",
                    borderRadius: "12px",
                    padding: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  <span className="material-symbols-outlined" style={{ color: "#8B1A1A", fontSize: "26px" }}>
                    {icon}
                  </span>
                </div>
                <div>
                  <h4
                    style={{ color: "#3D2B1A", marginBottom: "0.35rem", fontSize: "0.95rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                  >
                    {title}
                  </h4>
                  <p style={{ color: "#5C3A1E", fontSize: "0.87rem", lineHeight: 1.65, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          3. MISSION & VIDEOS
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#FAE8DA",
          borderTop: "0.5px solid #D4B896",
          borderBottom: "0.5px solid #D4B896",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Mission row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3.5rem",
              alignItems: "center",
              marginBottom: "5rem",
            }}
          >
            {/* Left: image */}
            <div className="mission-img-wrap" style={{ height: "360px" }}>
              <img src={LEADER_IMG} alt="Lãnh đạo dự án" />
              <div className="deco-ring" />
              <div className="deco-ring-2" />
            </div>

            {/* Right: text + stats */}
            <div>
              <p
                style={{
                  color: "#8B1A1A",
                  fontSize: "0.72rem",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  marginBottom: "0.6rem",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 600,
                }}
              >
                Về Chúng Tôi
              </p>
              {/* H2 — Playfair Display */}
              <h2
                style={{
                  color: "#3D2B1A",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  marginBottom: "1.25rem",
                  lineHeight: 1.3,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                }}
              >
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <div style={{ height: "1px", background: "linear-gradient(90deg, #C4956A, transparent)", marginBottom: "1.25rem", maxWidth: "60px" }} />
              <p
                style={{
                  color: "#5C3A1E",
                  lineHeight: 1.85,
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              >
                Chúng tôi tin rằng lịch sử không chỉ là những trang sách khô khan.
                Lịch sử là máu, là nước mắt, là tinh thần bất khuất của 100 triệu
                người Việt. Dự án này ra đời để thắp lại ngọn lửa tự hào dân tộc
                trong trái tim thế hệ trẻ.
              </p>

              {/* Stats */}
              <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
                {[
                  { val: "10 vạn+", label: "Độc giả" },
                  { val: "36 triệu", label: "Lượt xem" },
                  { val: "1000+", label: "Bài viết" },
                ].map(({ val, label }) => (
                  <div key={label}>
                    <div style={{ fontSize: "1.5rem", color: "#8B1A1A", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                      {val}
                    </div>
                    <div style={{ color: "#A0794E", fontSize: "0.78rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video grid */}
          <p
            style={{
              color: "#8B1A1A",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              textAlign: "center",
              marginBottom: "0.5rem",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}
          >
            Kho Tư Liệu
          </p>
          <h3
            style={{
              color: "#3D2B1A",
              textAlign: "center",
              marginBottom: "2.5rem",
              fontSize: "1.4rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
            }}
          >
            Kho Phim Lịch Sử
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.25rem",
            }}
          >
            {[
              "Trận Bạch Đằng 938",
              "Hội Nghị Diên Hồng",
              "Chiến Thắng Điện Biên",
              "Thống Nhất 1975",
            ].map((title) => (
              <div className="video-thumb" key={title}>
                <img src={VIDEO_IMG} alt={title} />
                <div className="play-overlay">
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "52px",
                      color: "#fff",
                      filter: "drop-shadow(0 0 8px rgba(0,0,0,0.5))",
                    }}
                  >
                    play_circle
                  </span>
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: "0.75rem",
                    background: "linear-gradient(transparent, rgba(26,10,0,0.85))",
                  }}
                >
                  <p style={{ color: "#C4956A", fontSize: "0.78rem", margin: 0, fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                    {title}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4. TIMELINE
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{ padding: "6rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <p
          style={{
            color: "#8B1A1A",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textAlign: "center",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 600,
          }}
        >
          DÒNG CHẢY LỊCH SỬ
        </p>
        <h2
          style={{
            color: "#3D2B1A",
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            marginBottom: "5rem",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
          }}
        >
          4000 Năm Dựng Nước &amp; Giữ Nước
        </h2>

        {/* Timeline container */}
        <div style={{ position: "relative" }}>
          {/* Center line */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              top: 0,
              bottom: 0,
              width: "1px",
              background: "linear-gradient(to bottom, #7B4A00, #C4956A, #8B1A1A)",
              transform: "translateX(-50%)",
              opacity: 0.45,
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "3.5rem" }}>
            {TIMELINE.map((item) => (
              <div
                key={item.period}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 40px 1fr",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Card */}
                <div style={{ textAlign: item.align === "right" ? "right" : "left", gridColumn: item.align === "right" ? "1" : "3" }}>
                  <div
                    style={{
                      background: "#FDF5EE",
                      border: `0.5px solid ${item.color}40`,
                      borderRadius: "12px",
                      padding: "1.5rem",
                      boxShadow: "0 2px 12px rgba(61,43,26,0.06)",
                      transition: "box-shadow 0.2s",
                    }}
                  >
                    <h4
                      style={{ color: item.color, fontSize: "0.95rem", marginBottom: "0.3rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
                    >
                      {item.period}
                    </h4>
                    <p style={{ color: item.color, fontSize: "0.72rem", opacity: 0.75, marginBottom: "0.6rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {item.years}
                    </p>
                    <p style={{ color: "#5C3A1E", fontSize: "0.87rem", lineHeight: 1.7, fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center", gridColumn: "2" }}>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: item.color,
                      border: `3px solid ${item.dotBorder}`,
                      boxShadow: `0 0 0 2px ${item.color}40`,
                      zIndex: 1,
                    }}
                  />
                </div>

                {/* Empty side */}
                <div style={{ gridColumn: item.align === "right" ? "3" : "1" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. TIER CARDS
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#FAE8DA",
          borderTop: "0.5px solid #D4B896",
          borderBottom: "0.5px solid #D4B896",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              color: "#8B1A1A",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textAlign: "center",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}
          >
            ĐÓNG GÓP &amp; ỦNG HỘ
          </p>
          <h2
            style={{
              color: "#3D2B1A",
              textAlign: "center",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              marginBottom: "3.5rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            Chọn Cấp Bậc Của Bạn
          </h2>

          {/* Cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "1.5rem",
              alignItems: "center",
              marginBottom: "3rem",
            }}
          >
            {TIERS.map((tier) => (
              <div
                key={tier.name}
                className={`tier-card${tier.highlighted ? " highlighted" : ""}`}
              >
                {tier.highlighted && (
                  <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                    <span
                      style={{
                        background: "#C4956A",
                        color: "#FDF5EE",
                        fontSize: "0.68rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "0.25rem 0.9rem",
                        borderRadius: "9999px",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      PHỔ BIẾN NHẤT
                    </span>
                  </div>
                )}
                <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                  <span
                    className="material-symbols-outlined"
                    style={{
                      fontSize: "38px",
                      color: tier.highlighted ? "#C4956A" : "#8B1A1A",
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {tier.icon}
                  </span>
                </div>
                <h3
                  style={{
                    color: tier.highlighted ? "#7B4A00" : "#3D2B1A",
                    textAlign: "center",
                    fontSize: "1.1rem",
                    marginBottom: "0.3rem",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    color: "#8B1A1A",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1.5rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                  }}
                >
                  {tier.price}
                </p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 1.5rem" }}>
                  {tier.perks.map((perk) => (
                    <li
                      key={perk}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        color: "#5C3A1E",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ color: "#C4956A", fontSize: "16px" }}>
                        check_circle
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    width: "100%",
                    background: tier.highlighted ? "#8B1A1A" : "transparent",
                    border: tier.highlighted ? "none" : "1px solid #C4956A",
                    color: tier.highlighted ? "#FDF5EE" : "#7B4A00",
                    borderRadius: "8px",
                    padding: "0.8rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    fontSize: "0.82rem",
                    fontFamily: "'Be Vietnam Pro', sans-serif",
                    transition: "opacity 0.2s, transform 0.2s, background 0.2s",
                    boxShadow: tier.highlighted ? "0 4px 16px rgba(139,26,26,0.25)" : "none",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = "0.88";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = "1";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  ĐÓNG GÓP NGAY
                </button>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div
            style={{
              background: "#FDF5EE",
              border: "0.5px solid #D4B896",
              borderRadius: "12px",
              padding: "2rem",
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              boxShadow: "0 2px 12px rgba(61,43,26,0.06)",
            }}
          >
            <img
              src={QR_IMG}
              alt="QR Code thanh toán"
              style={{ width: "110px", height: "110px", borderRadius: "8px", border: "0.5px solid #D4B896" }}
            />
            <div>
              <h4 style={{ color: "#3D2B1A", marginBottom: "0.75rem", fontSize: "0.95rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
                Thông Tin Chuyển Khoản
              </h4>
              {[
                ["Ngân hàng", "Vietcombank"],
                ["Số tài khoản", "1234 5678 9012 3456"],
                ["Chủ tài khoản", "DỰ ÁN SỬ VIỆT ANH HÙNG"],
                ["Nội dung", "Ho ten - Cap bac dong gop"],
              ].map(([k, v]) => (
                <p key={k} style={{ color: "#5C3A1E", fontSize: "0.85rem", margin: "0.25rem 0", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  <span style={{ color: "#A0794E" }}>{k}: </span>
                  <span style={{ color: "#3D2B1A", fontWeight: 500 }}>{v}</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          6. HONOR BOARD
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{
          background: "#FDF5EE",
          borderTop: "0.5px solid #D4B896",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              color: "#8B1A1A",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textAlign: "center",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}
          >
            VINH DANH
          </p>
          <h2
            style={{
              color: "#3D2B1A",
              textAlign: "center",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              marginBottom: "3rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}
          >
            Bảng Danh Dự
          </h2>

          {/* Separator */}
          <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(196,149,106,0.4), transparent)", marginBottom: "2.5rem" }} />

          {/* Marquee left */}
          <div style={{ overflow: "hidden", marginBottom: "0.75rem" }}>
            <div className="marquee-left">
              <span style={{ color: "#5C3A1E", fontSize: "0.88rem", paddingRight: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {MARQUEE_NAMES_LEFT}
              </span>
              <span style={{ color: "#5C3A1E", fontSize: "0.88rem", paddingRight: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                {MARQUEE_NAMES_LEFT}
              </span>
            </div>
          </div>

          {/* Marquee right */}
          <div style={{ overflow: "hidden", marginBottom: "3.5rem" }}>
            <div className="marquee-right">
              <span style={{ color: "#7B4A00", fontSize: "0.88rem", paddingRight: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
                {MARQUEE_NAMES_RIGHT}
              </span>
              <span style={{ color: "#7B4A00", fontSize: "0.88rem", paddingRight: "2rem", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
                {MARQUEE_NAMES_RIGHT}
              </span>
            </div>
          </div>

          {/* Stat boxes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "1rem",
            }}
          >
            {STATS_HONOR.map(({ label, value }) => (
              <div
                key={label}
                style={{
                  background: "#FDF5EE",
                  border: "0.5px solid #D4B896",
                  borderRadius: "12px",
                  padding: "1.75rem 1.5rem",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(61,43,26,0.05)",
                  transition: "box-shadow 0.2s, transform 0.2s",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = "0 6px 20px rgba(139,26,26,0.10)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(61,43,26,0.05)";
                  e.currentTarget.style.transform = "";
                }}
              >
                <div style={{ fontSize: "2rem", color: "#8B1A1A", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                  {value}
                </div>
                <div style={{ color: "#A0794E", fontSize: "0.78rem", marginTop: "0.35rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          7. FOOTER
      ════════════════════════════════════════ */}
      <footer
        style={{
          background: "#FAE8DA",
          borderTop: "1px solid rgba(196,149,106,0.35)",
          padding: "5rem 1.5rem 2.5rem",
        }}
      >
        <div
          style={{
            maxWidth: "1100px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "2.5rem",
            marginBottom: "3rem",
          }}
        >
          {/* Brand + social */}
          <div>
            <h3
              style={{ color: "#8B1A1A", fontSize: "1.1rem", marginBottom: "0.75rem", fontFamily: "'Playfair Display', serif", fontWeight: 700 }}
            >
              Sử Việt Anh Hùng
            </h3>
            <p style={{ color: "#5C3A1E", fontSize: "0.85rem", lineHeight: 1.75, marginBottom: "1.5rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Dự án gây quỹ cộng đồng nhằm bảo tồn và phát huy lịch sử dân tộc Việt Nam cho thế hệ mai sau.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["facebook", "youtube", "groups"].map((icon) => (
                <div className="social-icon" key={icon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#8B1A1A" }}>
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              style={{ color: "#3D2B1A", fontSize: "0.9rem", marginBottom: "1.25rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}
            >
              Liên Kết
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Về Dự Án", "Khởi Kiện", "Bộ Sách", "Phim Tài Liệu", "Bảng Danh Dự", "Liên Hệ"].map((link) => (
                <li key={link} style={{ marginBottom: "0.6rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "#5C3A1E",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.2s",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#8B1A1A")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#5C3A1E")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 style={{ color: "#3D2B1A", fontSize: "0.9rem", marginBottom: "0.6rem", fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
              Bản Tin
            </h4>
            <p style={{ color: "#5C3A1E", fontSize: "0.82rem", marginBottom: "1rem", fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              Nhận cập nhật mới nhất về dự án qua email.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  background: "rgba(253,245,238,0.70)",
                  border: "0.5px solid rgba(196,149,106,0.45)",
                  borderRadius: "6px",
                  padding: "0.6rem 0.75rem",
                  color: "#3D2B1A",
                  fontSize: "0.85rem",
                  outline: "none",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              />
              <button
                style={{
                  background: "#8B1A1A",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.6rem 1rem",
                  color: "#FDF5EE",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "background 0.2s",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#6B1414")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#8B1A1A")}
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>

        {/* Decorative line */}
        <div style={{ height: "1px", background: "linear-gradient(90deg, transparent, rgba(196,149,106,0.45), transparent)", marginBottom: "1.5rem" }} />

        {/* Bottom bar */}
        <div
          style={{
            textAlign: "center",
            color: "#A0794E",
            fontSize: "0.78rem",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          © 2025 Sử Việt Anh Hùng. Tất cả quyền được bảo lưu. Dự án phi lợi nhuận vì cộng đồng.
        </div>
      </footer>

      {/* ════════════════════════════════════════
          FIXED: Donate button (bottom-right)
      ════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          right: "1.5rem",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: "0.5rem",
        }}
      >
        {showTooltip && (
          <div
            style={{
              background: "#FDF5EE",
              border: "0.5px solid #D4B896",
              borderRadius: "8px",
              padding: "0.5rem 0.75rem",
              color: "#3D2B1A",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
              boxShadow: "0 4px 16px rgba(61,43,26,0.12)",
              fontFamily: "'Be Vietnam Pro', sans-serif",
            }}
          >
            Ủng hộ dự án ngay!
          </div>
        )}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            background: "#8B1A1A",
            border: "none",
            borderRadius: "50px",
            padding: "0.75rem 1.4rem",
            color: "#FDF5EE",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 20px rgba(139,26,26,0.42)",
            fontSize: "0.82rem",
            letterSpacing: "0.06em",
            transition: "transform 0.2s, box-shadow 0.2s, background 0.2s",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "18px", fontVariationSettings: '"FILL" 1' }}>
            favorite
          </span>
          ĐÓNG GÓP
        </button>
      </div>

      {/* ════════════════════════════════════════
          FIXED: Music player (bottom-left)
      ════════════════════════════════════════ */}
      <div
        style={{
          position: "fixed",
          bottom: "2rem",
          left: "1.5rem",
          zIndex: 100,
        }}
      >
        <button
          onClick={() => setMusicPlaying((p) => !p)}
          style={{
            background: "rgba(253,245,238,0.95)",
            border: "0.5px solid #D4B896",
            borderRadius: "50px",
            padding: "0.6rem 1rem",
            color: "#C4956A",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.78rem",
            backdropFilter: "blur(8px)",
            boxShadow: "0 2px 12px rgba(61,43,26,0.10)",
            transition: "border-color 0.2s, box-shadow 0.2s",
            fontFamily: "'Be Vietnam Pro', sans-serif",
          }}
        >
          <span
            className={`material-symbols-outlined ${musicPlaying ? "animate-spin-slow" : ""}`}
            style={{
              fontSize: "18px",
              color: musicPlaying ? "#C4956A" : "rgba(196,149,106,0.5)",
              fontVariationSettings: '"FILL" 1',
            }}
          >
            music_note
          </span>
          <span style={{ color: "#5C3A1E" }}>
            {musicPlaying ? "Đang phát..." : "Nhạc nền"}
          </span>
        </button>
      </div>
    </div>
  );
}
