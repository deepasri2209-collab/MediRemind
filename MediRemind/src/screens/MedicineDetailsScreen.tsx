import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, TouchableOpacity, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS, SHADOWS } from '../utils/theme';
import { Button, Chip, Divider } from '../components/UIElements';

type Props = NativeStackScreenProps<RootStackParamList, 'MedicineDetails'>;

const MedicineDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { medicine } = route.params;

  const DETAIL_ROWS = [
    { label: 'Dosage',         value: medicine.dosage,       icon: '💊' },
    { label: 'Frequency',      value: medicine.frequency,    icon: '🔄' },
    { label: 'Reminder Time',  value: medicine.reminderTime, icon: '⏰' },
    { label: 'Category',       value: medicine.category ?? 'General', icon: '🏷️' },
    { label: 'Status',         value: medicine.isActive ? 'Active' : 'Inactive', icon: medicine.isActive ? '✅' : '❌' },
    { label: 'Added On',       value: new Date(medicine.createdAt).toLocaleDateString('en-IN'), icon: '📅' },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.heroContent}>
            <View style={styles.medicineAvatar}>
              <Text style={styles.medicineInitial}>{medicine.name.charAt(0)}</Text>
            </View>
            <Text style={styles.medicineName}>{medicine.name}</Text>
            <View style={styles.heroChips}>
              <Chip label={medicine.dosage} color={COLORS.primary} />
              <Chip label={medicine.frequency} color={COLORS.accent} />
            </View>
          </View>
        </View>

        {/* Detail Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Medicine Information</Text>
          <Divider />
          {DETAIL_ROWS.map((row, i) => (
            <View key={i}>
              <View style={styles.detailRow}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailIcon}>{row.icon}</Text>
                  <Text style={styles.detailLabel}>{row.label}</Text>
                </View>
                <Text style={[styles.detailValue, row.label === 'Status' && {
                  color: medicine.isActive ? COLORS.success : COLORS.textMuted,
                }]}>{row.value}</Text>
              </View>
              {i < DETAIL_ROWS.length - 1 && <Divider margin={SPACING.sm} />}
            </View>
          ))}
        </View>

        {/* Notes Card */}
        {medicine.notes && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📝 Notes</Text>
            <Divider />
            <Text style={styles.notesText}>{medicine.notes}</Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Edit Medicine"
            onPress={() => navigation.navigate('EditMedicine', { medicine })}
            variant="primary"
            style={{ flex: 1 }}
            icon="✏️"
          />
          <Button
            title="Delete"
            onPress={() => Alert.alert('Delete', `Remove ${medicine.name}?`, [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => navigation.goBack() },
            ])}
            variant="danger"
            style={{ flex: 1 }}
            icon="🗑️"
          />
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  hero: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.xl },
  backBtn: { marginBottom: SPACING.base },
  backArrow: { fontSize: FONTS.sizes.xl, color: COLORS.primary, fontWeight: '700' },
  heroContent: { alignItems: 'center' },
  medicineAvatar: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primary + '30',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.primary + '60',
    marginBottom: SPACING.md,
  },
  medicineInitial: { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.primary },
  medicineName: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary, textAlign: 'center' },
  heroChips: { flexDirection: 'row', gap: SPACING.sm, marginTop: SPACING.md },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginHorizontal: SPACING.xl, marginBottom: SPACING.base,
    borderWidth: 1, borderColor: COLORS.border, ...SHADOWS.sm,
  },
  cardTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },

  detailRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: SPACING.sm },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  detailIcon: { fontSize: FONTS.sizes.base },
  detailLabel:{ fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  detailValue:{ fontSize: FONTS.sizes.md, color: COLORS.textPrimary, fontWeight: '600', maxWidth: '50%', textAlign: 'right' },

  notesText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, lineHeight: 22, marginTop: SPACING.sm },

  actions: {
    flexDirection: 'row', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, marginTop: SPACING.sm,
  },
});

export default MedicineDetailsScreen;
