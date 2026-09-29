import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { Medicine, Reminder, ReminderStatus } from '../types';
import { COLORS, SPACING, RADIUS, FONTS, SHADOWS } from '../utils/theme';
import { Chip } from './UIElements';

// ─── Medicine Card ────────────────────────────────────────────────────────────
interface MedicineCardProps {
  medicine: Medicine;
  onPress?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  nextReminder?: string;
  style?: ViewStyle;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  onPress,
  onEdit,
  onDelete,
  nextReminder,
  style,
}) => {
  const initial = medicine.name.charAt(0).toUpperCase();
  const avatarColor = stringToColor(medicine.name);

  return (
    <TouchableOpacity style={[styles.medicineCard, style]} onPress={onPress} activeOpacity={0.85}>
      {/* Avatar */}
      <View style={[styles.medicineAvatar, { backgroundColor: avatarColor }]}>
        <Text style={styles.medicineAvatarText}>{initial}</Text>
      </View>

      {/* Info */}
      <View style={styles.medicineInfo}>
        <Text style={styles.medicineName} numberOfLines={1}>{medicine.name}</Text>
        <Text style={styles.medicineDosage}>{medicine.dosage} · {medicine.frequency}</Text>
        <View style={styles.medicineRow}>
          <Text style={styles.medicineTime}>⏰ {nextReminder ?? medicine.reminderTime}</Text>
          {medicine.category && <Chip label={medicine.category} />}
        </View>
      </View>

      {/* Status & Actions */}
      <View style={styles.medicineActions}>
        <View style={[styles.activeIndicator, { backgroundColor: medicine.isActive ? COLORS.success : COLORS.textMuted }]} />
        {onEdit && (
          <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
            <Text style={styles.actionBtnText}>✏️</Text>
          </TouchableOpacity>
        )}
        {onDelete && (
          <TouchableOpacity style={styles.actionBtn} onPress={onDelete}>
            <Text style={styles.actionBtnText}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// ─── Reminder Card ────────────────────────────────────────────────────────────
interface ReminderCardProps {
  reminder: Reminder;
  onStatusChange?: (status: ReminderStatus) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({ reminder, onStatusChange }) => {
  const statusConfig: Record<ReminderStatus, { color: string; bg: string; icon: string }> = {
    Taken:   { color: COLORS.statusTaken,   bg: 'rgba(46,204,113,0.15)',  icon: '✅' },
    Pending: { color: COLORS.statusPending, bg: 'rgba(243,156,18,0.15)', icon: '⏳' },
    Missed:  { color: COLORS.statusMissed,  bg: 'rgba(231,76,60,0.15)',  icon: '❌' },
  };
  const cfg = statusConfig[reminder.status];

  return (
    <View style={[styles.reminderCard, { borderLeftColor: cfg.color }]}>
      <View style={[styles.reminderStatus, { backgroundColor: cfg.bg }]}>
        <Text style={styles.reminderStatusIcon}>{cfg.icon}</Text>
      </View>
      <View style={styles.reminderInfo}>
        <Text style={styles.reminderMedicineName}>{reminder.medicineName}</Text>
        <Text style={styles.reminderDosage}>{reminder.dosage}</Text>
        <Text style={styles.reminderTime}>🕐 {reminder.scheduledTime} · {reminder.date}</Text>
      </View>
      <View style={styles.reminderBadgeContainer}>
        <View style={[styles.reminderBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.reminderBadgeText, { color: cfg.color }]}>{reminder.status}</Text>
        </View>
        {reminder.status === 'Pending' && onStatusChange && (
          <View style={styles.statusBtns}>
            <TouchableOpacity
              style={[styles.miniBtn, { backgroundColor: COLORS.success }]}
              onPress={() => onStatusChange('Taken')}
            >
              <Text style={styles.miniBtnText}>Take</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.miniBtn, { backgroundColor: COLORS.danger }]}
              onPress={() => onStatusChange('Missed')}
            >
              <Text style={styles.miniBtnText}>Miss</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

// ─── Quick Access Card ────────────────────────────────────────────────────────
interface QuickAccessCardProps {
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
  onPress: () => void;
  badge?: number;
}

export const QuickAccessCard: React.FC<QuickAccessCardProps> = ({
  icon, title, subtitle, color, onPress, badge,
}) => (
  <TouchableOpacity
    style={[styles.quickCard, { borderColor: color + '33' }]}
    onPress={onPress}
    activeOpacity={0.85}
  >
    <View style={[styles.quickIconContainer, { backgroundColor: color + '22' }]}>
      <Text style={styles.quickIcon}>{icon}</Text>
      {badge !== undefined && badge > 0 && (
        <View style={styles.quickBadge}>
          <Text style={styles.quickBadgeText}>{badge}</Text>
        </View>
      )}
    </View>
    <Text style={styles.quickTitle}>{title}</Text>
    {subtitle && <Text style={styles.quickSubtitle}>{subtitle}</Text>}
  </TouchableOpacity>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────
function stringToColor(str: string): string {
  const palette = [
    '#6C63FF', '#FF6B6B', '#4ECDC4', '#45B7D1',
    '#96CEB4', '#FECA57', '#FF9FF3', '#54A0FF',
  ];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return palette[Math.abs(hash) % palette.length];
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Medicine Card
  medicineCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  medicineAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  medicineAvatarText: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.white },
  medicineInfo:       { flex: 1, marginRight: SPACING.sm },
  medicineName:       { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  medicineDosage:     { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  medicineRow:        { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 },
  medicineTime:       { fontSize: FONTS.sizes.sm, color: COLORS.textMuted },
  medicineActions:    { alignItems: 'center', gap: 6 },
  activeIndicator:    { width: 8, height: 8, borderRadius: 4 },
  actionBtn:          { padding: 4 },
  actionBtnText:      { fontSize: FONTS.sizes.base },

  // Reminder Card
  reminderCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    borderLeftWidth: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.sm,
  },
  reminderStatus:     { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginRight: SPACING.md },
  reminderStatusIcon: { fontSize: 22 },
  reminderInfo:       { flex: 1 },
  reminderMedicineName: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  reminderDosage:     { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },
  reminderTime:       { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 2 },
  reminderBadgeContainer: { alignItems: 'flex-end', gap: 6 },
  reminderBadge:      { paddingHorizontal: SPACING.sm, paddingVertical: 3, borderRadius: RADIUS.round },
  reminderBadgeText:  { fontSize: FONTS.sizes.xs, fontWeight: '700' },
  statusBtns:         { flexDirection: 'row', gap: 6 },
  miniBtn:            { paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.sm },
  miniBtnText:        { fontSize: FONTS.sizes.xs, fontWeight: '700', color: COLORS.white },

  // Quick Access Card
  quickCard: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    padding: SPACING.base,
    alignItems: 'center',
    flex: 1,
    margin: SPACING.xs,
    borderWidth: 1,
    ...SHADOWS.sm,
  },
  quickIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
  },
  quickIcon:         { fontSize: 26 },
  quickTitle:        { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  quickSubtitle:     { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, textAlign: 'center', marginTop: 2 },
  quickBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.danger,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  quickBadgeText:    { fontSize: FONTS.sizes.xs - 1, fontWeight: '700', color: COLORS.white },
});
