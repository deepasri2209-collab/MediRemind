import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, Switch, Platform, KeyboardAvoidingView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import {
  validateEmail, validatePassword, validatePhone, validateFullName,
} from '../utils/validation';
import { CITY_OPTIONS } from '../data/sampleData';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

type FormErrors = Partial<Record<
  'fullName' | 'phone' | 'email' | 'password' | 'confirmPassword' | 'gender' | 'dob' | 'city' | 'terms',
  string
>>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [form, setForm] = useState({
    fullName: '', phone: '', email: '', password: '', confirmPassword: '',
    gender: '' as '' | 'Male' | 'Female' | 'Other',
    dob: '', city: '', medicalNotes: '', acceptTerms: false,
  });
  const [errors, setErrors]   = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const update = (key: keyof typeof form) => (val: any) => {
    setForm(p => ({ ...p, [key]: val }));
    setErrors(p => ({ ...p, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: FormErrors = {};
    if (!validateFullName(form.fullName)) errs.fullName       = 'Name must contain only letters.';
    if (!validatePhone(form.phone))       errs.phone          = 'Enter a valid 10-digit mobile number.';
    if (!validateEmail(form.email))       errs.email          = 'Enter a valid email address.';
    if (!validatePassword(form.password)) errs.password       = 'Min 8 chars, 1 uppercase, 1 digit, 1 special char.';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    if (!form.gender)                     errs.gender         = 'Please select a gender.';
    if (!form.dob)                        errs.dob            = 'Date of birth is required.';
    if (!form.city)                       errs.city           = 'Please select a city.';
    if (!form.acceptTerms)                errs.terms          = 'You must accept the Terms & Conditions.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    Alert.alert('Registration Successful! 🎉', 'Your account has been created.', [
      { text: 'Login Now', onPress: () => navigation.navigate('Login') },
    ]);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backArrow}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Fill in your details to get started</Text>
        </View>

        <View style={styles.card}>
          <FormInput label="Full Name" value={form.fullName} onChangeText={update('fullName')}
            placeholder="e.g. Deepasri D" icon="👤" error={errors.fullName} />
          <FormInput label="Mobile Number" value={form.phone} onChangeText={update('phone')}
            placeholder="10-digit number" keyboardType="phone-pad" icon="📱" error={errors.phone} />
          <FormInput label="Email Address" value={form.email} onChangeText={update('email')}
            placeholder="your@email.com" keyboardType="email-address" autoCapitalize="none" icon="📧" error={errors.email} />
          <FormInput label="Password" value={form.password} onChangeText={update('password')}
            placeholder="Strong password" secureTextEntry={!showPass} autoCapitalize="none" icon="🔒" error={errors.password} />
          <FormInput label="Confirm Password" value={form.confirmPassword} onChangeText={update('confirmPassword')}
            placeholder="Re-enter password" secureTextEntry={!showPass} autoCapitalize="none" icon="🔒" error={errors.confirmPassword} />

          <TouchableOpacity onPress={() => setShowPass(p => !p)} style={styles.showPassRow}>
            <Text style={styles.showPassText}>{showPass ? '🙈 Hide passwords' : '👁️ Show passwords'}</Text>
          </TouchableOpacity>

          {/* Gender */}
          <Text style={styles.fieldLabel}>Gender</Text>
          <View style={styles.radioGroup}>
            {(['Male', 'Female', 'Other'] as const).map(g => (
              <TouchableOpacity key={g} style={[styles.radioBtn, form.gender === g && styles.radioBtnSelected]}
                onPress={() => update('gender')(g)}>
                <Text style={[styles.radioText, form.gender === g && styles.radioTextSelected]}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.gender && <Text style={styles.errorText}>{errors.gender}</Text>}

          <FormInput label="Date of Birth" value={form.dob} onChangeText={update('dob')}
            placeholder="YYYY-MM-DD" icon="🎂" error={errors.dob} />

          {/* City Dropdown (simplified picker) */}
          <Text style={styles.fieldLabel}>City</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cityScroll}>
            {CITY_OPTIONS.map(c => (
              <TouchableOpacity key={c}
                style={[styles.cityChip, form.city === c && styles.cityChipSelected]}
                onPress={() => update('city')(c)}>
                <Text style={[styles.cityText, form.city === c && styles.cityTextSelected]}>{c}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          {errors.city && <Text style={styles.errorText}>{errors.city}</Text>}

          <FormInput label="Medical Notes (optional)" value={form.medicalNotes}
            onChangeText={update('medicalNotes')} placeholder="Allergies, conditions..."
            icon="📝" multiline numberOfLines={3} />

          {/* Terms */}
          <View style={styles.termsRow}>
            <Switch value={form.acceptTerms} onValueChange={update('acceptTerms')}
              trackColor={{ false: COLORS.border, true: COLORS.primary }}
              thumbColor={COLORS.white} />
            <Text style={styles.termsText}>
              I accept the <Text style={styles.termsLink}>Terms & Conditions</Text> and{' '}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </View>
          {errors.terms && <Text style={styles.errorText}>{errors.terms}</Text>}

          <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg"
            style={{ marginTop: SPACING.base }} icon="✅" />
        </View>

        <TouchableOpacity style={styles.loginRow} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Already have an account? <Text style={styles.loginLink}>Sign In</Text></Text>
        </TouchableOpacity>
        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header:    { paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.base },
  backBtn:   { marginBottom: SPACING.md },
  backArrow: { fontSize: FONTS.sizes.base, color: COLORS.primary, fontWeight: '600' },
  title:     { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  subtitle:  { fontSize: FONTS.sizes.md,  color: COLORS.textSecondary, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.xl,
    padding: SPACING.xl, margin: SPACING.xl, marginTop: SPACING.md,
    borderWidth: 1, borderColor: COLORS.border,
  },

  fieldLabel:  { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.sm },
  radioGroup:  { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.base },
  radioBtn:    { flex: 1, paddingVertical: SPACING.sm, borderRadius: RADIUS.md, borderWidth: 1.5, borderColor: COLORS.border, alignItems: 'center' },
  radioBtnSelected: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  radioText:        { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  radioTextSelected:{ color: COLORS.primary },

  cityScroll:        { marginBottom: SPACING.base },
  cityChip:          { paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border, marginRight: SPACING.sm, backgroundColor: COLORS.bgInput },
  cityChipSelected:  { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },
  cityText:          { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  cityTextSelected:  { color: COLORS.primary, fontWeight: '700' },

  termsRow:   { flexDirection: 'row', alignItems: 'center', gap: SPACING.md, marginVertical: SPACING.base },
  termsText:  { flex: 1, fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, lineHeight: 20 },
  termsLink:  { color: COLORS.primary, fontWeight: '600' },

  errorText:    { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginBottom: SPACING.sm },
  showPassRow:  { marginBottom: SPACING.md },
  showPassText: { fontSize: FONTS.sizes.sm, color: COLORS.primary },

  loginRow:  { alignItems: 'center', marginTop: SPACING.base },
  loginText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  loginLink: { color: COLORS.primary, fontWeight: '700' },
});

export default RegisterScreen;
