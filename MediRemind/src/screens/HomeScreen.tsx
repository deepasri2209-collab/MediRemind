import React, { useState, useEffect, useContext } from 'react';
import {
  View, Text, StyleSheet, ScrollView, StatusBar,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { DrawerScreenProps } from '@react-navigation/drawer';
import { TabParamList, DrawerParamList, Medicine } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { SectionHeader } from '../components/UIElements';
import { QuickAccessCard, ReminderCard } from '../components/Cards';
import { SearchBar } from '../components/FormComponents';
import { MedicineContext } from '../context/MedicineContext';
import { UserContext } from '../context/UserContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { SAMPLE_REMINDERS } from '../data/sampleData';

type Props = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, 'Home'>,
  DrawerScreenProps<DrawerParamList>
>;

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchText,   setSearchText]   = useState('');
  const [welcomeMsg,   setWelcomeMsg]   = useState('');
  const [refreshing,   setRefreshing]   = useState(false);
  const { medicines }  = useContext(MedicineContext);
  const { user }       = useContext(UserContext);
  const reminders      = useSelector((s: RootState) => s.reminders.reminders);

  const pendingCount = reminders.filter(r => r.status === 'Pending').length;
  const upcomingReminders = (reminders.length ? reminders : SAMPLE_REMINDERS)
    .filter(r => r.status === 'Pending')
    .slice(0, 3);

  // useEffect: welcome message on mount
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12)       setWelcomeMsg('Good Morning ☀️');
    else if (hour < 17)  setWelcomeMsg('Good Afternoon 🌤️');
    else if (hour < 20)  setWelcomeMsg('Good Evening 🌆');
    else                 setWelcomeMsg('Good Night 🌙');
  }, []);

  const filteredMeds = medicines.filter(m =>
    m.name.toLowerCase().includes(searchText.toLowerCase()) ||
    (m.category ?? '').toLowerCase().includes(searchText.toLowerCase()),
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const QUICK_ACTIONS = [
    { icon: '➕', title: 'Add Medicine',      subtitle: 'New dose',    color: COLORS.primary,   action: () => (navigation as any).navigate('AddMedicine') },
    { icon: '💊', title: 'Medicine List',     subtitle: `${medicines.length} meds`, color: COLORS.accent,   action: () => (navigation as any).navigate('Medicines') },
    { icon: '⏰', title: 'Reminders',         subtitle: 'History',     color: COLORS.secondary, action: () => (navigation as any).navigate('ReminderHistory'), badge: pendingCount },
    { icon: '👤', title: 'Profile',           subtitle: user?.fullName, color: COLORS.accentAlt, action: () => (navigation as any).navigate('Profile') },
  ];

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => (navigation as any).openDrawer()}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.greeting}>{welcomeMsg}</Text>
            <Text style={styles.userName}>{user?.fullName ?? 'User'}</Text>
          </View>
          <View style={styles.notifBtn}>
            <Text style={styles.notifIcon}>🔔</Text>
            {pendingCount > 0 && (
              <View style={styles.notifBadge}>
                <Text style={styles.notifBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Search */}
        <View style={styles.section}>
          <SearchBar value={searchText} onChangeText={setSearchText} />
        </View>

        {/* Upcoming Reminders Banner */}
        {!searchText && (
          <View style={styles.section}>
            <SectionHeader title="⏰ Upcoming Reminders" action="View all" onAction={() => (navigation as any).navigate('ReminderHistory')} />
            {upcomingReminders.length > 0 ? (
              upcomingReminders.map(r => <ReminderCard key={r.id} reminder={r} />)
            ) : (
              <View style={styles.emptyBanner}>
                <Text style={styles.emptyBannerText}>🎉 All caught up! No pending reminders.</Text>
              </View>
            )}
          </View>
        )}

        {/* Search Results */}
        {searchText.length > 0 && (
          <View style={styles.section}>
            <SectionHeader title={`Results for "${searchText}"`} />
            {filteredMeds.length === 0 ? (
              <Text style={styles.noResults}>No medicines found.</Text>
            ) : (
              filteredMeds.map(m => (
                <TouchableOpacity key={m.id} style={styles.searchResult}
                  onPress={() => (navigation as any).navigate('MedicineDetails', { medicine: m })}>
                  <Text style={styles.srName}>{m.name}</Text>
                  <Text style={styles.srDetail}>{m.dosage} · {m.frequency}</Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        )}

        {/* Quick Access Cards */}
        {!searchText && (
          <View style={styles.section}>
            <SectionHeader title="Quick Access" />
            <View style={styles.quickGrid}>
              {QUICK_ACTIONS.map((qa, i) => (
                <QuickAccessCard
                  key={i}
                  icon={qa.icon}
                  title={qa.title}
                  subtitle={qa.subtitle}
                  color={qa.color}
                  onPress={qa.action}
                  badge={qa.badge}
                />
              ))}
            </View>
          </View>
        )}

        {/* Today's Medicines */}
        {!searchText && (
          <View style={styles.section}>
            <SectionHeader title="💊 Today's Medicines" action="See all"
              onAction={() => (navigation as any).navigate('Medicines')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {medicines.slice(0, 5).map(m => (
                <TouchableOpacity key={m.id} style={styles.todayMedCard}
                  onPress={() => (navigation as any).navigate('MedicineDetails', { medicine: m })}>
                  <View style={[styles.todayMedDot, { backgroundColor: m.isActive ? COLORS.success : COLORS.textMuted }]} />
                  <Text style={styles.todayMedName}>{m.name}</Text>
                  <Text style={styles.todayMedDose}>{m.dosage}</Text>
                  <Text style={styles.todayMedTime}>⏰ {m.reminderTime}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        <View style={{ height: SPACING.xxxl }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.base,
  },
  menuIcon:    { fontSize: 24, color: COLORS.textPrimary },
  headerCenter:{ flex: 1, alignItems: 'center' },
  greeting:    { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary },
  userName:    { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  notifBtn:    { width: 40, alignItems: 'center' },
  notifIcon:   { fontSize: 22 },
  notifBadge:  { position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: COLORS.danger, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { fontSize: 9, fontWeight: '700', color: COLORS.white },

  section: { paddingHorizontal: SPACING.xl, marginTop: SPACING.base },

  emptyBanner: {
    backgroundColor: COLORS.success + '15', borderRadius: RADIUS.lg,
    padding: SPACING.base, borderWidth: 1, borderColor: COLORS.success + '30',
  },
  emptyBannerText: { color: COLORS.success, textAlign: 'center', fontWeight: '600' },

  noResults:    { color: COLORS.textMuted, textAlign: 'center', marginTop: SPACING.base },

  searchResult: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md, padding: SPACING.base,
    marginBottom: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  srName:   { fontSize: FONTS.sizes.base, fontWeight: '700', color: COLORS.textPrimary },
  srDetail: { fontSize: FONTS.sizes.sm,   color: COLORS.textSecondary, marginTop: 2 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -SPACING.xs },

  // Today's Meds
  todayMedCard: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg, padding: SPACING.base,
    width: 130, marginRight: SPACING.md, borderWidth: 1, borderColor: COLORS.border,
  },
  todayMedDot:  { width: 8, height: 8, borderRadius: 4, marginBottom: SPACING.sm },
  todayMedName: { fontSize: FONTS.sizes.sm, fontWeight: '700', color: COLORS.textPrimary },
  todayMedDose: { fontSize: FONTS.sizes.xs, color: COLORS.textSecondary, marginTop: 2 },
  todayMedTime: { fontSize: FONTS.sizes.xs, color: COLORS.textMuted, marginTop: 4 },
});

export default HomeScreen;
