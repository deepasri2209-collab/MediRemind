import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../utils/theme';

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
}) => {
  const btnStyles: ViewStyle[] = [styles.btn, styles[`btn_${size}`], styles[`btn_${variant}`]];
  const txtStyles: TextStyle[] = [styles.btnText, styles[`btnText_${size}`], styles[`btnText_${variant}`]];
  if (disabled || loading) btnStyles.push(styles.btn_disabled);

  return (
    <TouchableOpacity
      style={[...btnStyles, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? COLORS.primary : COLORS.white} size="small" />
      ) : (
        <Text style={[...txtStyles, textStyle]}>
          {icon ? `${icon}  ` : ''}{title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

// ─── Badge ────────────────────────────────────────────────────────────────────
interface BadgeProps {
  count: number;
  color?: string;
}

export const Badge: React.FC<BadgeProps> = ({ count, color = COLORS.danger }) => {
  if (count <= 0) return null;
  return (
    <View style={[styles.badge, { backgroundColor: color }]}>
      <Text style={styles.badgeText}>{count > 99 ? '99+' : count}</Text>
    </View>
  );
};

// ─── Section Header ───────────────────────────────────────────────────────────
interface SectionHeaderProps {
  title: string;
  action?: string;
  onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={styles.sectionAction}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Empty State ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: string;
  title: string;
  subtitle?: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '💊',
  title,
  subtitle,
  actionTitle,
  onAction,
}) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    {subtitle && <Text style={styles.emptySubtitle}>{subtitle}</Text>}
    {actionTitle && onAction && (
      <Button title={actionTitle} onPress={onAction} style={styles.emptyBtn} />
    )}
  </View>
);

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider: React.FC<{ margin?: number }> = ({ margin = SPACING.base }) => (
  <View style={[styles.divider, { marginVertical: margin }]} />
);

// ─── Chip / Tag ───────────────────────────────────────────────────────────────
interface ChipProps { label: string; color?: string; }
export const Chip: React.FC<ChipProps> = ({ label, color = COLORS.primary }) => (
  <View style={[styles.chip, { borderColor: color }]}>
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Buttons
  btn: {
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOWS.md,
  },
  btn_sm: { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2, height: 36 },
  btn_md: { paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md,     height: 48 },
  btn_lg: { paddingHorizontal: SPACING.xl, paddingVertical: SPACING.base,   height: 56 },

  btn_primary:   { backgroundColor: COLORS.primary },
  btn_secondary: { backgroundColor: COLORS.secondary },
  btn_outline:   { backgroundColor: COLORS.transparent, borderWidth: 2, borderColor: COLORS.primary },
  btn_danger:    { backgroundColor: COLORS.danger },
  btn_ghost:     { backgroundColor: 'rgba(108,99,255,0.15)', ...{} as any },
  btn_disabled:  { opacity: 0.5 },

  btnText: { fontWeight: '700', letterSpacing: 0.5 },
  btnText_sm:        { fontSize: FONTS.sizes.sm },
  btnText_md:        { fontSize: FONTS.sizes.md + 1 },
  btnText_lg:        { fontSize: FONTS.sizes.base },
  btnText_primary:   { color: COLORS.white },
  btnText_secondary: { color: COLORS.white },
  btnText_outline:   { color: COLORS.primary },
  btnText_danger:    { color: COLORS.white },
  btnText_ghost:     { color: COLORS.primary },

  // Badge
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: COLORS.white, fontSize: FONTS.sizes.xs, fontWeight: '700' },

  // Section header
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.sizes.lg,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
  sectionAction: {
    fontSize: FONTS.sizes.sm,
    color: COLORS.primary,
    fontWeight: '600',
  },

  // Empty state
  emptyState: { alignItems: 'center', justifyContent: 'center', padding: SPACING.xxxl },
  emptyIcon:     { fontSize: 56, marginBottom: SPACING.base },
  emptyTitle:    { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  emptySubtitle: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.sm },
  emptyBtn:      { marginTop: SPACING.lg, paddingHorizontal: SPACING.xxl },

  // Divider
  divider: { height: 1, backgroundColor: COLORS.border },

  // Chip
  chip: {
    borderWidth: 1,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  chipText: { fontSize: FONTS.sizes.xs, fontWeight: '600' },
});
