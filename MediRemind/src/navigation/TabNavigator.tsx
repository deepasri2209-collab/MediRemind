import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { COLORS, FONTS, SPACING } from '../utils/theme';
import HomeScreen          from '../screens/HomeScreen';
import MedicineListScreen  from '../screens/MedicineListScreen';
import AddMedicineScreen   from '../screens/AddMedicineScreen';
import ReminderHistoryScreen from '../screens/ReminderHistoryScreen';
import ProfileScreen       from '../screens/ProfileScreen';
import { useSelector }     from 'react-redux';
import { RootState }       from '../store';

const Tab = createBottomTabNavigator<TabParamList>();

const TAB_ICONS: Record<string, { icon: string; label: string; color: string }> = {
  Home:            { icon: '🏠', label: 'Home',      color: COLORS.primary   },
  Medicines:       { icon: '💊', label: 'Medicines', color: COLORS.accent    },
  AddMedicine:     { icon: '➕', label: 'Add',       color: COLORS.secondary },
  ReminderHistory: { icon: '⏰', label: 'Reminders', color: COLORS.warning   },
  Profile:         { icon: '👤', label: 'Profile',   color: COLORS.accentAlt },
};

const TabNavigator: React.FC = () => {
  const pendingCount = useSelector(
    (s: RootState) => s.reminders.reminders.filter(r => r.status === 'Pending').length,
  );

  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const cfg = TAB_ICONS[route.name];
        return {
          headerShown: false,
          tabBarStyle: styles.tabBar,
          tabBarShowLabel: false,
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              style={[props.style, styles.tabBtn]}
              activeOpacity={0.8}
            />
          ),
          tabBarIcon: ({ focused }: { focused: boolean }) => {
            const hasBadge = route.name === 'ReminderHistory' && pendingCount > 0;
            return (
              <View style={[styles.tabIcon, focused && { backgroundColor: cfg.color + '25' }]}>
                <Text style={styles.tabEmoji}>{cfg.icon}</Text>
                {hasBadge && (
                  <View style={styles.tabBadge}>
                    <Text style={styles.tabBadgeText}>{pendingCount}</Text>
                  </View>
                )}
                <Text style={[styles.tabLabel, focused && { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            );
          },
        };
      }}
    >
      <Tab.Screen name="Home"            component={HomeScreen} />
      <Tab.Screen name="Medicines"       component={MedicineListScreen} />
      <Tab.Screen name="AddMedicine"     component={AddMedicineScreen} />
      <Tab.Screen name="ReminderHistory" component={ReminderHistoryScreen} />
      <Tab.Screen name="Profile"         component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.bgCard,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    height: 65,
    paddingBottom: SPACING.xs,
  },
  tabBtn:  { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: {
    alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: SPACING.md, paddingVertical: 5,
    borderRadius: 12,
  },
  tabEmoji: { fontSize: 22 },
  tabLabel: { fontSize: FONTS.sizes.xs - 1, color: COLORS.textMuted, marginTop: 2, fontWeight: '600' },
  tabBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: COLORS.danger, borderRadius: 8, minWidth: 16, height: 16,
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3,
  },
  tabBadgeText: { fontSize: 9, fontWeight: '800', color: COLORS.white },
});

export default TabNavigator;
