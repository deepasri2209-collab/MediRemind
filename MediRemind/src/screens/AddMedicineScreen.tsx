import React, { useState, useContext, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, Alert, Platform, KeyboardAvoidingView,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList, Frequency, Medicine } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import { MedicineContext } from '../context/MedicineContext';
import { FREQUENCY_OPTIONS } from '../data/sampleData';

type Props = BottomTabScreenProps<TabParamList, 'AddMedicine'>;

const AddMedicineScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    name: '', dosage: '', frequency: '' as Frequency | '',
    reminderTime: '', startDate: '', endDate: '', instructions: '', notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const { addMedicine } = useContext(MedicineContext);

  const update = (key: keyof typeof form) => (val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim())         errs.name          = 'Medicine name is required.';
    if (!form.dosage.trim())       errs.dosage        = 'Dosage is required.';
    if (!form.frequency)           errs.frequency     = 'Frequency is required.';
    if (!form.reminderTime.trim()) errs.reminderTime  = 'Reminder time is required.';
    setErrors(errs);
    return Object.keys(errs).filter(k => errs[k]).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const medicine: Medicine = {
      id: `m_${Date.now()}`,
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      frequency: form.frequency as Frequency,
      reminderTime: form.reminderTime,
      startDate: form.startDate.trim() || undefined,
      endDate: form.endDate.trim() || undefined,
      instructions: form.instructions.trim() || undefined,
      notes: form.notes.trim() || undefined,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    addMedicine(medicine);
    setLoading(false);
    Alert.alert('✅ Medicine Added!', `${medicine.name} has been added to your list.`, [
      { text: 'Add Another', onPress: () => setForm({ name: '', dosage: '', frequency: '', reminderTime: '', startDate: '', endDate: '', instructions: '', notes: '' }) },
      { text: 'View List', onPress: () => (navigation as any).navigate('Medicines') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        <View style={styles.header}>
          <Text style={styles.title}>Add Medicine</Text>
          <Text style={styles.subtitle}>Fill in the details for your new medicine</Text>
        </View>

        <View style={styles.card}>
          <FormInput label="Medicine Name *" value={form.name} onChangeText={update('name')}
            placeholder="e.g. Metformin" icon="💊" error={errors.name} />
          <FormInput label="Dosage *" value={form.dosage} onChangeText={update('dosage')}
            placeholder="e.g. 500 mg" icon="⚖️" error={errors.dosage} />

          {/* Frequency Picker */}
          <Text style={styles.fieldLabel}>Frequency *</Text>
          <View style={styles.frequencyGrid}>
            {FREQUENCY_OPTIONS.map(f => (
              <TouchableOpacity
                key={f}
                style={[styles.freqChip, form.frequency === f && styles.freqChipSelected]}
                onPress={() => { setForm(p => ({ ...p, frequency: f as Frequency })); setErrors(p => ({ ...p, frequency: '' })); }}
              >
                <Text style={[styles.freqText, form.frequency === f && styles.freqTextSelected]}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.frequency ? <Text style={styles.errorText}>{errors.frequency}</Text> : null}

          <FormInput label="Time *" value={form.reminderTime} onChangeText={update('reminderTime')}
            placeholder="HH:MM (e.g. 08:00)" icon="⏰" error={errors.reminderTime} />

          <View style={{ flexDirection: 'row', gap: SPACING.md }}>
            <View style={{ flex: 1 }}>
              <FormInput label="Start Date" value={form.startDate} onChangeText={update('startDate')}
                placeholder="YYYY-MM-DD" icon="📅" />
            </View>
            <View style={{ flex: 1 }}>
              <FormInput label="End Date" value={form.endDate} onChangeText={update('endDate')}
                placeholder="YYYY-MM-DD" icon="📅" />
            </View>
          </View>

          <FormInput label="Instructions" value={form.instructions} onChangeText={update('instructions')}
            placeholder="e.g. Take after food with a full glass of water" icon="📋" />
          <FormInput label="Notes (optional)" value={form.notes} onChangeText={update('notes')}
            placeholder="Special notes or precautions..." icon="📝" multiline numberOfLines={2} />
        </View>

        <View style={styles.actions}>
          <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={{ flex: 1 }} />
          <Button title="Add Medicine" onPress={handleSave} loading={loading} style={{ flex: 1 }} icon="➕" />
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.base },
  title:  { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  subtitle:{ fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginHorizontal: SPACING.xl, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },

  fieldLabel:     { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  frequencyGrid:  { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.base },
  freqChip:       { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgInput },
  freqChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '25' },
  freqText:         { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  freqTextSelected: { color: COLORS.primary },

  errorText: { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginBottom: SPACING.base, marginTop: -SPACING.sm },

  actions: {
    flexDirection: 'row', gap: SPACING.md,
    paddingHorizontal: SPACING.xl, marginTop: SPACING.lg,
  },
});

export default AddMedicineScreen;
