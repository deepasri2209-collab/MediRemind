import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  const fadeAnim  = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.6);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim,  { toValue: 1, duration: 900, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 5,   useNativeDriver: true }),
    ]).start();

    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('auth_token');
        await new Promise(r => setTimeout(r, 2200));
        if (token) {
          navigation.replace('Main' as any);
        } else {
          navigation.replace('Welcome');
        }
      } catch {
        await new Promise(r => setTimeout(r, 2200));
        navigation.replace('Welcome');
      }
    };
    checkToken();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />
      <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>💊</Text>
          <View style={styles.logoPulse} />
        </View>
        <Text style={styles.appName}>MediRemind</Text>
        <Text style={styles.tagline}>Smart Medicine Reminder</Text>
        <View style={styles.dots}>
          {[0, 1, 2].map(i => (
            <View key={i} style={[styles.dot, { opacity: 0.4 + i * 0.3 }]} />
          ))}
        </View>
      </Animated.View>
      <Text style={styles.version}>v1.0.0 · TCE</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container:      { flex: 1, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center' },
  content:        { alignItems: 'center' },
  logoContainer:  { width: 110, height: 110, alignItems: 'center', justifyContent: 'center', marginBottom: SPACING.lg },
  logoEmoji:      { fontSize: 72 },
  logoPulse: {
    position: 'absolute',
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 2,
    borderColor: COLORS.primary + '40',
  },
  appName:  { fontSize: FONTS.sizes.hero, fontWeight: '800', color: COLORS.textPrimary, letterSpacing: 2 },
  tagline:  { fontSize: FONTS.sizes.md,   color: COLORS.textSecondary, marginTop: SPACING.sm, letterSpacing: 1 },
  dots:     { flexDirection: 'row', marginTop: SPACING.xl, gap: 8 },
  dot:      { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.primary },
  version:  { position: 'absolute', bottom: SPACING.lg, fontSize: FONTS.sizes.xs, color: COLORS.textMuted },
});

export default SplashScreen;
