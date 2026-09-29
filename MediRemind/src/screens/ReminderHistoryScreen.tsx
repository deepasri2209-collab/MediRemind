import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar, TouchableOpacity,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList, ReminderStatus } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { SectionHeader, EmptyState } from '../components/UIElements';
import { ReminderCard } from '../components/Cards';
import { SAMPLE_REMINDERS } from '../data/sampleData';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateReminderStatus } from '../store/reminderSlice';

type Props = BottomTabScreenProps<TabParamList, 'ReminderHistory'>;

const ReminderHistoryScreen: React.FC<Props> = () => {
  const dispatch  = useDispatch();
  const storeReminders = useSelector((s: RootState) => s.reminders.reminders);
  const reminders = storeReminders.length ? storeReminders : SAMPLE_REMINDERS;

  const [filter, setFilter] = useState<'All' | ReminderStatus>('All');

  const filtered = reminders.filter(r => filter === 'All' || r.status === filter);

  const FILTER_OPTIONS: Array<'All' | ReminderStatus> = ['All', 'Pending', 'Taken', 'Missed'];
  const FILTER_COLORS: Record<string, string> = {
    All:     COLORS.primary,
    Pending: COLORS.statusPending,
    Taken:   COLORS.statusTaken,
    Missed:  COLORS.statusMissed,
  };

  const handleStatusChange = (id: string, status: ReminderStatus) => {
    dispatch(updateReminderStatus({ id, status }));
  };

  const pendingCount = reminders.filter(r => r.status === 'Pending').length;
  const takenCount   = reminders.filter(r => r.status === 'Taken').length;
  const missedCount  = reminders.filter(r => r.status === 'Missed').length;

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Reminder History</Text>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryRow}>
        {[
          { label: 'Pending', value: pendingCount, color: COLORS.statusPending, icon: '⏳' },
          { label: 'Taken',   value: takenCount,   color: COLORS.statusTaken,   icon: '✅' },
          { label: 'Missed',  value: missedCount,  color: COLORS.statusMissed,  icon: '❌' },
        ].map(s => (
          <View key={s.label} style={[styles.summaryCard, { borderColor: s.color + '50' }]}>
            <Text style={styles.summaryIcon}>{s.icon}</Text>
            <Text style={[styles.summaryValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.summaryLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && { borderColor: FILTER_COLORS[f], backgroundColor: FILTER_COLORS[f] + '20' }]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && { color: FILTER_COLORS[f] }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState icon="📋" title="No reminders found" subtitle={`No ${filter === 'All' ? '' : filter.toLowerCase()} reminders to show.`} />
        }
        renderItem={({ item }) => (
          <ReminderCard
            reminder={item}
            onStatusChange={status => handleStatusChange(item.id, status)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.base },
  title:  { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },

  summaryRow: {
    flexDirection: 'row', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, marginBottom: SPACING.base,
  },
  summaryCard: {
    flex: 1, alignItems: 'center', backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg, paddingVertical: SPACING.md,
    borderWidth: 1,
  },
  summaryIcon:  { fontSize: 22, marginBottom: 4 },
  summaryValue: { fontSize: FONTS.sizes.xxl, fontWeight: '800' },
  summaryLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  filterRow: {
    flexDirection: 'row', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  filterText: { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },

  list: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl },
});

export default ReminderHistoryScreen;
