import { useReducer, useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { fetchDonationTiers, createDonation } from '../../lib/api'
import { formatVND } from '../../lib/format'
import StatusBadge from '../ui/StatusBadge'

// ─── State Machine ──────────────────────────────────────────────────

const INITIAL = {
  step: 'tier_select',
  selectedTier: null, customAmount: '',
  donorName: '', donorEmail: '', donorPhone: '', message: '',
  isAnonymous: false, showOnBoard: true,
  paymentMethod: null, publicId: null, errorMessage: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'SELECT_TIER':    return { ...state, selectedTier: action.tier, customAmount: '' }
    case 'SET_AMOUNT':     return { ...state, customAmount: action.value, selectedTier: null }
    case 'SET_FIELD':      return { ...state, [action.field]: action.value }
    case 'NEXT_STEP': {
      const order = ['tier_select', 'donor_info', 'payment']
      const idx = order.indexOf(state.step)
      return { ...state, step: idx < order.length - 1 ? order[idx + 1] : state.step }
    }
    case 'PREV_STEP': {
      const order = ['tier_select', 'donor_info', 'payment']
      const idx = order.indexOf(state.step)
      return { ...state, step: idx > 0 ? order[idx - 1] : state.step }
    }
    case 'SET_PAYMENT':    return { ...state, paymentMethod: action.method }
    case 'SUBMIT_START':   return { ...state, step: 'submitting' }
    case 'SUBMIT_SUCCESS': return { ...state, step: 'success', publicId: action.publicId }
    case 'SUBMIT_ERROR':   return { ...state, step: 'error', errorMessage: action.message }
    case 'RESET':          return INITIAL
    default:               return state
  }
}

// ─── Shared card style ─────────────────────────────────────────────

const heritageCard = {
  background: '#FDF5EE',
  border: '0.5px solid #D4B896',
  borderRadius: '0.75rem',
  boxShadow: '0 2px 12px rgba(61,43,26,0.07)',
}

// ─── Step Indicator ────────────────────────────────────────────────

const STEPS = [
  { id: 'tier_select', label: 'Chọn Mức', num: 1 },
  { id: 'donor_info',  label: 'Thông Tin', num: 2 },
  { id: 'payment',     label: 'Thanh Toán', num: 3 },
  { id: 'success',     label: 'Xác Nhận',  num: 4 },
]

function StepIndicator({ currentStep }) {
  const currentNum = STEPS.find(s => s.id === currentStep)?.num ?? 1
  return (
    <>
      {/* Mobile */}
      <div className="sm:hidden mb-6" style={{ color: '#8B1A1A', fontSize: '0.85rem', textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>
        Bước {Math.min(currentNum, 3)} / 3
      </div>
      {/* Desktop */}
      <div className="hidden sm:flex items-center justify-center mb-8 gap-0">
        {STEPS.map((step, i) => {
          const done    = currentNum > step.num || currentStep === 'success'
          const active  = currentStep === step.id
          const upcoming = !done && !active
          return (
            <div key={step.id} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && (
                <div style={{ width: 48, height: 2, background: done ? '#8B1A1A' : 'rgba(61,43,26,0.12)' }} />
              )}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: done ? '#8B1A1A' : active ? '#C4956A' : 'transparent',
                  border: upcoming ? '2px solid rgba(61,43,26,0.2)' : 'none',
                  boxShadow: active ? '0 0 12px rgba(196,149,106,0.35)' : 'none',
                  color: done ? '#FDF5EE' : active ? '#FDF5EE' : 'rgba(61,43,26,0.3)',
                  fontSize: done ? '0.85rem' : '0.8rem', fontWeight: 700,
                  transition: 'all 0.3s',
                }}>
                  {done ? '✓' : step.num}
                </div>
                <span style={{
                  fontSize: '0.65rem', letterSpacing: '0.05em',
                  fontFamily: "'Playfair Display', serif",
                  color: active ? '#8B1A1A' : done ? '#C4956A' : 'rgba(61,43,26,0.35)',
                  transition: 'color 0.3s',
                }}>
                  {step.label}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

// ─── Tier Card ─────────────────────────────────────────────────────

function TierCard({ tier, selected, onSelect }) {
  const perks = Array.isArray(tier.perks) ? tier.perks : (typeof tier.perks === 'string' ? JSON.parse(tier.perks || '[]') : [])
  return (
    <div
      onClick={() => onSelect(tier)}
      className={selected ? 'tier-selected' : ''}
      style={{
        position: 'relative', borderRadius: '0.85rem', padding: '1.5rem',
        background: '#FDF5EE',
        border: selected ? '1px solid #C4956A' : '0.5px solid #D4B896',
        boxShadow: selected ? '0 4px 24px rgba(196,149,106,0.18)' : '0 2px 12px rgba(61,43,26,0.07)',
        cursor: 'pointer', transition: 'all 0.2s',
        transform: selected ? 'scale(1.03)' : 'scale(1)',
      }}
      onMouseEnter={e => { if (!selected) { e.currentTarget.style.borderColor='#C4956A'; e.currentTarget.style.transform='translateY(-2px)' } }}
      onMouseLeave={e => { if (!selected) { e.currentTarget.style.borderColor='#D4B896'; e.currentTarget.style.transform='translateY(0)' } }}
    >
      {selected && (
        <div style={{
          position: 'absolute', top: -8, right: -8, width: 24, height: 24,
          background: '#8B1A1A', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#FDF5EE', fontSize: '0.7rem', fontWeight: 700,
        }}>✓</div>
      )}
      {tier.badge_url && (
        <img src={tier.badge_url} alt={tier.name} style={{ width: 48, height: 48, display: 'block', margin: '0 auto 0.75rem', objectFit: 'contain' }} />
      )}
      <div style={{ color: '#3D2B1A', fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{tier.name}</div>
      <div style={{ color: '#8B1A1A', fontSize: '0.85rem', textAlign: 'center', marginBottom: '1rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>
        {tier.amount_max ? `${formatVND(tier.amount_min)} – ${formatVND(tier.amount_max)}` : `Từ ${formatVND(tier.amount_min)}`}
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {perks.slice(0, 4).map((p, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: '#5C3A1E', fontSize: '0.8rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
            <span style={{ color: '#C4956A', flexShrink: 0 }}>✓</span>{p}
          </li>
        ))}
        {perks.length > 4 && (
          <li style={{ color: '#A0794E', fontSize: '0.75rem', fontStyle: 'italic', marginTop: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>+{perks.length - 4} quyền lợi khác</li>
        )}
      </ul>
    </div>
  )
}

// ─── Tier Select Step ──────────────────────────────────────────────

function TierSelectStep({ tiers = [], selectedTier, customAmount, onSelect, onSetAmount, onNext }) {
  const [amountError, setAmountError] = useState('')
  const rawAmount = customAmount ? parseInt(customAmount.replace(/\D/g, ''), 10) : 0

  function handleAmountChange(e) {
    const raw = e.target.value.replace(/\D/g, '')
    onSetAmount(raw)
    if (raw && parseInt(raw, 10) < 10000) setAmountError('Số tiền tối thiểu là 10.000 ₫')
    else setAmountError('')
  }

  const displayAmount = customAmount ? parseInt(customAmount, 10).toLocaleString('vi-VN') : ''
  const computedAmount = rawAmount > 0 ? rawAmount : (selectedTier?.amount_min ?? 0)
  const canNext = computedAmount >= 10000

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#8B1A1A', fontSize: '0.72rem', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>
          ĐÓNG GÓP & ỦNG HỘ
        </p>
        <h2 style={{ color: '#3D2B1A', fontSize: '1.5rem', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>
          Chọn Mức Đóng Góp
        </h2>
        <p style={{ color: '#5C3A1E', fontSize: '0.9rem', margin: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Mỗi đóng góp đều là một trang sử được ghi lại</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(tiers.length, 3)}, 1fr)`, gap: '1rem', marginBottom: '1.5rem' }}>
        {tiers.map(t => (
          <TierCard key={t.id} tier={t} selected={selectedTier?.id === t.id} onSelect={onSelect} />
        ))}
      </div>

      <div style={{ ...heritageCard, padding: '1rem 1.25rem' }}>
        <div style={{ color: '#5C3A1E', fontSize: '0.85rem', marginBottom: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Hoặc nhập số tiền tuỳ ý:</div>
        <div style={{ position: 'relative' }}>
          <input
            type="text" inputMode="numeric"
            className="input-gold" placeholder="Nhập số tiền..."
            value={displayAmount}
            onChange={handleAmountChange}
            style={{ width: '100%', paddingRight: '2.5rem', boxSizing: 'border-box' }}
          />
          <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#C4956A', fontSize: '0.9rem', pointerEvents: 'none', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>₫</span>
        </div>
        {amountError && <div style={{ color: '#8B1A1A', fontSize: '0.75rem', marginTop: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{amountError}</div>}
        <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tối thiểu 10.000 ₫</div>
      </div>

      <button
        onClick={onNext} disabled={!canNext}
        className="btn-epic"
        style={{ width: '100%', marginTop: '1.5rem', padding: '0.85rem', fontSize: '0.95rem', opacity: canNext ? 1 : 0.5, cursor: canNext ? 'pointer' : 'not-allowed' }}
      >
        TIẾP THEO →
      </button>
    </div>
  )
}

// ─── Donor Info Step ───────────────────────────────────────────────

const donorSchema = z.object({
  donorName:  z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(100).optional(),
  donorEmail: z.string().email('Email không hợp lệ').max(100),
  donorPhone: z.union([
    z.string().regex(/^(0|\+84)(3[2-9]|5[689]|7[06-9]|8[0-689]|9[0-46-9])\d{7}$/, 'Số điện thoại không hợp lệ'),
    z.literal(''),
  ]).optional(),
  message: z.string().max(500, 'Tối đa 500 ký tự').optional(),
})

function Toggle({ checked, onChange, disabled }) {
  return (
    <button type="button" onClick={() => !disabled && onChange(!checked)}
      style={{
        position: 'relative', display: 'inline-flex', width: 44, height: 24, borderRadius: 9999,
        background: checked ? '#8B1A1A' : 'rgba(61,43,26,0.1)',
        border: checked ? 'none' : '0.5px solid #D4B896',
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1,
        transition: 'background 0.2s', flexShrink: 0,
      }}>
      <span style={{
        position: 'absolute', top: 2, left: 2, width: 20, height: 20, borderRadius: '50%', background: '#fff',
        transition: 'transform 0.2s', transform: checked ? 'translateX(20px)' : 'translateX(0)',
        boxShadow: '0 1px 3px rgba(61,43,26,0.2)',
      }} />
    </button>
  )
}

const labelStyle = { display: 'block', color: '#5C3A1E', fontSize: '0.8rem', marginBottom: '0.4rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 500 }
const hintStyle  = { color: '#A0794E', fontSize: '0.72rem', marginTop: '0.25rem', fontFamily: "'Be Vietnam Pro', sans-serif" }
const errStyle   = { color: '#8B1A1A', fontSize: '0.75rem', marginTop: '0.3rem', fontFamily: "'Be Vietnam Pro', sans-serif" }

function DonorInfoStep({ state, dispatch, onNext, onPrev }) {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    resolver: zodResolver(donorSchema),
    defaultValues: { donorName: state.donorName, donorEmail: state.donorEmail, donorPhone: state.donorPhone, message: state.message },
  })
  const msgValue = watch('message', '') || ''
  const msgLen   = msgValue.length

  const onSubmit = (data) => {
    Object.entries(data).forEach(([k, v]) => dispatch({ type: 'SET_FIELD', field: k, value: v || '' }))
    onNext()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 style={{ color: '#3D2B1A', fontSize: '1.3rem', margin: '0 0 1.5rem', textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Thông Tin Đóng Góp</h2>

      {/* Anonymous toggle */}
      <div style={{ ...heritageCard, padding: '0.85rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', cursor: 'pointer' }}
        onClick={() => {
          const next = !state.isAnonymous
          dispatch({ type: 'SET_FIELD', field: 'isAnonymous', value: next })
          if (next) dispatch({ type: 'SET_FIELD', field: 'showOnBoard', value: false })
        }}>
        <div>
          <div style={{ color: '#3D2B1A', fontSize: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>🎭 Đóng góp ẩn danh</div>
          <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tên bạn sẽ được ẩn trên Bảng Danh Dự</div>
        </div>
        <Toggle checked={state.isAnonymous} onChange={(v) => { dispatch({ type:'SET_FIELD',field:'isAnonymous',value:v }); if(v) dispatch({type:'SET_FIELD',field:'showOnBoard',value:false}) }} />
      </div>

      {/* Name */}
      <div style={{ maxHeight: state.isAnonymous ? 0 : 120, opacity: state.isAnonymous ? 0 : 1, overflow: 'hidden', transition: 'all 0.2s ease', marginBottom: state.isAnonymous ? 0 : '1rem' }}>
        <label style={labelStyle}>Tên hiển thị *</label>
        <input {...register('donorName')} className="input-gold" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="Nguyễn Văn A" />
        {errors.donorName && <div style={errStyle}>{errors.donorName.message}</div>}
        <div style={hintStyle}>Tên này sẽ xuất hiện trên Bảng Danh Dự</div>
      </div>

      {/* Email */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Email *</label>
        <input {...register('donorEmail')} className="input-gold" type="email" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="email@example.com" />
        {errors.donorEmail && <div style={errStyle}>{errors.donorEmail.message}</div>}
        <div style={hintStyle}>Biên lai xác nhận sẽ gửi về email này</div>
      </div>

      {/* Phone */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={labelStyle}>Số điện thoại <span style={{ color: '#A0794E' }}>(không bắt buộc)</span></label>
        <input {...register('donorPhone')} className="input-gold" type="tel" inputMode="tel" style={{ width: '100%', boxSizing: 'border-box' }} placeholder="0912 345 678" />
        {errors.donorPhone && <div style={errStyle}>{errors.donorPhone.message}</div>}
      </div>

      {/* Message */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={labelStyle}>Lời nhắn <span style={{ color: '#A0794E' }}>(không bắt buộc)</span></label>
        <textarea {...register('message')} className="input-gold" rows={3} style={{ width: '100%', resize: 'none', boxSizing: 'border-box' }} placeholder="Một lời nhắn gửi đến dự án..." />
        <div style={{ textAlign: 'right', fontSize: '0.72rem', marginTop: '0.25rem', color: msgLen > 480 ? '#8B1A1A' : msgLen > 400 ? '#C4956A' : '#A0794E', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
          {msgLen} / 500
        </div>
        {errors.message && <div style={errStyle}>{errors.message.message}</div>}
      </div>

      {/* Show on board */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem', borderRadius: '0.5rem', background: 'rgba(250,232,218,0.5)', border: '0.5px solid #D4B896', marginBottom: '1.5rem', opacity: state.isAnonymous ? 0.4 : 1 }}>
        <div>
          <div style={{ color: '#3D2B1A', fontSize: '0.82rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>🏆 Hiển thị tên trên Bảng Danh Dự</div>
          <div style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: 2, fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tắt nếu bạn muốn đóng góp lặng lẽ</div>
        </div>
        <Toggle checked={state.showOnBoard} disabled={state.isAnonymous}
          onChange={(v) => dispatch({ type: 'SET_FIELD', field: 'showOnBoard', value: v })} />
      </div>

      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button type="button" onClick={onPrev}
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #C4956A', borderRadius: '0.5rem', background: 'transparent', color: '#7B4A00', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          ← QUAY LẠI
        </button>
        <button type="submit" className="btn-epic" style={{ flex: 2, padding: '0.75rem', fontSize: '0.9rem' }}>TIẾP THEO →</button>
      </div>
    </form>
  )
}

// ─── Payment Step ──────────────────────────────────────────────────

const BANK_INFO = { name: 'Vietcombank', account: '1234567890', holder: 'QUY BAO TON DI SAN SU VIET', qrUrl: '/images/qr-code.png' }

function CopyField({ label, value }) {
  const [copied, setCopied] = useState(false)
  function copy() {
    navigator.clipboard.writeText(value).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '0.5px solid #D4B896' }}>
      <span style={{ color: '#A0794E', fontSize: '0.8rem', width: 140, flexShrink: 0, fontFamily: "'Be Vietnam Pro', sans-serif" }}>{label}</span>
      <span style={{ color: '#3D2B1A', fontFamily: 'monospace', fontSize: '0.85rem', flex: 1 }}>{value}</span>
      <button onClick={copy} title={copied ? 'Đã sao chép!' : 'Sao chép'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.85rem', color: copied ? '#C4956A' : '#A0794E', transition: 'color 0.2s', padding: '2px 4px' }}>
        {copied ? '✓' : '📋'}
      </button>
    </div>
  )
}

function PaymentStep({ state, dispatch, computedAmount, onSubmit, onPrev, isPending }) {
  const methods = [
    { id: 'bank_transfer', icon: '🏦', label: 'Chuyển Khoản Ngân Hàng', sub: 'Mọi ngân hàng • Internet Banking' },
    { id: 'qr',            icon: '📱', label: 'Quét Mã QR',            sub: 'Nhanh hơn, tự động đối soát' },
  ]
  return (
    <div>
      <h2 style={{ color: '#3D2B1A', fontSize: '1.3rem', margin: '0 0 1.5rem', textAlign: 'center', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Phương Thức Thanh Toán</h2>

      {/* Method selector */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        {methods.map(m => (
          <div key={m.id} onClick={() => dispatch({ type: 'SET_PAYMENT', method: m.id })}
            style={{
              flex: 1, padding: '1rem', borderRadius: '0.75rem', cursor: 'pointer', textAlign: 'center',
              background: '#FDF5EE',
              border: state.paymentMethod === m.id ? '1px solid #C4956A' : '0.5px solid #D4B896',
              boxShadow: state.paymentMethod === m.id ? '0 4px 16px rgba(196,149,106,0.15)' : '0 2px 8px rgba(61,43,26,0.06)',
              transition: 'all 0.2s',
            }}>
            <div style={{ fontSize: '1.8rem', marginBottom: '0.4rem' }}>{m.icon}</div>
            <div style={{ color: '#3D2B1A', fontSize: '0.82rem', marginBottom: '0.25rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{m.label}</div>
            <div style={{ color: '#A0794E', fontSize: '0.72rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Panel */}
      {state.paymentMethod && (
        <div style={{ ...heritageCard, padding: '1.25rem' }}>
          {state.paymentMethod === 'bank_transfer' ? (
            <>
              <div style={{ color: '#C4956A', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Thông Tin Chuyển Khoản</div>
              <CopyField label="Ngân hàng"      value={BANK_INFO.name} />
              <CopyField label="Số tài khoản"   value={BANK_INFO.account} />
              <CopyField label="Chủ tài khoản"  value={BANK_INFO.holder} />
              <CopyField label="Số tiền"         value={formatVND(computedAmount)} />
              <div style={{ background: '#FAE8DA', border: '0.5px solid rgba(139,26,26,0.25)', borderRadius: '0.5rem', padding: '0.85rem', marginTop: '1rem' }}>
                <div style={{ color: '#7B4A00', fontSize: '0.72rem', marginBottom: '0.35rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>⚠ Nội dung chuyển khoản (bắt buộc để đối soát):</div>
                <CopyField label="" value="SVAH-XXXXXX" />
              </div>
              <div style={{ color: '#A0794E', fontSize: '0.75rem', marginTop: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>💡 Giao dịch sẽ được xác nhận trong vòng 24 giờ</div>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#C4956A', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.85rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Quét Mã QR Để Thanh Toán</div>
              <div style={{ width: 240, height: 240, margin: '0 auto 1rem', background: '#FAE8DA', border: '0.5px solid #D4B896', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                QR
              </div>
              <div style={{ color: '#8B1A1A', fontSize: '1.1rem', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>{formatVND(computedAmount)}</div>
              <div style={{ color: '#A0794E', fontSize: '0.78rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Tương thích: MB Bank, VCB, Momo, ZaloPay, VietQR</div>
              <div style={{ marginTop: '0.75rem' }}>
                <CopyField label="Nội dung:" value="SVAH-XXXXXX" />
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
        <button onClick={onPrev}
          style={{ flex: 1, padding: '0.75rem', border: '1px solid #C4956A', borderRadius: '0.5rem', background: 'transparent', color: '#7B4A00', fontFamily: "'Be Vietnam Pro', sans-serif", fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
          ← QUAY LẠI
        </button>
        <button onClick={onSubmit} className="btn-epic" disabled={!state.paymentMethod || isPending}
          style={{ flex: 2, padding: '0.75rem', fontSize: '0.9rem', opacity: (!state.paymentMethod || isPending) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {isPending && <span style={{ width: 16, height: 16, border: '2px solid rgba(253,245,238,0.4)', borderTopColor: '#FDF5EE', borderRadius: '50%', display: 'inline-block' }} className="animate-spin" />}
          XÁC NHẬN ĐÓNG GÓP
        </button>
      </div>
    </div>
  )
}

// ─── Success Step ──────────────────────────────────────────────────

function SuccessStep({ state, selectedTier, onReset }) {
  const code = `SVAH-${(state.publicId || 'XXXXXX').slice(0, 6).toUpperCase()}`
  const [copied, setCopied] = useState(false)
  const perks = Array.isArray(selectedTier?.perks) ? selectedTier.perks : []

  function copyCode() {
    navigator.clipboard.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }).catch(() => {})
  }
  function shareNative() {
    if (navigator.share) navigator.share({ title: 'Sử Việt Anh Hùng', text: `Tôi vừa đóng góp cho dự án Sử Việt Anh Hùng! 🇻🇳`, url: window.location.origin })
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
      {selectedTier?.badge_url && (
        <img src={selectedTier.badge_url} alt="badge" className="float-anim" style={{ width: 120, height: 120, objectFit: 'contain', margin: '0 auto 1.5rem', display: 'block' }} />
      )}
      {!selectedTier?.badge_url && (
        <div className="float-anim" style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🏆</div>
      )}

      <h2 style={{ color: '#8B1A1A', fontSize: '1.6rem', margin: '0 0 0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 700 }}>Cảm Ơn Bạn Đã Đồng Hành</h2>
      {!state.isAnonymous && state.donorName && (
        <p style={{ color: '#5C3A1E', fontSize: '1rem', margin: '0 0 1.5rem', fontFamily: "'Playfair Display', serif" }}>
          {state.donorName}{selectedTier ? ` — ${selectedTier.name}` : ''}
        </p>
      )}

      {/* Tracking code */}
      <div style={{ ...heritageCard, padding: '1.25rem', margin: '1.5rem auto', display: 'inline-block', minWidth: 280, textAlign: 'center' }}>
        <div style={{ color: '#A0794E', fontSize: '0.72rem', letterSpacing: '0.1em', marginBottom: '0.4rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>MÃ THEO DÕI</div>
        <div style={{ fontFamily: 'monospace', color: '#3D2B1A', fontSize: '1.5rem', letterSpacing: '0.2em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
          {code}
          <button onClick={copyCode} style={{ background: 'none', border: 'none', cursor: 'pointer', color: copied ? '#C4956A' : '#A0794E', fontSize: '1rem', padding: 0 }}>{copied ? '✓' : '📋'}</button>
        </div>
        <div style={{ color: '#A0794E', fontSize: '0.72rem', marginTop: '0.4rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Lưu mã này để kiểm tra trạng thái</div>
      </div>

      <div style={{ color: '#5C3A1E', fontSize: '0.85rem', marginBottom: '0.75rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
        📧 Biên lai đã gửi về <strong style={{ color: '#8B1A1A' }}>{state.donorEmail}</strong>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <StatusBadge status="pending" type="donation" />
      </div>

      {perks.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ height: 1, background: 'linear-gradient(90deg, transparent, rgba(196,149,106,0.4), transparent)', marginBottom: '1rem' }} />
          <div style={{ color: '#C4956A', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Quyền Lợi Của Bạn</div>
          {perks.map((p, i) => (
            <div key={i} style={{ color: '#5C3A1E', fontSize: '0.85rem', padding: '0.2rem 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>✓ {p}</div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {typeof navigator !== 'undefined' && navigator.share && (
          <button onClick={shareNative} className="btn-epic" style={{ padding: '0.6rem 1.25rem', fontSize: '0.82rem' }}>Chia sẻ</button>
        )}
        <Link to="/quyen-gop#board" style={{ padding: '0.6rem 1.25rem', border: '1px solid #C4956A', borderRadius: '0.5rem', color: '#7B4A00', fontSize: '0.82rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 600 }}>Xem Bảng Danh Dự</Link>
        <Link to="/" style={{ padding: '0.6rem 1.25rem', border: '0.5px solid #D4B896', borderRadius: '0.5rem', color: '#A0794E', fontSize: '0.82rem', textDecoration: 'none', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Về Trang Chủ</Link>
      </div>

      <button onClick={onReset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#A0794E', fontSize: '0.78rem', marginTop: '0.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>Đóng góp thêm</button>
    </div>
  )
}

// ─── Order Summary Sidebar ─────────────────────────────────────────

function OrderSummary({ selectedTier, computedAmount, onReset }) {
  const perks = Array.isArray(selectedTier?.perks) ? selectedTier.perks : []
  if (!selectedTier && !computedAmount) return null
  return (
    <div style={{ ...heritageCard, padding: '1.5rem', position: 'sticky', top: '1.5rem' }}>
      <div style={{ color: '#C4956A', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Tóm Tắt Đóng Góp</div>
      {selectedTier?.badge_url && <img src={selectedTier.badge_url} alt="" style={{ width: 56, height: 56, display: 'block', margin: '0 auto 0.75rem', objectFit: 'contain' }} />}
      {selectedTier && <div style={{ color: '#3D2B1A', fontSize: '1rem', textAlign: 'center', marginBottom: '0.5rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>{selectedTier.name}</div>}
      <div style={{ color: '#8B1A1A', fontSize: '1.3rem', textAlign: 'center', marginBottom: '1rem', fontFamily: "'Be Vietnam Pro', sans-serif", fontWeight: 700 }}>{formatVND(computedAmount)}</div>
      {perks.length > 0 && (
        <>
          <div style={{ height: '0.5px', background: '#D4B896', marginBottom: '0.75rem' }} />
          {perks.slice(0, 4).map((p, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.4rem', color: '#5C3A1E', fontSize: '0.78rem', padding: '0.2rem 0', fontFamily: "'Be Vietnam Pro', sans-serif" }}>
              <span style={{ color: '#C4956A', flexShrink: 0 }}>✓</span>{p}
            </div>
          ))}
        </>
      )}
      <button onClick={onReset} style={{ display: 'block', width: '100%', marginTop: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: '#A0794E', fontSize: '0.75rem', fontFamily: "'Playfair Display', serif" }}>Thay đổi →</button>
    </div>
  )
}

// ─── Main Wizard ───────────────────────────────────────────────────

export default function DonationWizard() {
  const [state, dispatch] = useReducer(reducer, INITIAL)
  const { data: tiersData } = useQuery({ queryKey: ['donation-tiers'], queryFn: fetchDonationTiers })
  const tiers = Array.isArray(tiersData) ? tiersData : (tiersData?.data || [])

  const mutation = useMutation({
    mutationFn: createDonation,
    onSuccess: (data) => dispatch({ type: 'SUBMIT_SUCCESS', publicId: data?.public_id || data?.id || 'NEW' }),
    onError:   (err)  => dispatch({ type: 'SUBMIT_ERROR',   message: err.message }),
  })

  const rawCustom      = state.customAmount ? parseInt(state.customAmount.replace(/\D/g,''), 10) : 0
  const computedAmount = rawCustom > 0 ? rawCustom : (state.selectedTier?.amount_min ?? 0)

  function submitDonation() {
    dispatch({ type: 'SUBMIT_START' })
    mutation.mutate({
      tier_id:        state.selectedTier?.id ?? null,
      donor_name:     state.donorName,
      donor_email:    state.donorEmail,
      donor_phone:    state.donorPhone,
      amount:         computedAmount,
      message:        state.message,
      is_anonymous:   state.isAnonymous,
      show_on_board:  state.showOnBoard,
      payment_method: state.paymentMethod,
    })
  }

  const showSidebar = !['success', 'error', 'submitting'].includes(state.step)

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '3rem 1.5rem' }}>
      <div style={{ display: 'grid', gap: '2rem' }} className="lg:grid-cols-[1fr_280px]">
        {/* Main */}
        <div style={{ position: 'relative' }}>
          {state.step !== 'success' && state.step !== 'error' && <StepIndicator currentStep={state.step} />}

          {state.step === 'tier_select' && (
            <TierSelectStep tiers={tiers} selectedTier={state.selectedTier} customAmount={state.customAmount}
              onSelect={(tier) => dispatch({ type: 'SELECT_TIER', tier })}
              onSetAmount={(v) => dispatch({ type: 'SET_AMOUNT', value: v })}
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
            />
          )}
          {state.step === 'donor_info' && (
            <DonorInfoStep state={state} dispatch={dispatch}
              onNext={() => dispatch({ type: 'NEXT_STEP' })}
              onPrev={() => dispatch({ type: 'PREV_STEP' })}
            />
          )}
          {state.step === 'payment' && (
            <PaymentStep state={state} dispatch={dispatch} selectedTier={state.selectedTier}
              computedAmount={computedAmount} onSubmit={submitDonation}
              onPrev={() => dispatch({ type: 'PREV_STEP' })} isPending={mutation.isPending}
            />
          )}
          {state.step === 'submitting' && (
            <div style={{ textAlign: 'center', padding: '4rem 0' }}>
              <div style={{ width: 64, height: 64, border: '4px solid rgba(196,149,106,0.25)', borderTopColor: '#8B1A1A', borderRadius: '50%', margin: '0 auto 1.5rem' }} className="animate-spin" />
              <div style={{ color: '#C4956A', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Đang xử lý...</div>
            </div>
          )}
          {state.step === 'success' && (
            <SuccessStep state={state} selectedTier={state.selectedTier} onReset={() => dispatch({ type: 'RESET' })} />
          )}
          {state.step === 'error' && (
            <div style={{ textAlign: 'center', padding: '3rem 0' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠</div>
              <div style={{ color: '#3D2B1A', fontSize: '1.1rem', marginBottom: '0.75rem', fontFamily: "'Playfair Display', serif", fontWeight: 600 }}>Đã xảy ra lỗi</div>
              <div style={{ color: '#5C3A1E', fontSize: '0.85rem', marginBottom: '1.5rem', fontFamily: "'Be Vietnam Pro', sans-serif" }}>{state.errorMessage}</div>
              <button onClick={() => dispatch({ type: 'PREV_STEP' })} className="btn-epic" style={{ padding: '0.75rem 2rem' }}>Thử lại</button>
            </div>
          )}
        </div>

        {/* Sidebar (desktop only) */}
        {showSidebar && (
          <div className="hidden lg:block">
            <OrderSummary selectedTier={state.selectedTier} computedAmount={computedAmount} onReset={() => dispatch({ type: 'RESET' })} />
          </div>
        )}
      </div>
    </div>
  )
}
