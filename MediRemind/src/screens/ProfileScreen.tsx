import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, Alert, Image, Platform, KeyboardAvoidingView,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button, Divider } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { validateEmail, validatePhone, validateFullName } from '../utils/validation';

type Props = BottomTabScreenProps<TabParamList, 'Profile'>;

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { user, setUser } = useContext(UserContext);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    fullName:         user?.fullName ?? '',
    phone:            user?.phone ?? '',
    email:            user?.email ?? '',
    emergencyContact: user?.emergencyContact ?? '',
  });
  const [errors, setErrors] = useState<Partial<typeof form>>({});
  const [loading, setLoading] = useState(false);

  const update = (key: keyof typeof form) => (val: string) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: '' }));
  };

  const validate = (): boolean => {
    const errs: Partial<typeof form> = {};
    if (!validateFullName(form.fullName)) errs.fullName = 'Name must contain only letters.';
    if (!validatePhone(form.phone))       errs.phone    = 'Enter a valid 10-digit mobile number.';
    if (!validateEmail(form.email))       errs.email    = 'Enter a valid email address.';
    setErrors(errs);
    return Object.keys(errs).filter(k => (errs as any)[k]).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    setUser({ ...user!, ...form });
    await AsyncStorage.setItem('user_profile', JSON.stringify({ ...user, ...form }));
    setLoading(false);
    setEditing(false);
    Alert.alert('✅ Profile Updated!', 'Your changes have been saved.');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await AsyncStorage.removeItem('auth_token');
            await AsyncStorage.removeItem('user_email');
            setUser(null);
            (navigation as any).reset({ index: 0, routes: [{ name: 'Login' }] });
          },
        },
      ],
    );
  };

  const STATS = [
    { label: 'Medicines',  value: '5', icon: '💊' },
    { label: 'Reminders',  value: '12', icon: '⏰' },
    { label: 'Taken Today',value: '3', icon: '✅' },
  ];

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        {/* Profile Hero */}
        <View style={styles.hero}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{(user?.fullName ?? 'U').charAt(0).toUpperCase()}</Text>
          </View>
          <Text style={styles.userName}>{user?.fullName}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          <TouchableOpacity style={styles.editToggle} onPress={() => setEditing(p => !p)}>
            <Text style={styles.editToggleText}>{editing ? '✕ Cancel' : '✏️ Edit Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          {STATS.map((s, i) => (
            <View key={i} style={styles.statItem}>
              <Text style={styles.statIcon}>{s.icon}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Edit / View Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          <Divider />
          {editing ? (
            <>
              <FormInput label="Full Name" value={form.fullName} onChangeText={update('fullName')} icon="👤" error={errors.fullName} />
              <FormInput label="Phone Number" value={form.phone} onChangeText={update('phone')} keyboardType="phone-pad" icon="📱" error={errors.phone} />
              <FormInput label="Email Address" value={form.email} onChangeText={update('email')} keyboardType="email-address" autoCapitalize="none" icon="📧" error={errors.email} />
              <FormInput label="Emergency Contact" value={form.emergencyContact} onChangeText={update('emergencyContact')} keyboardType="phone-pad" icon="🆘" />
              <Button title="Save Changes" onPress={handleSave} loading={loading} icon="💾" style={{ marginTop: SPACING.sm }} />
            </>
          ) : (
            <>
              {[
                { label: 'Full Name',         value: user?.fullName,         icon: '👤' },
                { label: 'Phone',             value: user?.phone,            icon: '📱' },
                { label: 'Email',             value: user?.email,            icon: '📧' },
                { label: 'Emergency Contact', value: user?.emergencyContact ?? 'N/A', icon: '🆘' },
              ].map((row, i) => (
                <View key={i}>
                  <View style={styles.infoRow}>
                    <Text style={styles.infoIcon}>{row.icon}</Text>
                    <View style={styles.infoContent}>
                      <Text style={styles.infoLabel}>{row.label}</Text>
                      <Text style={styles.infoValue}>{row.value}</Text>
                    </View>
                  </View>
                  {i < 3 && <Divider margin={SPACING.sm} />}
                </View>
              ))}
            </>
          )}
        </View>

        {/* Logout */}
        <View style={styles.logoutSection}>
          <Button title="Logout" onPress={handleLogout} variant="danger" icon="🚪" />
        </View>

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  hero: { alignItems: 'center', paddingTop: SPACING.xxxl, paddingBottom: SPACING.xl },
  avatarContainer: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: COLORS.primary + '30',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 3, borderColor: COLORS.primary,
    marginBottom: SPACING.base,
  },
  avatarText:  { fontSize: FONTS.sizes.hero, fontWeight: '800', color: COLORS.primary },
  userName:    { fontSize: FONTS.sizes.xl,   fontWeight: '800', color: COLORS.textPrimary },
  userEmail:   { fontSize: FONTS.sizes.sm,   color: COLORS.textSecondary, marginTop: 4 },
  editToggle:  { marginTop: SPACING.md, paddingHorizontal: SPACING.xl, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1.5, borderColor: COLORS.primary },
  editToggleText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '700' },

  statsRow: {
    flexDirection: 'row', justifyContent: 'space-evenly',
    marginHorizontal: SPACING.xl, marginBottom: SPACING.base,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    paddingVertical: SPACING.base, borderWidth: 1, borderColor: COLORS.border,
  },
  statItem:  { alignItems: 'center' },
  statIcon:  { fontSize: 22, marginBottom: 4 },
  statValue: { fontSize: FONTS.sizes.xl, fontWeight: '800', color: COLORS.textPrimary },
  statLabel: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, marginHorizontal: SPACING.xl, marginBottom: SPACING.base,
    borderWidth: 1, borderColor: COLORS.border,
  },
  cardTitle: { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary, marginBottom: SPACING.sm },

  infoRow:    { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm, gap: SPACING.md },
  infoIcon:   { fontSize: 20 },
  infoContent:{ flex: 1 },
  infoLabel:  { fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
  infoValue:  { fontSize: FONTS.sizes.md, color: COLORS.textPrimary, fontWeight: '600', marginTop: 2 },

  logoutSection: { paddingHorizontal: SPACING.xl, marginTop: SPACING.sm },
});

export default ProfileScreen;
