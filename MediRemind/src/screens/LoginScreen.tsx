import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  StatusBar, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button } from '../components/UIElements';
import { FormInput } from '../components/FormComponents';
import { UserContext } from '../context/UserContext';
import { validateEmail, validatePassword } from '../utils/validation';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

// Simulated credentials (Exp 6 — JWT simulation)
const MOCK_USERS = [
  { email: 'deepasrid@student.tce.edu', password: 'Admin@123' },
  { email: 'admin@medi.com',            password: 'Admin@123' },
];

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [email,    setEmail]    = useState('deepasrid@student.tce.edu');
  const [password, setPassword] = useState('Admin@123');
  const [errors,   setErrors]   = useState<{ email?: string; password?: string }>({});
  const [loading,  setLoading]  = useState(false);
  const [showPass, setShowPass] = useState(false);

  const { setUser } = useContext(UserContext);

  const validate = (): boolean => {
    const errs: typeof errors = {};
    if (!email)                    errs.email    = 'Email is required.';
    else if (!validateEmail(email)) errs.email   = 'Enter a valid email address.';
    if (!password)                  errs.password = 'Password is required.';
    else if (!validatePassword(password)) errs.password = 'Min 8 chars, 1 uppercase, 1 digit, 1 special char.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 800)); // simulate network
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      if (!user) {
        Alert.alert('Login Failed', 'Invalid email or password.');
        setLoading(false);
        return;
      }
      // Simulated JWT token
      const token = btoa(JSON.stringify({ email, exp: Date.now() + 86400000 }));
      await AsyncStorage.setItem('auth_token', token);
      await AsyncStorage.setItem('user_email', email);
      setUser({ id: 'u1', fullName: 'Deepasri D', email, phone: '9876543210' });
      navigation.replace('Main' as any);
    } catch (e) {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarIcon}>👤</Text>
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to manage your medicines</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <FormInput
            label="Email Address"
            value={email}
            onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: undefined })); }}
            placeholder="your@email.com"
            keyboardType="email-address"
            autoCapitalize="none"
            icon="📧"
            error={errors.email}
          />
          <View>
            <FormInput
              label="Password"
              value={password}
              onChangeText={v => { setPassword(v); setErrors(p => ({ ...p, password: undefined })); }}
              placeholder="Enter password"
              secureTextEntry={!showPass}
              autoCapitalize="none"
              icon="🔒"
              error={errors.password}
            />
            <TouchableOpacity style={styles.showPassBtn} onPress={() => setShowPass(p => !p)}>
              <Text style={styles.showPassText}>{showPass ? '🙈 Hide' : '👁️ Show'}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotBtn} onPress={() => Alert.alert('Forgot Password', 'A reset link has been sent to your email.')}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <Button title="Login" onPress={handleLogin} loading={loading} size="lg" style={{ marginTop: SPACING.sm }} />
        </View>

        {/* Sign Up */}
        <View style={styles.signupRow}>
          <Text style={styles.signupText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.signupLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.demoNote}>Demo: deepasrid@student.tce.edu / Admin@123</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  content:   { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl },

  header: { alignItems: 'center', paddingTop: SPACING.xxxl + SPACING.xl, paddingBottom: SPACING.xl },
  avatarContainer: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: COLORS.primary + '25',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.primary + '60',
    marginBottom: SPACING.base,
  },
  avatarIcon: { fontSize: 44 },
  title:      { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  subtitle:   { fontSize: FONTS.sizes.md,  color: COLORS.textSecondary, marginTop: SPACING.xs },

  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: SPACING.md,
  },

  showPassBtn:  { position: 'absolute', right: SPACING.base, bottom: SPACING.xl + 2 },
  showPassText: { fontSize: FONTS.sizes.sm, color: COLORS.primary },

  forgotBtn:  { alignSelf: 'flex-end', marginTop: SPACING.sm },
  forgotText: { fontSize: FONTS.sizes.sm, color: COLORS.primary, fontWeight: '600' },

  signupRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: SPACING.xl },
  signupText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  signupLink: { fontSize: FONTS.sizes.md, color: COLORS.primary, fontWeight: '700' },

  demoNote: {
    textAlign: 'center', marginTop: SPACING.base,
    fontSize: FONTS.sizes.xs, color: COLORS.textMuted,
    fontStyle: 'italic',
  },
});

export default LoginScreen;
