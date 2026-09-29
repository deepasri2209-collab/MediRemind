import React from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { Button } from '../components/UIElements';

const { width } = Dimensions.get('window');
type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

const WelcomeScreen: React.FC<Props> = ({ navigation }) => (
  <View style={styles.container}>
    <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

    {/* Decorative circles */}
    <View style={styles.circle1} />
    <View style={styles.circle2} />
    <View style={styles.circle3} />

    {/* Hero */}
    <View style={styles.hero}>
      <View style={styles.logoBox}>
        <Text style={styles.logoEmoji}>💊</Text>
      </View>
      <Text style={styles.appName}>MediRemind</Text>
      <Text style={styles.fullName}>Smart Medicine Reminder</Text>
      <Text style={styles.tagline}>
        Never miss a dose again.{'\n'}Your health companion, always on time.
      </Text>
    </View>

    {/* Features */}
    <View style={styles.features}>
      {FEATURES.map((f, i) => (
        <View key={i} style={styles.featureRow}>
          <Text style={styles.featureIcon}>{f.icon}</Text>
          <Text style={styles.featureText}>{f.text}</Text>
        </View>
      ))}
    </View>

    {/* CTA */}
    <View style={styles.cta}>
      <Button
        title="Get Started"
        onPress={() => navigation.navigate('Login')}
        size="lg"
        style={styles.ctaBtn}
        icon="🚀"
      />
      <TouchableOpacity style={styles.signUpLink} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.signUpText}>
          New here? <Text style={styles.signUpHighlight}>Create an account</Text>
        </Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FEATURES = [
  { icon: '⏰', text: 'Smart daily reminders for all your medicines' },
  { icon: '📋', text: 'Track dosage, frequency & reminder history' },
  { icon: '🔒', text: 'Secure & private — your data stays on device' },
];

const styles = StyleSheet.create({
  container:    { flex: 1, backgroundColor: COLORS.bgDark, paddingHorizontal: SPACING.xl },

  circle1: {
    position: 'absolute', top: -60, right: -60,
    width: 200, height: 200, borderRadius: 100,
    backgroundColor: COLORS.primary + '20',
  },
  circle2: {
    position: 'absolute', top: 100, left: -80,
    width: 160, height: 160, borderRadius: 80,
    backgroundColor: COLORS.accent + '15',
  },
  circle3: {
    position: 'absolute', bottom: 120, right: -40,
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: COLORS.secondary + '18',
  },

  hero: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: SPACING.xxxl },
  logoBox: {
    width: 100, height: 100, borderRadius: 28,
    backgroundColor: COLORS.primary + '25',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: COLORS.primary + '50',
    marginBottom: SPACING.lg,
  },
  logoEmoji:  { fontSize: 56 },
  appName:    { fontSize: FONTS.sizes.hero, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 2 },
  fullName:   { fontSize: FONTS.sizes.sm, color: COLORS.primary, letterSpacing: 2, marginTop: 4, textTransform: 'uppercase' },
  tagline:    { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, textAlign: 'center', marginTop: SPACING.base, lineHeight: 22 },

  features: { marginVertical: SPACING.xl, gap: SPACING.md },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
  featureIcon: { fontSize: 22, width: 32, textAlign: 'center' },
  featureText: { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, flex: 1 },

  cta:         { paddingBottom: SPACING.xxxl },
  ctaBtn:      { borderRadius: RADIUS.xl },
  signUpLink:  { alignItems: 'center', marginTop: SPACING.base },
  signUpText:  { fontSize: FONTS.sizes.md, color: COLORS.textSecondary },
  signUpHighlight: { color: COLORS.primary, fontWeight: '700' },
});

export default WelcomeScreen;
