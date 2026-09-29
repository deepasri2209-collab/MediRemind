// ─── Design Tokens ────────────────────────────────────────────────────────────
export const COLORS = {
  primary:        '#6C63FF',
  primaryDark:    '#4A42C8',
  primaryLight:   '#8B84FF',
  secondary:      '#FF6B6B',
  accent:         '#4ECDC4',
  accentAlt:      '#45B7D1',
  success:        '#2ECC71',
  warning:        '#F39C12',
  danger:         '#E74C3C',
  info:           '#3498DB',

  // Backgrounds
  bgDark:         '#0D0D1A',
  bgCard:         '#1A1A2E',
  bgCardAlt:      '#16213E',
  bgInput:        '#0F3460',

  // Text
  textPrimary:    '#FFFFFF',
  textSecondary:  '#B0B3C6',
  textMuted:      '#666888',
  textDark:       '#0D0D1A',

  // Status
  statusTaken:    '#2ECC71',
  statusPending:  '#F39C12',
  statusMissed:   '#E74C3C',

  // Gradients (start/end pairs)
  gradientBlue:   ['#667eea', '#764ba2'],
  gradientTeal:   ['#11998e', '#38ef7d'],
  gradientOrange: ['#f7971e', '#ffd200'],
  gradientPink:   ['#ee0979', '#ff6a00'],

  border:         '#2A2A4A',
  shadow:         '#000000',
  white:          '#FFFFFF',
  black:          '#000000',
  transparent:    'transparent',
};

export const FONTS = {
  regular:  'System',
  medium:   'System',
  bold:     'System',
  sizes: {
    xs:   10,
    sm:   12,
    md:   14,
    base: 16,
    lg:   18,
    xl:   20,
    xxl:  24,
    xxxl: 30,
    hero: 36,
  },
};

export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  base: 16,
  lg:   20,
  xl:   24,
  xxl:  32,
  xxxl: 48,
};

export const RADIUS = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
  round: 999,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  lg: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
};
