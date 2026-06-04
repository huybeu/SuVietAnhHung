import { useState, useEffect, useRef } from "react";
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
  "Nguyễn Văn An • Trần Thị Bích • Lê Minh Đức • Phạm Thu Hà • Hoàng Quốc Bảo • Vũ Thị Lan • Đặng Hữu Phước • Bùi Thị Ngọc • Ngô Văn Thành • Lý Thị Mai • Đinh Xuân Hùng • Cao Thị Thanh • ".repeat(
    3
  );

const MARQUEE_NAMES_RIGHT =
  "Trịnh Thị Hoa • Dương Văn Minh • Tô Thị Xuân • Hồ Văn Long • Nguyễn Thị Dung • Lê Văn Quân • Phạm Thị Yến • Hoàng Văn Dũng • Vũ Thị Phương • Đặng Văn Khoa • Bùi Thị Hằng • Ngô Thị Linh • ".repeat(
    3
  );

const TIMELINE = [
  {
    period: "Thời Hồng Bàng",
    years: "2879 TCN – 258 TCN",
    desc: "Khởi nguồn dân tộc Việt, thời đại các Vua Hùng dựng nước Văn Lang. Nền văn minh lúa nước, trống đồng Đông Sơn vang vọng ngàn đời.",
    color: "#8B4513",
    align: "right",
  },
  {
    period: "Thời Bắc Thuộc",
    years: "111 TCN – 938 SCN",
    desc: "Hơn 1000 năm đô hộ phương Bắc nhưng không thể dập tắt ngọn lửa yêu nước. Hai Bà Trưng, Lý Bí, Mai Thúc Loan... những anh hùng bất khuất.",
    color: "#B8860B",
    align: "left",
  },
  {
    period: "Thời Phong Kiến Độc Lập",
    years: "938 – 1884",
    desc: "Ngô Quyền chiến thắng Bạch Đằng, mở ra kỷ nguyên độc lập. Các triều đại Đinh, Lý, Trần, Lê... xây dựng nền văn hiến rực rỡ.",
    color: "#f6be3b",
    align: "right",
  },
  {
    period: "Cận – Hiện Đại",
    years: "1884 – Nay",
    desc: "Chống Pháp, chống Mỹ, thống nhất đất nước. Hồ Chí Minh, Võ Nguyên Giáp... những huyền thoại của thế kỷ XX.",
    color: "#dc143c",
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
  const navbarRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // Navbar scroll effect
  useEffect(() => {
    const navbar = navbarRef.current;
    if (!navbar) return;
    const handleScroll = () => {
      if (window.scrollY > 60) {
        navbar.style.background = "rgba(10,4,2,0.95)";
        navbar.classList.add("shadow-xl");
      } else {
        navbar.style.background = "";
        navbar.classList.remove("shadow-xl");
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Countdown timer
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  // Reveal on scroll
  useEffect(() => {
    const revealEls = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="min-h-screen font-sans"
      style={{ background: "#0a0402", color: "#e8dcc8" }}
    >
      {/* ── Inline styles for custom animations & classes ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap');

        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-baskerville { font-family: 'Libre Baskerville', serif; }

        .dong-son-bg {
          background-image: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 40px,
            rgba(220,20,60,0.03) 40px,
            rgba(220,20,60,0.03) 41px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 40px,
            rgba(246,190,59,0.03) 40px,
            rgba(246,190,59,0.03) 41px
          );
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        .float-anim { animation: float 4s ease-in-out infinite; }

        @keyframes bounce-arrow {
          0%, 100% { transform: translateY(0); opacity: 1; }
          50% { transform: translateY(10px); opacity: 0.5; }
        }
        .bounce-arrow { animation: bounce-arrow 1.5s ease-in-out infinite; }

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

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow { animation: spin-slow 4s linear infinite; }

        .reveal {
          opacity: 0;
          transform: translateY(40px);
          transition: opacity 0.8s ease, transform 0.8s ease;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }

        .progress-fill {
          background: linear-gradient(90deg, #dc143c, #f6be3b);
          height: 100%;
          border-radius: 9999px;
          transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
        }

        .tier-card {
          border: 1px solid rgba(220,20,60,0.3);
          border-radius: 1rem;
          padding: 2rem;
          background: rgba(30,10,8,0.7);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .tier-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px rgba(220,20,60,0.2);
        }
        .tier-card.highlighted {
          border-color: #f6be3b;
          background: rgba(40,15,5,0.9);
          box-shadow: 0 0 30px rgba(246,190,59,0.2);
          transform: scale(1.05);
        }
        .tier-card.highlighted:hover {
          transform: scale(1.05) translateY(-6px);
        }

        .video-thumb {
          position: relative;
          overflow: hidden;
          border-radius: 0.75rem;
          cursor: pointer;
        }
        .video-thumb img {
          width: 100%;
          aspect-ratio: 16/9;
          object-fit: cover;
          transition: transform 0.4s;
          filter: brightness(0.7);
        }
        .video-thumb:hover img {
          transform: scale(1.05);
          filter: brightness(0.5);
        }
        .video-thumb .play-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s;
          background: rgba(220,20,60,0.15);
        }
        .video-thumb:hover .play-overlay {
          opacity: 1;
        }

        .mission-img-wrap {
          position: relative;
          overflow: hidden;
          border-radius: 1rem;
        }
        .mission-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(100%);
          transition: filter 0.6s;
        }
        .mission-img-wrap:hover img {
          filter: grayscale(0%);
        }
        .mission-img-wrap .deco-ring {
          position: absolute;
          inset: -8px;
          border: 2px solid rgba(220,20,60,0.4);
          border-radius: 1.2rem;
          pointer-events: none;
        }
        .mission-img-wrap .deco-ring-2 {
          position: absolute;
          inset: -16px;
          border: 1px solid rgba(246,190,59,0.2);
          border-radius: 1.4rem;
          pointer-events: none;
        }

        .timeline-dot {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #0a0402;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          top: 50%;
          margin-top: -8px;
        }

        .social-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 1px solid rgba(220,20,60,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s, border-color 0.2s;
          cursor: pointer;
        }
        .social-icon:hover {
          background: rgba(220,20,60,0.2);
          border-color: #dc143c;
        }
      `}</style>

      {/* ── Navbar wrapper ── */}
      <div
        ref={navbarRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        <Navbar activePage="khoi-kien" />
      </div>

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
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(139,0,0,0.25) 0%, rgba(10,4,2,1) 70%)",
        }}
      >
        {/* Dong Son grid overlay */}
        <div
          className="dong-son-bg"
          style={{ position: "absolute", inset: 0, zIndex: 0 }}
        />

        {/* Content */}
        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            maxWidth: "800px",
            padding: "0 1.5rem",
          }}
        >
          {/* Floating castle icon */}
          <div
            className="float-anim"
            style={{ marginBottom: "2rem", display: "inline-block" }}
          >
            <div
              style={{
                position: "relative",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* Pulse ring */}
              <span
                className="animate-pulse"
                style={{
                  position: "absolute",
                  inset: "-12px",
                  borderRadius: "50%",
                  border: "2px solid rgba(220,20,60,0.4)",
                  display: "block",
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "80px",
                  color: "#dc143c",
                  fontVariationSettings: '"FILL" 1',
                  filter: "drop-shadow(0 0 20px rgba(220,20,60,0.6))",
                }}
              >
                castle
              </span>
            </div>
          </div>

          {/* H1 */}
          <h1
            className="font-cinzel"
            style={{ marginBottom: "1rem", lineHeight: 1.2 }}
          >
            <span
              style={{
                display: "block",
                fontSize: "clamp(2.5rem, 8vw, 5rem)",
                fontWeight: 900,
                color: "#dc143c",
                textShadow: "0 0 30px rgba(220,20,60,0.5)",
              }}
            >
              Giữ Lấy Sử Việt
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(1rem, 3vw, 1.5rem)",
                fontWeight: 400,
                color: "#f6be3b",
                marginTop: "0.5rem",
                letterSpacing: "0.15em",
              }}
            >
              Giữ truyền thống yêu nước, giữ hồn dân tộc ngàn đời
            </span>
          </h1>

          {/* Italic quote */}
          <p
            className="font-baskerville"
            style={{
              fontStyle: "italic",
              color: "rgba(232,220,200,0.7)",
              fontSize: "1.05rem",
              maxWidth: "560px",
              margin: "0 auto 2.5rem",
              lineHeight: 1.8,
            }}
          >
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."
            <br />
            <span style={{ color: "#f6be3b", fontSize: "0.9rem" }}>
              — Hồ Chí Minh
            </span>
          </p>

          {/* CTA buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="font-cinzel"
              style={{
                background: "rgba(220,20,60,0.85)",
                color: "#fff",
                border: "none",
                borderRadius: "0.5rem",
                padding: "0.85rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
                boxShadow: "0 4px 20px rgba(220,20,60,0.4)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#dc143c";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(220,20,60,0.85)";
                e.currentTarget.style.transform = "";
              }}
            >
              KHÁM PHÁ NGAY
            </button>
            <button
              className="font-cinzel"
              style={{
                background: "transparent",
                color: "#f6be3b",
                border: "2px solid #f6be3b",
                borderRadius: "0.5rem",
                padding: "0.85rem 2rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(246,190,59,0.1)";
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
            color: "rgba(246,190,59,0.6)",
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: "36px" }}>
            keyboard_double_arrow_down
          </span>
        </div>
      </section>

      {/* ════════════════════════════════════════
          2. PROGRESS & COUNTDOWN
      ════════════════════════════════════════ */}
      <section
        className="reveal"
        style={{ padding: "5rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
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
              background: "rgba(20,8,5,0.8)",
              border: "1px solid rgba(220,20,60,0.3)",
              borderRadius: "1rem",
              padding: "2rem",
            }}
          >
            <h2
              className="font-cinzel"
              style={{ color: "#f6be3b", fontSize: "1.3rem", marginBottom: "0.5rem" }}
            >
              Tiến Độ Gây Quỹ
            </h2>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "0.75rem",
                fontSize: "0.9rem",
              }}
            >
              <span style={{ color: "#dc143c", fontWeight: 700 }}>623 triệu đồng</span>
              <span style={{ color: "rgba(232,220,200,0.6)" }}>Mục tiêu: 830 triệu</span>
            </div>
            {/* Progress bar */}
            <div
              style={{
                height: "12px",
                background: "rgba(255,255,255,0.08)",
                borderRadius: "9999px",
                overflow: "hidden",
                marginBottom: "0.5rem",
              }}
            >
              <div className="progress-fill" style={{ width: "75%" }} />
            </div>
            <p style={{ color: "rgba(232,220,200,0.5)", fontSize: "0.8rem", marginBottom: "2rem" }}>
              75% mục tiêu đạt được • 1,247 người đóng góp
            </p>

            {/* Countdown */}
            <h3
              className="font-cinzel"
              style={{ color: "#f6be3b", fontSize: "1rem", marginBottom: "1rem" }}
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
                <div
                  key={label}
                  style={{ textAlign: "center", flex: 1 }}
                >
                  <div
                    style={{
                      background: "rgba(220,20,60,0.15)",
                      border: "1px solid rgba(220,20,60,0.4)",
                      borderRadius: "0.5rem",
                      padding: "0.75rem 0.25rem",
                      fontSize: "1.8rem",
                      fontWeight: 700,
                      color: "#dc143c",
                      fontFamily: "monospace",
                    }}
                  >
                    {pad(val)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      color: "rgba(232,220,200,0.5)",
                      marginTop: "0.3rem",
                    }}
                  >
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right card: content items */}
          <div
            style={{
              background: "rgba(20,8,5,0.8)",
              border: "1px solid rgba(220,20,60,0.3)",
              borderRadius: "1rem",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              justifyContent: "center",
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
              <div
                key={icon}
                style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}
              >
                <div
                  style={{
                    background: "rgba(220,20,60,0.15)",
                    border: "1px solid rgba(220,20,60,0.3)",
                    borderRadius: "0.75rem",
                    padding: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  <span
                    className="material-symbols-outlined"
                    style={{ color: "#dc143c", fontSize: "28px" }}
                  >
                    {icon}
                  </span>
                </div>
                <div>
                  <h4
                    className="font-cinzel"
                    style={{ color: "#f6be3b", marginBottom: "0.3rem", fontSize: "1rem" }}
                  >
                    {title}
                  </h4>
                  <p style={{ color: "rgba(232,220,200,0.65)", fontSize: "0.88rem", lineHeight: 1.6 }}>
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
          background: "rgba(15,5,3,0.6)",
          borderTop: "1px solid rgba(220,20,60,0.15)",
          borderBottom: "1px solid rgba(220,20,60,0.15)",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          {/* Mission row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem",
              alignItems: "center",
              marginBottom: "4rem",
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
                  color: "#dc143c",
                  fontSize: "0.8rem",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                }}
              >
                Về Chúng Tôi
              </p>
              <h2
                className="font-cinzel"
                style={{
                  color: "#f6be3b",
                  fontSize: "clamp(1.4rem, 3vw, 2rem)",
                  marginBottom: "1rem",
                }}
              >
                Sứ Mệnh Của Chúng Tôi
              </h2>
              <p
                style={{
                  color: "rgba(232,220,200,0.7)",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  fontSize: "0.95rem",
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
                    <div
                      className="font-cinzel"
                      style={{ fontSize: "1.6rem", color: "#dc143c", fontWeight: 700 }}
                    >
                      {val}
                    </div>
                    <div style={{ color: "rgba(232,220,200,0.5)", fontSize: "0.8rem" }}>
                      {label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Video grid */}
          <h3
            className="font-cinzel"
            style={{
              color: "#f6be3b",
              textAlign: "center",
              marginBottom: "2rem",
              fontSize: "1.4rem",
            }}
          >
            Kho Phim Lịch Sử
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1rem",
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
                      fontSize: "56px",
                      color: "#fff",
                      filter: "drop-shadow(0 0 10px rgba(0,0,0,0.8))",
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
                    background: "linear-gradient(transparent, rgba(0,0,0,0.9))",
                  }}
                >
                  <p
                    className="font-cinzel"
                    style={{ color: "#f6be3b", fontSize: "0.8rem", margin: 0 }}
                  >
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
        style={{ padding: "5rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <p
          style={{
            color: "#dc143c",
            fontSize: "0.8rem",
            letterSpacing: "0.2em",
            textAlign: "center",
            marginBottom: "0.5rem",
          }}
        >
          DÒNG CHẢY LỊCH SỬ
        </p>
        <h2
          className="font-cinzel"
          style={{
            color: "#f6be3b",
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            marginBottom: "4rem",
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
              width: "2px",
              background: "linear-gradient(to bottom, #8B4513, #B8860B, #f6be3b, #dc143c)",
              transform: "translateX(-50%)",
            }}
          />

          <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
            {TIMELINE.map((item, i) => (
              <div
                key={item.period}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 40px 1fr",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Left content */}
                <div style={{ textAlign: item.align === "right" ? "right" : "left", gridColumn: item.align === "right" ? "1" : "3" }}>
                  <div
                    style={{
                      background: "rgba(20,8,5,0.85)",
                      border: `1px solid ${item.color}44`,
                      borderRadius: "0.75rem",
                      padding: "1.25rem 1.5rem",
                    }}
                  >
                    <h4
                      className="font-cinzel"
                      style={{ color: item.color, fontSize: "1rem", marginBottom: "0.25rem" }}
                    >
                      {item.period}
                    </h4>
                    <p style={{ color: item.color, fontSize: "0.75rem", opacity: 0.7, marginBottom: "0.5rem" }}>
                      {item.years}
                    </p>
                    <p style={{ color: "rgba(232,220,200,0.7)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Center dot */}
                <div style={{ position: "relative", display: "flex", justifyContent: "center", gridColumn: "2" }}>
                  <div
                    style={{
                      width: "16px",
                      height: "16px",
                      borderRadius: "50%",
                      background: item.color,
                      border: "3px solid #0a0402",
                      boxShadow: `0 0 12px ${item.color}`,
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
          background: "rgba(8,3,1,0.8)",
          borderTop: "1px solid rgba(220,20,60,0.15)",
          borderBottom: "1px solid rgba(220,20,60,0.15)",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              color: "#dc143c",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            ĐÓNG GÓP &amp; ỦNG HỘ
          </p>
          <h2
            className="font-cinzel"
            style={{
              color: "#f6be3b",
              textAlign: "center",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              marginBottom: "3rem",
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
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        background: "#f6be3b",
                        color: "#0a0402",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        letterSpacing: "0.1em",
                        padding: "0.2rem 0.8rem",
                        borderRadius: "9999px",
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
                      fontSize: "40px",
                      color: tier.highlighted ? "#f6be3b" : "#dc143c",
                      fontVariationSettings: '"FILL" 1',
                    }}
                  >
                    {tier.icon}
                  </span>
                </div>
                <h3
                  className="font-cinzel"
                  style={{
                    color: tier.highlighted ? "#f6be3b" : "#e8dcc8",
                    textAlign: "center",
                    fontSize: "1.2rem",
                    marginBottom: "0.25rem",
                  }}
                >
                  {tier.name}
                </h3>
                <p
                  style={{
                    color: "#dc143c",
                    textAlign: "center",
                    fontSize: "1.5rem",
                    fontWeight: 700,
                    marginBottom: "1.25rem",
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
                        color: "rgba(232,220,200,0.75)",
                        fontSize: "0.85rem",
                        marginBottom: "0.5rem",
                      }}
                    >
                      <span
                        className="material-symbols-outlined"
                        style={{ color: "#f6be3b", fontSize: "16px" }}
                      >
                        check_circle
                      </span>
                      {perk}
                    </li>
                  ))}
                </ul>
                <button
                  style={{
                    width: "100%",
                    background: tier.highlighted
                      ? "linear-gradient(135deg, #dc143c, #8b0000)"
                      : "transparent",
                    border: tier.highlighted ? "none" : "1px solid rgba(220,20,60,0.5)",
                    color: "#fff",
                    borderRadius: "0.5rem",
                    padding: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    letterSpacing: "0.08em",
                    fontSize: "0.85rem",
                    transition: "opacity 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                >
                  ĐÓNG GÓP NGAY
                </button>
              </div>
            ))}
          </div>

          {/* Payment info */}
          <div
            style={{
              background: "rgba(20,8,5,0.8)",
              border: "1px solid rgba(246,190,59,0.2)",
              borderRadius: "1rem",
              padding: "2rem",
              display: "flex",
              gap: "2rem",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <img
              src={QR_IMG}
              alt="QR Code thanh toán"
              style={{ width: "120px", height: "120px", borderRadius: "0.5rem" }}
            />
            <div>
              <h4
                className="font-cinzel"
                style={{ color: "#f6be3b", marginBottom: "0.75rem" }}
              >
                Thông Tin Chuyển Khoản
              </h4>
              {[
                ["Ngân hàng", "Vietcombank"],
                ["Số tài khoản", "1234 5678 9012 3456"],
                ["Chủ tài khoản", "DỰ ÁN SỬ VIỆT ANH HÙNG"],
                ["Nội dung", "Ho ten - Cap bac dong gop"],
              ].map(([k, v]) => (
                <p key={k} style={{ color: "rgba(232,220,200,0.7)", fontSize: "0.85rem", margin: "0.2rem 0" }}>
                  <span style={{ color: "rgba(232,220,200,0.45)" }}>{k}: </span>
                  <span style={{ color: "#e8dcc8" }}>{v}</span>
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
          background: "rgba(15,5,3,0.6)",
          borderTop: "1px solid rgba(220,20,60,0.15)",
          padding: "5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p
            style={{
              color: "#dc143c",
              fontSize: "0.8rem",
              letterSpacing: "0.2em",
              textAlign: "center",
              marginBottom: "0.5rem",
            }}
          >
            VINH DANH
          </p>
          <h2
            className="font-cinzel"
            style={{
              color: "#f6be3b",
              textAlign: "center",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              marginBottom: "3rem",
            }}
          >
            Bảng Danh Dự
          </h2>

          {/* Marquee left */}
          <div style={{ overflow: "hidden", marginBottom: "1rem" }}>
            <div className="marquee-left">
              <span style={{ color: "rgba(232,220,200,0.6)", fontSize: "0.9rem", paddingRight: "2rem" }}>
                {MARQUEE_NAMES_LEFT}
              </span>
              <span style={{ color: "rgba(232,220,200,0.6)", fontSize: "0.9rem", paddingRight: "2rem" }}>
                {MARQUEE_NAMES_LEFT}
              </span>
            </div>
          </div>

          {/* Marquee right */}
          <div style={{ overflow: "hidden", marginBottom: "3rem" }}>
            <div className="marquee-right">
              <span style={{ color: "rgba(246,190,59,0.5)", fontSize: "0.9rem", paddingRight: "2rem" }}>
                {MARQUEE_NAMES_RIGHT}
              </span>
              <span style={{ color: "rgba(246,190,59,0.5)", fontSize: "0.9rem", paddingRight: "2rem" }}>
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
                  background: "rgba(20,8,5,0.8)",
                  border: "1px solid rgba(220,20,60,0.25)",
                  borderRadius: "0.75rem",
                  padding: "1.5rem",
                  textAlign: "center",
                }}
              >
                <div
                  className="font-cinzel"
                  style={{ fontSize: "2rem", color: "#dc143c", fontWeight: 700 }}
                >
                  {value}
                </div>
                <div style={{ color: "rgba(232,220,200,0.5)", fontSize: "0.8rem", marginTop: "0.3rem" }}>
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
          background: "#060201",
          borderTop: "1px solid rgba(220,20,60,0.2)",
          padding: "4rem 1.5rem 2rem",
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
              className="font-cinzel"
              style={{ color: "#f6be3b", fontSize: "1.2rem", marginBottom: "0.75rem" }}
            >
              Sử Việt Anh Hùng
            </h3>
            <p style={{ color: "rgba(232,220,200,0.5)", fontSize: "0.85rem", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Dự án gây quỹ cộng đồng nhằm bảo tồn và phát huy lịch sử dân tộc Việt Nam cho thế hệ mai sau.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              {["facebook", "youtube", "groups"].map((icon) => (
                <div className="social-icon" key={icon}>
                  <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#dc143c" }}>
                    {icon}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4
              className="font-cinzel"
              style={{ color: "#f6be3b", fontSize: "0.95rem", marginBottom: "1rem" }}
            >
              Liên Kết
            </h4>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {["Về Dự Án", "Khởi Kiện", "Bộ Sách", "Phim Tài Liệu", "Bảng Danh Dự", "Liên Hệ"].map((link) => (
                <li key={link} style={{ marginBottom: "0.5rem" }}>
                  <a
                    href="#"
                    style={{
                      color: "rgba(232,220,200,0.55)",
                      fontSize: "0.85rem",
                      textDecoration: "none",
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#f6be3b")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(232,220,200,0.55)")}
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4
              className="font-cinzel"
              style={{ color: "#f6be3b", fontSize: "0.95rem", marginBottom: "0.5rem" }}
            >
              Bản Tin
            </h4>
            <p style={{ color: "rgba(232,220,200,0.5)", fontSize: "0.8rem", marginBottom: "1rem" }}>
              Nhận cập nhật mới nhất về dự án qua email.
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: 1,
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(220,20,60,0.3)",
                  borderRadius: "0.375rem",
                  padding: "0.6rem 0.75rem",
                  color: "#e8dcc8",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
              <button
                style={{
                  background: "#dc143c",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.6rem 1rem",
                  color: "#fff",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.8rem",
                  transition: "background 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#b01030")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#dc143c")}
              >
                Đăng Ký
              </button>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.06)",
            paddingTop: "1.5rem",
            textAlign: "center",
            color: "rgba(232,220,200,0.3)",
            fontSize: "0.78rem",
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
              background: "rgba(10,4,2,0.95)",
              border: "1px solid rgba(220,20,60,0.4)",
              borderRadius: "0.5rem",
              padding: "0.5rem 0.75rem",
              color: "#f6be3b",
              fontSize: "0.8rem",
              whiteSpace: "nowrap",
            }}
          >
            Ủng hộ dự án ngay!
          </div>
        )}
        <button
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          style={{
            background: "linear-gradient(135deg, #dc143c, #8b0000)",
            border: "none",
            borderRadius: "50px",
            padding: "0.75rem 1.25rem",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            boxShadow: "0 4px 20px rgba(220,20,60,0.5)",
            fontSize: "0.85rem",
            letterSpacing: "0.05em",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.96)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "")}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "18px", fontVariationSettings: '"FILL" 1' }}
          >
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
            background: "rgba(10,4,2,0.9)",
            border: "1px solid rgba(246,190,59,0.4)",
            borderRadius: "50px",
            padding: "0.6rem 1rem",
            color: "#f6be3b",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "0.78rem",
            backdropFilter: "blur(8px)",
            transition: "border-color 0.2s",
          }}
        >
          <span
            className={`material-symbols-outlined ${musicPlaying ? "animate-spin-slow" : ""}`}
            style={{
              fontSize: "18px",
              color: musicPlaying ? "#f6be3b" : "rgba(246,190,59,0.5)",
              fontVariationSettings: '"FILL" 1',
            }}
          >
            music_note
          </span>
          <span style={{ color: "rgba(232,220,200,0.6)" }}>
            {musicPlaying ? "Đang phát..." : "Nhạc nền"}
          </span>
        </button>
      </div>
    </div>
  );
}
