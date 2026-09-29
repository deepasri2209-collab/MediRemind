import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, Alert, Switch, Platform, KeyboardAvoidingView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Frequency, Medicine } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import { MedicineContext } from '../context/MedicineContext';
import { FREQUENCY_OPTIONS } from '../data/sampleData';

type Props = NativeStackScreenProps<RootStackParamList, 'EditMedicine'>;

const EditMedicineScreen: React.FC<Props> = ({ route, navigation }) => {
  const { medicine } = route.params;
  const { updateMedicine } = useContext(MedicineContext);

  const [form, setForm] = useState({
    name:         medicine.name,
    dosage:       medicine.dosage,
    frequency:    medicine.frequency as Frequency | '',
    reminderTime: medicine.reminderTime,
    notes:        medicine.notes ?? '',
    isActive:     medicine.isActive,
  });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof form, string>>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (val: any) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!form.name.trim())         errs.name         = 'Medicine name is required.';
    if (!form.dosage.trim())       errs.dosage       = 'Dosage is required.';
    if (!form.frequency)           errs.frequency    = 'Frequency is required.';
    if (!form.reminderTime.trim()) errs.reminderTime = 'Reminder time is required.';
    setErrors(errs);
    return Object.keys(errs).filter(k => (errs as any)[k]).length === 0;
  };

  const handleUpdate = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const updated: Medicine = {
      ...medicine,
      name:         form.name.trim(),
      dosage:       form.dosage.trim(),
      frequency:    form.frequency as Frequency,
      reminderTime: form.reminderTime,
      notes:        form.notes.trim(),
      isActive:     form.isActive,
    };
    updateMedicine(updated);
    setLoading(false);
    Alert.alert('✅ Updated!', `${updated.name} has been updated.`, [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Edit Medicine</Text>
          <Text style={styles.subtitle}>Update the details for {medicine.name}</Text>
        </View>

        <View style={styles.card}>
          <FormInput label="Medicine Name *" value={form.name} onChangeText={update('name')}
            placeholder="e.g. Metformin" icon="💊" error={errors.name} />
          <FormInput label="Dosage *" value={form.dosage} onChangeText={update('dosage')}
            placeholder="e.g. 500 mg" icon="⚖️" error={errors.dosage} />

          <Text style={styles.fieldLabel}>Frequency *</Text>
          <View style={styles.frequencyGrid}>
            {FREQUENCY_OPTIONS.map(f => (
              <TouchableOpacity key={f}
                style={[styles.freqChip, form.frequency === f && styles.freqChipSelected]}
                onPress={() => { setForm(p => ({ ...p, frequency: f as Frequency })); setErrors(p => ({ ...p, frequency: '' })); }}>
                <Text style={[styles.freqText, form.frequency === f && styles.freqTextSelected]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.frequency ? <Text style={styles.errorText}>{errors.frequency}</Text> : null}

          <FormInput label="Reminder Time *" value={form.reminderTime} onChangeText={update('reminderTime')}
            placeholder="HH:MM (e.g. 08:00)" icon="⏰" error={errors.reminderTime} />
          <FormInput label="Notes (optional)" value={form.notes} onChangeText={update('notes')}
            placeholder="Special instructions..." icon="📝" multiline numberOfLines={3} />

          {/* Active Switch */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Medicine Active</Text>
              <Text style={styles.switchSub}>{form.isActive ? 'Reminders are enabled' : 'Reminders are paused'}</Text>
            </View>
            <Switch
              value={form.isActive}
              onValueChange={update('isActive')}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Button title="Update" onPress={handleUpdate} loading={loading} style={{ flex: 1 }} icon="✅" />
        </View>
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header:  { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.base },
  backBtn: { marginBottom: SPACING.md },
  backArrow:{ fontSize: FONTS.sizes.base, color: COLORS.primary, fontWeight: '600' },
  title:   { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  subtitle:{ fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginHorizontal: SPACING.xl, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },

  fieldLabel:       { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  frequencyGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.base },
  freqChip:         { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgInput },
  freqChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '25' },
  freqText:         { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  freqTextSelected: { color: COLORS.primary },
  errorText:        { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginBottom: SPACING.base, marginTop: -SPACING.sm },

  switchRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: SPACING.md, paddingTop: SPACING.md, borderTopWidth: 1, borderTopColor: COLORS.border },
  switchInfo: { flex: 1, marginRight: SPACING.base },
  switchLabel:{ fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  switchSub:  { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2 },

  actions: { flexDirection: 'row', gap: SPACING.md, paddingHorizontal: SPACING.xl, marginTop: SPACING.lg },
});

export default EditMedicineScreen;
