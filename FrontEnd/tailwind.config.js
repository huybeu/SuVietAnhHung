/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        /* ── Son đỏ chủ đạo #8B1A1A ── */
        'primary': '#8B1A1A',
        'primary-container': '#8B1A1A',
        'primary-dark': '#6B1414',
        'primary-fixed': '#FAE8DA',
        'primary-fixed-dim': '#F5D5C0',
        'on-primary': '#FDF5EE',
        'on-primary-container': '#FDF5EE',
        'on-primary-fixed': '#6B1414',
        'on-primary-fixed-variant': '#6B1414',
        'inverse-primary': '#D4B896',

        /* ── Vàng đồng cổ #C4956A ── */
        'secondary': '#C4956A',
        'secondary-container': '#7B4A00',
        'secondary-fixed': '#FAE8DA',
        'secondary-fixed-dim': '#D4B896',
        'on-secondary': '#FDF5EE',
        'on-secondary-container': '#FDF5EE',
        'on-secondary-fixed': '#7B4A00',
        'on-secondary-fixed-variant': '#7B4A00',

        /* ── Nâu gỗ quý #7B4A00 ── */
        'tertiary': '#7B4A00',
        'tertiary-container': '#5C3A1E',
        'tertiary-fixed': '#FAE8DA',
        'on-tertiary': '#FDF5EE',
        'on-tertiary-container': '#FDF5EE',
        'on-tertiary-fixed': '#5C3A1E',
        'on-tertiary-fixed-variant': '#5C3A1E',

        /* ── Surfaces: Giấy trầm kem #FDF5EE ── */
        'surface': '#FDF5EE',
        'surface-dim': '#F5D5C0',
        'surface-bright': '#FDF5EE',
        'surface-variant': '#FAE8DA',
        'surface-container-lowest': '#FDF5EE',
        'surface-container-low': '#FAE8DA',
        'surface-container': '#F5D5C0',
        'surface-container-high': '#EDD5B8',
        'surface-container-highest': '#D4B896',
        'surface-tint': '#8B1A1A',

        /* ── Text: Nâu đất nung #3D2B1A ── */
        'on-surface': '#3D2B1A',
        'on-surface-variant': '#5C3A1E',
        'inverse-surface': '#1A0A00',
        'inverse-on-surface': '#FDF5EE',

        /* ── Background ── */
        'background': '#FDF5EE',
        'on-background': '#3D2B1A',

        /* ── Borders: Đồng nhạt #D4B896 ── */
        'outline': '#C4956A',
        'outline-variant': '#D4B896',

        /* ── Dark admin ── */
        'dark': '#1A0A00',
        'dark-card': '#2C1209',
        'dark-accent': '#4A2010',

        /* ── Error ── */
        'error': '#8B1A1A',
        'error-container': '#FAE8DA',
        'on-error': '#FDF5EE',
        'on-error-container': '#6B1414',
      },
      borderRadius: {
        DEFAULT: '0.25rem',
        lg: '0.5rem',
        xl: '0.75rem',
        '2xl': '1rem',
        full: '9999px',
      },
      spacing: {
        'gutter': '24px',
        'container-max': '1200px',
        'margin-desktop': '64px',
        'margin-mobile': '20px',
        'base': '8px',
      },
      fontFamily: {
        headline: ['Playfair Display', 'serif'],
        'headline-lg': ['Playfair Display', 'serif'],
        'headline-md': ['Playfair Display', 'serif'],
        lora: ['Lora', 'serif'],
        merriweather: ['Merriweather', 'serif'],
        body: ['Be Vietnam Pro', 'sans-serif'],
        'body-lg': ['Be Vietnam Pro', 'sans-serif'],
        'body-md': ['Be Vietnam Pro', 'sans-serif'],
        'label-lg': ['Be Vietnam Pro', 'sans-serif'],
        'label-sm': ['Be Vietnam Pro', 'sans-serif'],
        /* Giữ cinzel → Playfair Display để backward compat với class font-cinzel */
        cinzel: ['Playfair Display', 'serif'],
        vietnam: ['Be Vietnam Pro', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['56px', { lineHeight: '64px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['24px', { lineHeight: '32px', fontWeight: '600' }],
        'body-lg': ['16px', { lineHeight: '26px', fontWeight: '400' }],
        'body-md': ['15px', { lineHeight: '24px', fontWeight: '400' }],
        'label-lg': ['13px', { lineHeight: '20px', letterSpacing: '0.05em', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', letterSpacing: '0.03em', fontWeight: '500' }],
      },
      maxWidth: { 'container-max': '1200px' },
      boxShadow: {
        'card': '0 2px 12px rgba(61,43,26,0.08), 0 1px 3px rgba(61,43,26,0.04)',
        'card-hover': '0 8px 28px rgba(61,43,26,0.13), 0 2px 6px rgba(61,43,26,0.06)',
        'crimson': '0 4px 16px rgba(139,26,26,0.25)',
        'crimson-lg': '0 8px 32px rgba(139,26,26,0.3)',
        'gold': '0 2px 12px rgba(196,149,106,0.2)',
      },
    },
  },
  plugins: [],
}
