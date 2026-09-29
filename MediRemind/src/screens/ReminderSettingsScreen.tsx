import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar, Switch, Alert,
  TouchableOpacity, Platform, KeyboardAvoidingView,
} from 'react-native';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button, Divider } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import { NOTIFICATION_SOUND_OPTIONS } from '../data/sampleData';

type Props = DrawerScreenProps<DrawerParamList, 'ReminderSettings'>;

const ReminderSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    enableReminders:  true,
    notificationSound: 'Default',
    snoozeDuration:   '10',
    additionalNotes:  '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Partial<typeof form> = {};
    if (!form.notificationSound) errs.notificationSound = 'Please select a notification sound.';
    const snooze = parseInt(form.snoozeDuration, 10);
    if (isNaN(snooze) || snooze < 1 || snooze > 60) errs.snoozeDuration = 'Snooze must be between 1 and 60 minutes.';
    setErrors(errs);
    return Object.keys(errs).filter(k => (errs as any)[k]).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setLoading(false);
    Alert.alert('✅ Preferences Saved!', 'Your reminder settings have been updated.');
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Reminder Settings</Text>
          <Text style={styles.subtitle}>Customize how you receive reminders</Text>
        </View>

        <View style={styles.card}>
          {/* Enable Reminders */}
          <View style={styles.switchRow}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchLabel}>Enable Reminders</Text>
              <Text style={styles.switchSub}>Turn off to pause all notifications</Text>
            </View>
            <Switch
              value={form.enableReminders}
              onValueChange={v => setForm(p => ({ ...p, enableReminders: v }))}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          </View>
          <Divider />

          {/* Notification Sound */}
          <Text style={styles.fieldLabel}>Notification Sound</Text>
          <View style={styles.soundGrid}>
            {NOTIFICATION_SOUND_OPTIONS.map(s => (
              <TouchableOpacity key={s}
                style={[styles.soundChip, form.notificationSound === s && styles.soundChipSelected]}
                onPress={() => { setForm(p => ({ ...p, notificationSound: s })); setErrors(p => ({ ...p, notificationSound: '' })); }}>
                <Text style={[styles.soundText, form.notificationSound === s && styles.soundTextSelected]}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.notificationSound ? <Text style={styles.errorText}>{errors.notificationSound}</Text> : null}

          <Divider />

          {/* Snooze Duration */}
          <FormInput
            label="Snooze Duration (minutes)"
            value={form.snoozeDuration}
            onChangeText={v => { setForm(p => ({ ...p, snoozeDuration: v })); setErrors(p => ({ ...p, snoozeDuration: '' })); }}
            placeholder="1–60 minutes"
            keyboardType="numeric"
            icon="😴"
            error={errors.snoozeDuration}
          />

          {/* Notes */}
          <FormInput
            label="Additional Notes"
            value={form.additionalNotes}
            onChangeText={v => setForm(p => ({ ...p, additionalNotes: v }))}
            placeholder="e.g. Wake me up for morning meds"
            icon="📝"
            multiline
            numberOfLines={3}
          />

          <Button title="Save Preferences" onPress={handleSave} loading={loading} icon="💾" style={{ marginTop: SPACING.sm }} />
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
  subtitle:{ fontSize: FONTS.sizes.md,  color: COLORS.textSecondary, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginHorizontal: SPACING.xl, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },

  switchRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: SPACING.sm },
  switchInfo: { flex: 1, marginRight: SPACING.base },
  switchLabel:{ fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  switchSub:  { fontSize: FONTS.sizes.sm, color: COLORS.textMuted, marginTop: 2 },

  fieldLabel:        { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm, marginTop: SPACING.md },
  soundGrid:         { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginBottom: SPACING.base },
  soundChip:         { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.bgInput },
  soundChipSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '25' },
  soundText:         { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  soundTextSelected: { color: COLORS.primary },

  errorText: { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginBottom: SPACING.base, marginTop: -SPACING.sm },
});

export default ReminderSettingsScreen;
