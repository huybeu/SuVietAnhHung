import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const TAB_TITLES = {
  tiendo: 'Tiến Độ Dự Án',
  hero: 'Quản Lý Hero Banner',
  leaders: 'Đội Ngũ Dẫn Dắt',
  tiers: 'Các Gói Tài Trợ',
  timeline: 'Tiến Trình Lịch Sử',
  video: 'Kho Dữ Liệu Video',
  honor: 'Bảng Vàng Vinh Danh',
  business: 'Đối Tác Doanh Nghiệp',
  contact: 'Liên Hệ & Ngân Hàng',
};

const NAV_ITEMS = [
  { id: 'tiendo', label: 'Tiến Độ', icon: 'dashboard' },
  { id: 'hero', label: 'Hero Banner', icon: 'campaign' },
  { id: 'leaders', label: 'Đội Ngũ', icon: 'group' },
  { id: 'tiers', label: 'Gói Tài Trợ', icon: 'payments' },
  { id: 'timeline', label: 'Lịch Sử', icon: 'timeline' },
  { id: 'video', label: 'Video', icon: 'play_circle' },
  { id: 'honor', label: 'Vinh Danh', icon: 'analytics' },
  { id: 'business', label: 'Doanh Nghiệp', icon: 'corporate_fare' },
  { id: 'contact', label: 'Liên Hệ', icon: 'account_balance' },
];

function TabTienDo() {
  const [form, setForm] = useState({
    mucTieu: '5,000,000,000',
    daHuyDong: '3,125,000,000',
    soNgay: '45',
    soBaiViet: '128',
    soVideo: '37',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.625;
  const dashOffset = circumference * (1 - progress);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-on-surface font-semibold text-lg mb-4">Thông Số Chiến Dịch</h3>
        {[
          { label: 'Mục tiêu (VNĐ)', name: 'mucTieu' },
          { label: 'Đã huy động (VNĐ)', name: 'daHuyDong' },
          { label: 'Số ngày còn lại', name: 'soNgay' },
          { label: 'Số bài viết', name: 'soBaiViet' },
          { label: 'Số video', name: 'soVideo' },
        ].map((field) => (
          <div key={field.name} className="flex flex-col gap-1">
            <label className="text-on-surface-variant text-sm font-medium">{field.label}</label>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={handleChange}
              className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        ))}
      </div>

      <div className="glass-panel p-6 rounded-2xl flex flex-col items-center justify-center gap-6">
        <h3 className="text-on-surface font-semibold text-lg self-start">Biểu Đồ Tiến Độ</h3>
        <div className="relative flex items-center justify-center">
          <svg width="200" height="200" viewBox="0 0 200 200">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="20"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="crimson"
              strokeWidth="20"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold text-on-surface">62.5%</span>
            <span className="text-xs text-on-surface-variant">Hoàn thành</span>
          </div>
        </div>
        <p className="text-center text-on-surface-variant text-sm italic px-4">
          "Mỗi đồng góp là một nén hương thơm dâng lên anh linh các bậc tiền nhân."
        </p>
        <div className="grid grid-cols-2 gap-4 w-full mt-2">
          <div className="bg-surface-container rounded-xl p-3 text-center">
            <div className="text-primary font-bold text-lg">3.125 tỷ</div>
            <div className="text-on-surface-variant text-xs">Đã huy động</div>
          </div>
          <div className="bg-surface-container rounded-xl p-3 text-center">
            <div className="text-secondary font-bold text-lg">1.875 tỷ</div>
            <div className="text-on-surface-variant text-xs">Còn lại</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabTiers() {
  const [open, setOpen] = useState({ 0: false, 1: false });
  const [tiers, setTiers] = useState([
    {
      name: 'Vệ Binh Sử Việt',
      price: '500,000',
      icon: '🛡️',
      color: '#dc2626',
      benefits: 'Tên xuất hiện trong danh sách vinh danh\nNhận bản đồ lịch sử kỹ thuật số\nCập nhật tiến độ hàng tuần qua email',
    },
    {
      name: 'Đại Sứ Hào Khí',
      price: '5,000,000',
      icon: '⚔️',
      color: '#b45309',
      benefits: 'Tất cả quyền lợi Vệ Binh\nTên khắc trên bia công đức\nVé tham dự buổi ra mắt độc quyền\nGặp gỡ đội ngũ sản xuất\nBộ quà lưu niệm cao cấp',
    },
  ]);

  const toggleOpen = (idx) => {
    setOpen((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const updateTier = (idx, field, value) => {
    setTiers((prev) => prev.map((t, i) => (i === idx ? { ...t, [field]: value } : t)));
  };

  return (
    <div className="space-y-4">
      {tiers.map((tier, idx) => (
        <div key={idx} className="glass-panel rounded-2xl overflow-hidden">
          <button
            onClick={() => toggleOpen(idx)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-surface-container-high transition-colors"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{tier.icon}</span>
              <div>
                <div className="text-on-surface font-semibold">{tier.name}</div>
                <div className="text-primary text-sm font-medium">{tier.price} VNĐ</div>
              </div>
            </div>
            <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-200" style={{ transform: open[idx] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>

          {open[idx] && (
            <div className="px-5 pb-5 space-y-4 border-t border-outline-variant">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Tên gói</label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(idx, 'name', e.target.value)}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Giá (VNĐ)</label>
                  <input
                    type="text"
                    value={tier.price}
                    onChange={(e) => updateTier(idx, 'price', e.target.value)}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Icon</label>
                  <input
                    type="text"
                    value={tier.icon}
                    onChange={(e) => updateTier(idx, 'icon', e.target.value)}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Màu chủ đạo</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={tier.color}
                      onChange={(e) => updateTier(idx, 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-outline-variant cursor-pointer bg-transparent"
                    />
                    <span className="text-on-surface-variant text-sm">{tier.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant text-sm font-medium">Quyền lợi (mỗi dòng một quyền lợi)</label>
                <textarea
                  value={tier.benefits}
                  onChange={(e) => updateTier(idx, 'benefits', e.target.value)}
                  rows={5}
                  className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function TabTimeline() {
  const [item, setItem] = useState({
    name: 'Chiến thắng Bạch Đằng',
    date: '938 SCN',
    description: 'Ngô Quyền đánh tan quân Nam Hán trên sông Bạch Đằng, chấm dứt hơn 1000 năm Bắc thuộc, mở ra kỷ nguyên độc lập tự chủ cho dân tộc Việt.',
    heroes: 'Ngô Quyền, Dương Tam Kha',
    color: '#dc2626',
  });

  const handleChange = (e) => {
    setItem({ ...item, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-on-surface font-semibold text-lg">Sự Kiện Lịch Sử</h3>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-xl hover:bg-primary/30 transition-colors text-sm font-medium">
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm sự kiện
          </button>
        </div>

        <div className="border border-outline-variant rounded-xl p-5 space-y-4">
          <div className="flex items-start gap-4">
            <div className="w-1 h-full min-h-[20px] rounded-full self-stretch mt-1" style={{ backgroundColor: item.color, minWidth: '4px' }} />
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Tên sự kiện</label>
                  <input
                    type="text"
                    name="name"
                    value={item.name}
                    onChange={handleChange}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Thời gian</label>
                  <input
                    type="text"
                    name="date"
                    value={item.date}
                    onChange={handleChange}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-on-surface-variant text-sm font-medium">Mô tả</label>
                <textarea
                  name="description"
                  value={item.description}
                  onChange={handleChange}
                  rows={3}
                  className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors resize-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Anh hùng liên quan</label>
                  <input
                    type="text"
                    name="heroes"
                    value={item.heroes}
                    onChange={handleChange}
                    className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-on-surface-variant text-sm font-medium">Màu sắc</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="color"
                      value={item.color}
                      onChange={handleChange}
                      className="w-10 h-10 rounded-lg border border-outline-variant cursor-pointer bg-transparent"
                    />
                    <span className="text-on-surface-variant text-sm">{item.color}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <button className="flex items-center gap-2 px-4 py-2 bg-error/20 text-error rounded-xl hover:bg-error/30 transition-colors text-sm font-medium">
                  <span className="material-symbols-outlined text-sm">delete</span>
                  Xóa sự kiện
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TabVideo() {
  const [url, setUrl] = useState('');
  const [videos, setVideos] = useState([
    { id: 1, title: 'Trận Bạch Đằng 938 - Ngô Quyền Đại Thắng', url: 'https://www.youtube.com/watch?v=example1' },
    { id: 2, title: 'Hội Nghị Diên Hồng - Tinh Thần Dân Tộc', url: 'https://www.youtube.com/watch?v=example2' },
  ]);
  const [selectedVideo, setSelectedVideo] = useState(videos[0]);

  const handleAdd = () => {
    if (!url.trim()) return;
    const newVideo = { id: Date.now(), title: 'Video mới - ' + url, url };
    setVideos([...videos, newVideo]);
    setUrl('');
  };

  const handleRemove = (id) => {
    setVideos(videos.filter((v) => v.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-on-surface font-semibold text-lg">Quản Lý Video</h3>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Nhập URL YouTube..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors"
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors font-medium flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">add</span>
            Thêm
          </button>
        </div>
        <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
          {videos.map((v) => (
            <div
              key={v.id}
              onClick={() => setSelectedVideo(v)}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${selectedVideo?.id === v.id ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container hover:bg-surface-container-high text-on-surface'}`}
            >
              <span className="material-symbols-outlined text-base flex-shrink-0">play_circle</span>
              <span className="flex-1 text-sm truncate">{v.title}</span>
              <button
                onClick={(e) => { e.stopPropagation(); handleRemove(v.id); }}
                className="text-error hover:text-error/80 transition-colors flex-shrink-0"
              >
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            </div>
          ))}
          {videos.length === 0 && (
            <div className="text-center text-on-surface-variant py-8 text-sm">Chưa có video nào</div>
          )}
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-on-surface font-semibold text-lg">Xem Trước</h3>
        <div className="relative rounded-2xl overflow-hidden aspect-video bg-surface-container group cursor-pointer">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBltOm3-f2l0mmwTHy1zzyLxF5TNRPiug4aranda9maA6mp2wH4n_wiJYV3WTWJxD8afFmR1ZZhRf1c9vT2MDi3V6vF5H1AOZftWbdQGuL8zQNzXp8lV50KW1L4kPd0mRcedvdIG4uPkKeIm8q89hVCAZzjbDTrckgtHWaNwMWNI2BXGkl_KzzlrZff3YnG0NtYBwM74F95ojdxj_aI0-SLYUb4CqzF5GuT0e52Y4JX9JK6FC3PEzgPGWI3AJyebxbQDT6JrkhWjpQ"
            alt="Video preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white text-4xl">play_arrow</span>
            </div>
          </div>
        </div>
        {selectedVideo && (
          <div className="bg-surface-container rounded-xl p-4">
            <div className="text-on-surface font-medium text-sm">{selectedVideo.title}</div>
            <div className="text-on-surface-variant text-xs mt-1 truncate">{selectedVideo.url}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabContact() {
  const [bank, setBank] = useState({
    bankName: 'Vietcombank',
    accountNumber: '1234567890123',
    holderName: 'NGUYEN VAN ANH HUNG',
    transferNote: 'SU VIET ANH HUNG [Ho ten]',
  });
  const [contact, setContact] = useState({
    email: 'admin@suvietan hhung.vn',
    hotline: '0901 234 567',
  });

  const handleBankChange = (e) => setBank({ ...bank, [e.target.name]: e.target.value });
  const handleContactChange = (e) => setContact({ ...contact, [e.target.name]: e.target.value });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="space-y-6">
        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">account_balance</span>
            Thông Tin Ngân Hàng
          </h3>
          {[
            { label: 'Ngân hàng', name: 'bankName' },
            { label: 'Số tài khoản', name: 'accountNumber' },
            { label: 'Chủ tài khoản', name: 'holderName' },
            { label: 'Nội dung chuyển khoản', name: 'transferNote' },
          ].map((field) => (
            <div key={field.name} className="flex flex-col gap-1">
              <label className="text-on-surface-variant text-sm font-medium">{field.label}</label>
              <input
                type="text"
                name={field.name}
                value={bank[field.name]}
                onChange={handleBankChange}
                className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
              />
            </div>
          ))}
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-4">
          <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">contact_phone</span>
            Thông Tin Liên Hệ
          </h3>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={contact.email}
              onChange={handleContactChange}
              className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-on-surface-variant text-sm font-medium">Hotline</label>
            <input
              type="text"
              name="hotline"
              value={contact.hotline}
              onChange={handleContactChange}
              className="bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-on-surface focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <h3 className="text-on-surface font-semibold text-lg flex items-center gap-2">
          <span className="material-symbols-outlined text-primary">qr_code_2</span>
          Mã QR Thanh Toán
        </h3>
        <div className="relative group cursor-pointer rounded-2xl overflow-hidden border border-outline-variant">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZTcAxvmuVTXkBtwsb_vHxgwZrt4CCNo3GWVwzBFA6OmPXRGPx7xBWYAZkczuvDY_rBkPyYsBzFXfaHpj44QEgeMk1M_lPhshJC609fqcEubcu0sF5i7x1F8VRG7qx4PoC-oI-kdEtV9qmbK83BkL4zYG2USR9ba7k66hkYTEGWX0WPpJAv_ta3on2YWALw9tEnjoG_RuAZ6xvFRtdci-ytDoUqqLSc0IEHVL6oyE8uCFgY2xHkCC_901YYDYU7RtGEha3zl7ukWg"
            alt="QR Code"
            className="w-full object-contain max-h-72"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="material-symbols-outlined text-white text-4xl mb-2">upload</span>
            <span className="text-white text-sm font-medium">Tải lên QR mới</span>
          </div>
        </div>
        <p className="text-on-surface-variant text-xs text-center">Di chuột vào ảnh để thay đổi mã QR</p>
        <div className="bg-surface-container rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Ngân hàng:</span>
            <span className="text-on-surface font-medium">{bank.bankName}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Số TK:</span>
            <span className="text-on-surface font-medium font-mono">{bank.accountNumber}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-on-surface-variant">Chủ TK:</span>
            <span className="text-on-surface font-medium">{bank.holderName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderTab({ title }) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="glass-panel p-10 rounded-2xl flex flex-col items-center gap-4 text-center max-w-md">
        <span className="material-symbols-outlined text-primary text-6xl">construction</span>
        <h3 className="text-on-surface font-semibold text-xl">{title}</h3>
        <p className="text-on-surface-variant text-sm">Module đang được phát triển...</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('tiendo');
  const [toast, setToast] = useState(false);

  const showToast = () => {
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('loggedInUser');
    navigate('/dang-nhap');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'tiendo':
        return <TabTienDo />;
      case 'tiers':
        return <TabTiers />;
      case 'timeline':
        return <TabTimeline />;
      case 'video':
        return <TabVideo />;
      case 'contact':
        return <TabContact />;
      default:
        return <PlaceholderTab title={TAB_TITLES[activeTab]} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden dong-son-pattern dark">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-surface-container-lowest border-r border-outline-variant flex flex-col z-20">
        {/* Logo */}
        <div className="p-6 border-b border-outline-variant">
          <div className="text-primary font-bold text-2xl tracking-widest">SỬ VIỆT</div>
          <div className="text-secondary text-xs mt-0.5 tracking-wide uppercase">Quản Trị Hệ Thống</div>
        </div>

        {/* Admin Avatar */}
        <div className="p-4 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOw2BbG70TO5o87gdskYSS66qcDacuinoEDVyzB5XgN-MVgDo07slwnz6FM56jkhWJlZIBaY9gOmZcZWug2VRoI5nrSh53j4mcdMIUbc4jqzlDDTXAvqlUyEjofYBrGhRu8NXEE-gHZvwR9uz6Zt3OFOwyn-AllaOSL66XZIvkMor-NdRT22T_WkF9GeO6NcwXmxmSMmDgbF2fHNCb--vg-r8857j41rskIiTInwiqI_Dfa0EZqKospsChRa0TOrkb8XmUgfj3BFQ"
                alt="Admin"
                className="w-10 h-10 rounded-full object-cover border-2 border-primary/30"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border border-surface-container-lowest" />
            </div>
            <div className="min-w-0">
              <div className="text-on-surface font-semibold text-sm truncate">Admin</div>
              <div className="text-on-surface-variant text-xs truncate">Quản Trị Viên Cao Cấp</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-sm ${
                activeTab === item.id
                  ? 'bg-primary-container text-on-primary-container font-bold'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              <span className="material-symbols-outlined text-xl flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-outline-variant">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">logout</span>
            <span>Đăng xuất</span>
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Navbar */}
        <Navbar />

        {/* Save toast */}
        <div
          className={`fixed top-24 right-8 z-50 flex items-center gap-3 px-5 py-3.5 bg-surface-container-highest border border-outline-variant rounded-2xl shadow-xl transition-all duration-300 ${
            toast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <span className="material-symbols-outlined text-green-400">check_circle</span>
          <span className="text-on-surface text-sm font-medium">Đã lưu thay đổi thành công!</span>
        </div>

        {/* Content area */}
        <main className="flex-1 overflow-y-auto p-8 pt-28 custom-scrollbar">
          {/* Header row */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-on-surface text-2xl font-bold">{TAB_TITLES[activeTab]}</h1>
              <p className="text-on-surface-variant text-sm mt-0.5">Quản lý nội dung và cài đặt hệ thống</p>
            </div>
            <button
              onClick={showToast}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-on-primary rounded-xl hover:bg-primary/90 transition-colors font-semibold shadow-lg"
            >
              <span className="material-symbols-outlined text-base">save</span>
              Lưu thay đổi
            </button>
          </div>

          {/* Tab content */}
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
