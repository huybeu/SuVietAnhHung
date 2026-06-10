import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { heroService } from "../services/heroService";
import { queryKeys } from "../lib/queryKeys";
import { formatYear, formatDateShort } from "../lib/format";
import { useArticles } from "../hooks/useArticles";

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

const VIDEOS = [
  { title: "Trận Bạch Đằng 938",    youtubeId: "nBPzK_8a_eE" },
  { title: "Hội Nghị Diên Hồng",    youtubeId: "kVJi9e0KUCA" },
  { title: "Chiến Thắng Điện Biên", youtubeId: "IFT48TM_Yyk" },
  { title: "Thống Nhất 1975",       youtubeId: "LW9bIV75qZE" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const [videoModal, setVideoModal] = useState({ open: false, title: '', youtubeId: '' });

  const { data: featuredData } = useQuery({
    queryKey: queryKeys.heroes.list({ is_featured: true, pageSize: 4 }),
    queryFn: ({ signal }) => heroService.getHeroes({ is_featured: true, pageSize: 4 }, { signal }),
  });
  const featuredHeroes = featuredData?.data?.slice(0, 4) ?? [];

  const { data: featuredArticlesData } = useArticles({ status: 'published', is_featured: true, limit: 4 });
  const featuredArticles = featuredArticlesData?.data?.slice(0, 4) ?? [];

  /* ── Countdown ── */
  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── ESC to close video modal ── */
  useEffect(() => {
    if (!videoModal.open) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setVideoModal({ open: false, title: '', youtubeId: '' });
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [videoModal.open]);

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

        @keyframes overlayFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.92) translateY(24px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        .video-modal-overlay { animation: overlayFadeIn 0.22s ease; }
        .video-modal-box     { animation: modalSlideIn 0.32s cubic-bezier(0.34,1.45,0.64,1); }

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

        /* Tier card: no scale on single-column mobile */
        @media (max-width: 639px) {
          .tier-card.highlighted {
            transform: none !important;
          }
          .tier-card.highlighted:hover {
            transform: translateY(-5px) !important;
          }
        }

        /* Timeline responsive */
        @media (max-width: 639px) {
          .timeline-item {
            grid-template-columns: 24px 1fr !important;
            gap: 0.75rem !important;
          }
          .timeline-center-line {
            left: 12px !important;
          }
          .timeline-card {
            grid-column: 2 !important;
            text-align: left !important;
          }
          .timeline-dot-col {
            grid-column: 1 !important;
            grid-row: 1 !important;
          }
          .timeline-empty {
            display: none !important;
          }
        }

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

      {/* ════════════════════════════════════════
          1. HERO SECTION
      ════════════════════════════════════════ */}
      <section
        id="hero"
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

        {/* Warm glow — lớn hơn, đậm hơn */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "900px",
            height: "600px",
            background: "radial-gradient(ellipse, rgba(139,26,26,0.09) 0%, rgba(196,149,106,0.05) 45%, transparent 70%)",
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
            maxWidth: "960px",
            padding: "0 2rem",
            paddingTop: "96px",
          }}
        >
          {/* Floating castle icon */}
          <div className="float-anim" style={{ marginBottom: "3rem", display: "inline-block" }}>
            <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              <span
                style={{
                  position: "absolute",
                  inset: "-22px",
                  borderRadius: "50%",
                  border: "1px solid rgba(196,149,106,0.35)",
                  display: "block",
                }}
              />
              <span
                className="animate-pulse"
                style={{
                  position: "absolute",
                  inset: "-12px",
                  borderRadius: "50%",
                  border: "1.5px solid #C4956A",
                  display: "block",
                }}
              />
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "100px",
                  color: "#8B1A1A",
                  fontVariationSettings: '"FILL" 1',
                  filter: "drop-shadow(0 6px 24px rgba(139,26,26,0.30))",
                }}
              >
                castle
              </span>
            </div>
          </div>

          {/* Label */}
          <p
            style={{
              fontSize: "0.78rem",
              letterSpacing: "0.28em",
              textTransform: "uppercase",
              color: "#8B1A1A",
              marginBottom: "1.25rem",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}
          >
            Dự án bảo tồn lịch sử cộng đồng
          </p>

          {/* H1 — Playfair Display #8B1A1A */}
          <h1 style={{ marginBottom: "1.5rem", lineHeight: 1.1, fontFamily: "'Playfair Display', serif" }}>
            <span
              style={{
                display: "block",
                fontSize: "clamp(3rem, 9vw, 6rem)",
                fontWeight: 700,
                color: "#8B1A1A",
                letterSpacing: "-0.02em",
              }}
            >
              Giữ Lấy Sử Việt
            </span>
            <span
              style={{
                display: "block",
                fontSize: "clamp(1.1rem, 3vw, 1.6rem)",
                fontWeight: 600,
                color: "#7B4A00",
                marginTop: "0.75rem",
                letterSpacing: "0.05em",
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
              background: "linear-gradient(90deg, transparent, rgba(196,149,106,0.55), transparent)",
              maxWidth: "400px",
              margin: "0 auto 2rem",
            }}
          />

          {/* Quote — Merriweather italic */}
          <blockquote
            style={{
              fontFamily: "'Merriweather', serif",
              fontStyle: "italic",
              fontWeight: 300,
              color: "#5C3A1E",
              fontSize: "1.05rem",
              maxWidth: "600px",
              margin: "0 auto 3rem",
              lineHeight: 2,
              borderLeft: "2px solid #C4956A",
              paddingLeft: "1.25rem",
              textAlign: "left",
            }}
          >
            "Dân ta phải biết sử ta, cho tường gốc tích nước nhà Việt Nam."
            <footer style={{ color: "#A0794E", fontSize: "0.88rem", fontStyle: "normal", fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600, marginTop: "0.6rem" }}>
              — Hồ Chí Minh
            </footer>
          </blockquote>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1.25rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => document.getElementById("du-an")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "#8B1A1A",
                color: "#FDF5EE",
                border: "none",
                borderRadius: "8px",
                padding: "1.05rem 2.75rem",
                fontWeight: 700,
                fontSize: "0.9rem",
                letterSpacing: "0.12em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s, box-shadow 0.2s",
                boxShadow: "0 4px 20px rgba(139,26,26,0.35)",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#6B1414";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 10px 32px rgba(139,26,26,0.42)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#8B1A1A";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "0 4px 20px rgba(139,26,26,0.35)";
              }}
            >
              KHÁM PHÁ NGAY
            </button>
            <button
              onClick={() => document.getElementById("phim")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                background: "transparent",
                color: "#7B4A00",
                border: "1.5px solid #C4956A",
                borderRadius: "8px",
                padding: "1.05rem 2.75rem",
                fontWeight: 600,
                fontSize: "0.9rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "background 0.2s, transform 0.2s",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                textTransform: "uppercase",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(196,149,106,0.12)";
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
        id="du-an"
        className="reveal"
        style={{ padding: "6rem 1.5rem", maxWidth: "1100px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(300px, 100%), 1fr))",
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
        id="phim"
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(280px, 100%), 1fr))",
              gap: "3.5rem",
              alignItems: "center",
              marginBottom: "5rem",
            }}
          >
            {/* Left: image */}
            <div className="mission-img-wrap" style={{ height: "clamp(220px, 40vw, 360px)" }}>
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
              gap: "1.25rem",
            }}
          >
            {VIDEOS.map((video) => (
              <div
                className="video-thumb"
                key={video.title}
                onClick={() => setVideoModal({ open: true, title: video.title, youtubeId: video.youtubeId })}
              >
                <img src={VIDEO_IMG} alt={video.title} />
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
                    {video.title}
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
        id="thoi-dai"
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
            className="timeline-center-line"
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
                className="timeline-item"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 40px 1fr",
                  alignItems: "center",
                  gap: "1rem",
                }}
              >
                {/* Card */}
                <div className="timeline-card" style={{ textAlign: item.align === "right" ? "right" : "left", gridColumn: item.align === "right" ? "1" : "3" }}>
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
                <div className="timeline-dot-col" style={{ position: "relative", display: "flex", justifyContent: "center", gridColumn: "2" }}>
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
                <div className="timeline-empty" style={{ gridColumn: item.align === "right" ? "3" : "1" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          4.5. FEATURED HEROES
      ════════════════════════════════════════ */}
      <section
          id="anh-hung-noi-bat"
          style={{
            background: "#FDF5EE",
            borderTop: "0.5px solid #D4B896",
            padding: "6rem 1.5rem",
          }}
        >
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <p style={{
              color: "#8B1A1A",
              fontSize: "0.72rem",
              letterSpacing: "0.22em",
              textAlign: "center",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontWeight: 600,
            }}>
              NHỮNG ANH HÙNG DÂN TỘC
            </p>
            <h2 style={{
              color: "#3D2B1A",
              textAlign: "center",
              fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
              marginBottom: "3.5rem",
              fontFamily: "'Playfair Display', serif",
              fontWeight: 700,
            }}>
              Anh Hùng Nổi Bật
            </h2>

            {featuredHeroes.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "4rem 1.5rem",
                color: "#A0794E",
                fontFamily: "'Be Vietnam Pro', sans-serif",
                fontSize: "0.9rem",
                border: "0.5px dashed rgba(196,149,106,0.45)",
                borderRadius: "12px",
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 40, color: "rgba(196,149,106,0.45)", display: "block", marginBottom: "0.75rem" }}>
                  shield_person
                </span>
                Chưa có anh hùng nổi bật nào được chọn.
              </div>
            ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
              gap: "1.5rem",
            }}>
              {featuredHeroes.map((hero) => (
                <div
                  key={hero.id}
                  onClick={() => navigate(`/anh-hung/${hero.slug}`)}
                  style={{
                    background: "#FDF5EE",
                    border: "0.5px solid #D4B896",
                    borderRadius: "12px",
                    padding: "1.75rem 1.5rem",
                    textAlign: "center",
                    cursor: "pointer",
                    boxShadow: "0 2px 12px rgba(61,43,26,0.07)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-4px)";
                    e.currentTarget.style.boxShadow = "0 10px 28px rgba(139,26,26,0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 2px 12px rgba(61,43,26,0.07)";
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 80, height: 80,
                    borderRadius: "50%",
                    overflow: "hidden",
                    border: "2px solid #C4956A",
                    boxShadow: "0 0 16px rgba(139,26,26,0.15)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "linear-gradient(135deg, #FAE8DA, #F5D5C0)",
                    margin: "0 auto 1.25rem",
                  }}>
                    {hero.avatar_url
                      ? <img src={hero.avatar_url} alt={hero.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      : <span style={{ color: "#8B1A1A", fontSize: "1.8rem", fontWeight: 700, fontFamily: "'Playfair Display', serif" }}>
                          {hero.name?.[0] || "?"}
                        </span>
                    }
                  </div>

                  {/* Era badge */}
                  {hero.era?.name && (
                    <div style={{ marginBottom: "0.5rem" }}>
                      <span style={{
                        background: "rgba(196,149,106,0.12)",
                        color: "#7B4A00",
                        fontSize: "0.65rem",
                        fontWeight: 600,
                        letterSpacing: "0.1em",
                        padding: "0.2rem 0.7rem",
                        borderRadius: "9999px",
                        border: "0.5px solid rgba(196,149,106,0.35)",
                        fontFamily: "'Be Vietnam Pro', sans-serif",
                      }}>
                        {hero.era.name}
                      </span>
                    </div>
                  )}

                  {/* Name */}
                  <h3 style={{
                    color: "#3D2B1A",
                    fontSize: "1.05rem",
                    marginBottom: hero.title ? "0.25rem" : "0.75rem",
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    lineHeight: 1.3,
                  }}>
                    {hero.name}
                  </h3>

                  {/* Title */}
                  {hero.title && (
                    <p style={{
                      color: "#C4956A",
                      fontSize: "0.8rem",
                      marginBottom: "0.75rem",
                      fontFamily: "'Playfair Display', serif",
                      fontStyle: "italic",
                    }}>
                      {hero.title}
                    </p>
                  )}

                  {/* Years */}
                  {(hero.birth_year != null || hero.death_year != null) && (
                    <p style={{
                      color: "#A0794E",
                      fontSize: "0.75rem",
                      fontFamily: "'Be Vietnam Pro', sans-serif",
                      letterSpacing: "0.1em",
                      margin: 0,
                    }}>
                      {formatYear(hero.birth_year)} – {formatYear(hero.death_year)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            )}

            {/* View all link */}
            <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
              <button
                onClick={() => navigate("/anh-hung")}
                style={{
                  background: "transparent",
                  color: "#7B4A00",
                  border: "1px solid #C4956A",
                  borderRadius: "8px",
                  padding: "0.75rem 2rem",
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
                XEM TẤT CẢ ANH HÙNG
              </button>
            </div>
          </div>
        </section>

      {/* ════════════════════════════════════════
          4.6. FEATURED ARTICLES
      ════════════════════════════════════════ */}
      <section
        id="bai-viet-noi-bat"
        style={{
          background: "#FDF5EE",
          borderTop: "0.5px solid #D4B896",
          padding: "6rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{
            color: "#8B1A1A",
            fontSize: "0.72rem",
            letterSpacing: "0.22em",
            textAlign: "center",
            marginBottom: "0.5rem",
            textTransform: "uppercase",
            fontFamily: "'Be Vietnam Pro', sans-serif",
            fontWeight: 600,
          }}>
            NHỮNG BÀI VIẾT NỔI BẬT
          </p>
          <h2 style={{
            color: "#3D2B1A",
            textAlign: "center",
            fontSize: "clamp(1.5rem, 4vw, 2.2rem)",
            marginBottom: "3.5rem",
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
          }}>
            Bài Viết Nổi Bật
          </h2>

          {featuredArticles.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "4rem 1.5rem",
              color: "#A0794E",
              fontFamily: "'Be Vietnam Pro', sans-serif",
              fontSize: "0.9rem",
              border: "0.5px dashed rgba(196,149,106,0.45)",
              borderRadius: "12px",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 40, color: "rgba(196,149,106,0.45)", display: "block", marginBottom: "0.75rem" }}>
                article
              </span>
              Chưa có bài viết nổi bật nào được chọn.
            </div>
          ) : (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
              gap: "1.5rem",
            }}>
              {featuredArticles.map((article) => {
                const thumbnail = article.cover_url || article.thumbnailUrl || article.thumbnail_url;
                const tags = article.tags || [];
                const publishedAt = article.published_at || article.publishedAt;
                return (
                  <div
                    key={article.id}
                    onClick={() => navigate(`/bai-viet/${article.slug || article.id}`)}
                    style={{
                      background: "#FDF5EE",
                      border: "0.5px solid #D4B896",
                      borderRadius: "12px",
                      overflow: "hidden",
                      cursor: "pointer",
                      boxShadow: "0 2px 12px rgba(61,43,26,0.07)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 10px 28px rgba(139,26,26,0.12)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "0 2px 12px rgba(61,43,26,0.07)";
                    }}
                  >
                    {/* Cover image */}
                    <div style={{ width: "100%", aspectRatio: "16/9", overflow: "hidden", background: "linear-gradient(135deg, #FAE8DA, #F5D5C0)" }}>
                      {thumbnail
                        ? <img src={thumbnail} alt={article.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        : <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: "2.5rem", color: "rgba(196,149,106,0.4)" }}>article</span>
                          </div>
                      }
                    </div>

                    {/* Content */}
                    <div style={{ padding: "1.25rem 1.25rem 1rem" }}>
                      {tags.length > 0 && (
                        <div style={{ display: "flex", gap: "0.3rem", marginBottom: "0.6rem", flexWrap: "wrap" }}>
                          {tags.slice(0, 2).map(tag => (
                            <span key={tag.id || tag.slug} style={{
                              padding: "1px 8px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 600,
                              background: "rgba(139,26,26,0.07)", color: "#8B1A1A",
                              border: "0.5px solid rgba(139,26,26,0.18)",
                              fontFamily: "'Be Vietnam Pro', sans-serif",
                            }}>
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 style={{
                        color: "#3D2B1A",
                        fontSize: "0.95rem",
                        marginBottom: article.excerpt ? "0.4rem" : "0.75rem",
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 700,
                        lineHeight: 1.35,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}>
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p style={{
                          color: "#A0794E",
                          fontSize: "0.78rem",
                          lineHeight: 1.55,
                          marginBottom: "0.75rem",
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}>
                          {article.excerpt}
                        </p>
                      )}

                      {publishedAt && (
                        <p style={{
                          color: "#C4956A",
                          fontSize: "0.7rem",
                          fontFamily: "'Be Vietnam Pro', sans-serif",
                          letterSpacing: "0.05em",
                          margin: 0,
                        }}>
                          {formatDateShort(publishedAt)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "2.5rem" }}>
            <button
              onClick={() => navigate("/bai-viet")}
              style={{
                background: "transparent",
                color: "#7B4A00",
                border: "1px solid #C4956A",
                borderRadius: "8px",
                padding: "0.75rem 2rem",
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
              XEM TẤT CẢ BÀI VIẾT
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          5. TIER CARDS
      ════════════════════════════════════════ */}
      <section
        id="dong-gop"
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(260px, 100%), 1fr))",
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
                {/* Chuyển đến trang quyên góp */}
                <button
                  onClick={() => navigate("/quyen-gop")}
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
        id="vinh-danh"
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
              gridTemplateColumns: "repeat(auto-fit, minmax(min(180px, 100%), 1fr))",
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
            gridTemplateColumns: "repeat(auto-fit, minmax(min(220px, 100%), 1fr))",
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
              {[
                { key: "facebook",  letter: "f",  icon: null           },
                { key: "youtube",   letter: null, icon: "smart_display" },
                { key: "community", letter: null, icon: "groups"        },
              ].map(({ key, letter, icon }) => (
                <div className="social-icon" key={key} title={key}>
                  {icon ? (
                    <span className="material-symbols-outlined" style={{ fontSize: "18px", color: "#8B1A1A" }}>
                      {icon}
                    </span>
                  ) : (
                    <span style={{ fontSize: "15px", fontWeight: 700, color: "#8B1A1A", fontFamily: "'Playfair Display', serif", lineHeight: 1, textTransform: "uppercase" }}>
                      {letter}
                    </span>
                  )}
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
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <input
                type="email"
                placeholder="Email của bạn"
                style={{
                  flex: "1 1 160px",
                  minWidth: 0,
                  background: "rgba(253,245,238,0.70)",
                  border: "0.5px solid rgba(196,149,106,0.45)",
                  borderRadius: "6px",
                  padding: "0.75rem 0.75rem",
                  color: "#3D2B1A",
                  fontSize: "1rem",
                  outline: "none",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                }}
              />
              <button
                style={{
                  background: "#8B1A1A",
                  border: "none",
                  borderRadius: "6px",
                  padding: "0.75rem 1rem",
                  minHeight: "44px",
                  color: "#FDF5EE",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  transition: "background 0.2s",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  whiteSpace: "nowrap",
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
        {/* Nút donate cố định — trỏ đến trang quyên góp */}
        <button
          onClick={() => navigate("/quyen-gop")}
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
      {/* ════════════════════════════════════════
          VIDEO MODAL
      ════════════════════════════════════════ */}
      {videoModal.open && (
        <div
          className="video-modal-overlay"
          onClick={() => setVideoModal({ open: false, title: '', youtubeId: '' })}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "rgba(61,43,26,0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          <div
            className="video-modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "900px",
              background: "#FDF5EE",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 8px 48px rgba(61,43,26,0.32), 0 0 0 1px rgba(212,184,150,0.6)",
              border: "1px solid #D4B896",
              position: "relative",
            }}
          >
            {/* ── Góc trang trí ── */}
            {[
              { top: 0,    left: 0,    borderTop: "2px solid #C4956A", borderLeft:  "2px solid #C4956A", borderRadius: "4px 0 0 0"    },
              { top: 0,    right: 0,   borderTop: "2px solid #C4956A", borderRight: "2px solid #C4956A", borderRadius: "0 4px 0 0"    },
              { bottom: 0, left: 0,    borderBottom: "2px solid #C4956A", borderLeft:  "2px solid #C4956A", borderRadius: "0 0 0 4px" },
              { bottom: 0, right: 0,   borderBottom: "2px solid #C4956A", borderRight: "2px solid #C4956A", borderRadius: "0 0 4px 0" },
            ].map((s, i) => (
              <div key={i} style={{ position: "absolute", width: 20, height: 20, zIndex: 2, ...s }} />
            ))}

            {/* ── Header ── */}
            <div style={{
              padding: "1.25rem 1.5rem 1.1rem",
              background: "linear-gradient(180deg, #FAE8DA 0%, #FDF5EE 100%)",
              borderBottom: "0.5px solid #D4B896",
              position: "relative",
            }}>
              {/* Nút đóng */}
              <button
                onClick={() => setVideoModal({ open: false, title: '', youtubeId: '' })}
                style={{
                  position: "absolute",
                  top: "1rem",
                  right: "1rem",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: "rgba(196,149,106,0.15)",
                  border: "1px solid #D4B896",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#5C3A1E",
                  transition: "all 0.2s",
                  zIndex: 3,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#8B1A1A";
                  e.currentTarget.style.borderColor = "#8B1A1A";
                  e.currentTarget.style.color = "#FDF5EE";
                  e.currentTarget.style.transform = "scale(1.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(196,149,106,0.15)";
                  e.currentTarget.style.borderColor = "#D4B896";
                  e.currentTarget.style.color = "#5C3A1E";
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>close</span>
              </button>

              {/* Nhãn danh mục */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.4rem" }}>
                <p style={{
                  color: "#8B1A1A",
                  fontSize: "0.62rem",
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 700,
                  margin: 0,
                }}>
                  Kho Phim Lịch Sử
                </p>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  background: "rgba(139,26,26,0.08)",
                  border: "0.5px solid rgba(139,26,26,0.25)",
                  borderRadius: "20px",
                  padding: "1px 8px",
                  color: "#8B1A1A",
                  fontSize: "0.6rem",
                  fontFamily: "'Be Vietnam Pro', sans-serif",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8B1A1A", display: "inline-block", animation: "bounce-arrow 1.4s ease-in-out infinite" }} />
                  ĐANG PHÁT
                </span>
              </div>

              {/* Tiêu đề */}
              <h3 style={{
                color: "#3D2B1A",
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(1rem, 2.5vw, 1.4rem)",
                fontWeight: 700,
                margin: "0 3rem 1rem 0",
                lineHeight: 1.3,
              }}>
                {videoModal.title}
              </h3>

              {/* Divider trang trí */}
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, #C4956A 0%, rgba(196,149,106,0.2) 70%, transparent 100%)" }} />
                <span style={{ color: "rgba(196,149,106,0.6)", fontSize: "0.65rem" }}>✦</span>
              </div>
            </div>

            {/* ── Video iframe ── */}
            <div style={{ position: "relative", width: "100%", paddingTop: "56.25%", background: "#000" }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoModal.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                title={videoModal.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
              />
            </div>

            {/* ── Footer ── */}
            <div style={{
              padding: "0.55rem 1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.4rem",
              borderTop: "0.5px solid #D4B896",
              background: "#FAE8DA",
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: "11px", color: "#A0794E" }}>keyboard</span>
              <span style={{ color: "#A0794E", fontSize: "0.67rem", fontFamily: "'Be Vietnam Pro', sans-serif", letterSpacing: "0.04em" }}>
                Nhấn{" "}
                <span style={{
                  background: "rgba(196,149,106,0.18)",
                  border: "0.5px solid #C4956A",
                  borderRadius: "3px",
                  padding: "0 5px",
                  fontSize: "0.62rem",
                  color: "#7B4A00",
                  fontFamily: "monospace",
                  letterSpacing: 0,
                }}>ESC</span>{" "}
                hoặc bấm ra ngoài để đóng
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
