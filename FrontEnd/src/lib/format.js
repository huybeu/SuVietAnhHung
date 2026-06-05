export function formatVND(amount) {
  if (amount == null) return '0 ₫'
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)
}

export function formatDate(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso))
}

export function formatDateShort(iso) {
  if (!iso) return ''
  return new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(iso))
}

export function formatDuration(secs) {
  if (secs == null) return ''
  const pad = n => String(n).padStart(2, '0')
  if (secs < 60) return '0:' + pad(secs)
  if (secs < 3600) return Math.floor(secs / 60) + ':' + pad(secs % 60)
  return Math.floor(secs / 3600) + ':' + pad(Math.floor((secs % 3600) / 60)) + ':' + pad(secs % 60)
}

export function formatYear(year) {
  if (year === null || year === undefined) return '?'
  if (year < 0) return Math.abs(year) + ' TCN'
  return year + ' CN'
}

const VIET_MAP = {
  à:'a',á:'a',â:'a',ã:'a',ä:'a',å:'a',ā:'a',ă:'a',ặ:'a',ắ:'a',ẳ:'a',ẵ:'a',ặ:'a',
  ầ:'a',ấ:'a',ẩ:'a',ẫ:'a',ậ:'a',à:'a',á:'a',ả:'a',ã:'a',ạ:'a',
  è:'e',é:'e',ê:'e',ë:'e',ế:'e',ề:'e',ể:'e',ễ:'e',ệ:'e',ẻ:'e',ẽ:'e',ẹ:'e',
  ì:'i',í:'i',ĩ:'i',ỉ:'i',ị:'i',î:'i',ï:'i',
  ò:'o',ó:'o',ô:'o',õ:'o',ö:'o',ø:'o',ơ:'o',ồ:'o',ố:'o',ổ:'o',ỗ:'o',ộ:'o',
  ờ:'o',ớ:'o',ở:'o',ỡ:'o',ợ:'o',ỏ:'o',ọ:'o',
  ù:'u',ú:'u',ü:'u',ư:'u',ừ:'u',ứ:'u',ử:'u',ữ:'u',ự:'u',ủ:'u',ụ:'u',û:'u',ũ:'u',
  ỳ:'y',ý:'y',ỷ:'y',ỹ:'y',ỵ:'y',
  đ:'d',
  À:'a',Á:'a',Â:'a',Ã:'a',Ă:'a',Ặ:'a',Ắ:'a',Ẳ:'a',Ẵ:'a',Ầ:'a',Ấ:'a',Ẩ:'a',Ẫ:'a',Ậ:'a',
  È:'e',É:'e',Ê:'e',Ế:'e',Ề:'e',Ể:'e',Ễ:'e',Ệ:'e',
  Ì:'i',Í:'i',Ĩ:'i',Ỉ:'i',Ị:'i',
  Ò:'o',Ó:'o',Ô:'o',Õ:'o',Ơ:'o',Ồ:'o',Ố:'o',Ổ:'o',Ỗ:'o',Ộ:'o',Ờ:'o',Ớ:'o',Ở:'o',Ỡ:'o',Ợ:'o',
  Ù:'u',Ú:'u',Ư:'u',Ừ:'u',Ứ:'u',Ử:'u',Ữ:'u',Ự:'u',
  Ỳ:'y',Ý:'y',Ỷ:'y',Ỹ:'y',Ỵ:'y',
  Đ:'d',
}

export function slugifyVi(text) {
  if (!text) return ''
  return text
    .split('')
    .map(c => VIET_MAP[c] || c)
    .join('')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}
