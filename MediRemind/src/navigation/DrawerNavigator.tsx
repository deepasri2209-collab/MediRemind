import React, { useContext } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView,
} from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer';
import { DrawerParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import TabNavigator from './TabNavigator';
import ReminderSettingsScreen from '../screens/ReminderSettingsScreen';
import { UserContext } from '../context/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Drawer = createDrawerNavigator<DrawerParamList>();

const DRAWER_ITEMS = [
  { name: 'ReminderSettings',          label: 'Reminder Settings',        icon: '🔔' },
  { name: 'NotificationPreferences',   label: 'Notification Preferences', icon: '⚙️' },
  { name: 'MedicineCategories',        label: 'Medicine Categories',      icon: '🏷️' },
  { name: 'HelpSupport',               label: 'Help & Support',           icon: '❓' },
];

const CustomDrawerContent = (props: any) => {
  const { user, setUser } = useContext(UserContext);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('auth_token');
          setUser(null);
          props.navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContent}>
      {/* User Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.drawerAvatar}>
          <Text style={styles.drawerAvatarText}>{(user?.fullName ?? 'U').charAt(0)}</Text>
        </View>
        <Text style={styles.drawerName}>{user?.fullName ?? 'User'}</Text>
        <Text style={styles.drawerEmail}>{user?.email}</Text>
      </View>

      {/* Nav Items */}
      <View style={styles.drawerItems}>
        {DRAWER_ITEMS.map(item => (
          <TouchableOpacity
            key={item.name}
            style={styles.drawerItem}
            onPress={() => props.navigation.navigate(item.name)}
          >
            <Text style={styles.drawerItemIcon}>{item.icon}</Text>
            <Text style={styles.drawerItemLabel}>{item.label}</Text>
            <Text style={styles.drawerItemChevron}>›</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutIcon}>🚪</Text>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>MediRemind v1.0.0</Text>
    </DrawerContentScrollView>
  );
};

// Placeholder screens for drawer-only items
const PlaceholderScreen: React.FC<{ route: any }> = ({ route }) => (
  <View style={styles.placeholder}>
    <Text style={styles.placeholderIcon}>🚧</Text>
    <Text style={styles.placeholderTitle}>{route.name.replace(/([A-Z])/g, ' $1').trim()}</Text>
    <Text style={styles.placeholderSub}>This section is coming soon.</Text>
  </View>
);

const DrawerNavigator: React.FC = () => (
  <Drawer.Navigator
    screenOptions={{ headerShown: false, drawerStyle: styles.drawer }}
    drawerContent={props => <CustomDrawerContent {...props} />}
  >
    <Drawer.Screen name="TabHome"                 component={TabNavigator} />
    <Drawer.Screen name="ReminderSettings"        component={ReminderSettingsScreen} />
    <Drawer.Screen name="NotificationPreferences" component={PlaceholderScreen} />
    <Drawer.Screen name="MedicineCategories"      component={PlaceholderScreen} />
    <Drawer.Screen name="HelpSupport"             component={PlaceholderScreen} />
    <Drawer.Screen name="Logout"                  component={PlaceholderScreen} />
  </Drawer.Navigator>
);

const styles = StyleSheet.create({
  drawer: { backgroundColor: COLORS.bgDark, width: 280 },

  drawerContent: { flex: 1 },
  drawerHeader: {
    backgroundColor: COLORS.bgCard, padding: SPACING.xl,
    paddingTop: SPACING.xxxl, borderBottomWidth: 1, borderBottomColor: COLORS.border,
    marginBottom: SPACING.md,
  },
  drawerAvatar: {
    width: 70, height: 70, borderRadius: 35,
    backgroundColor: COLORS.primary + '30',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  drawerAvatarText:  { fontSize: FONTS.sizes.xxxl, fontWeight: '800', color: COLORS.primary },
  drawerName:        { fontSize: FONTS.sizes.lg, fontWeight: '700', color: COLORS.textPrimary },
  drawerEmail:       { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, marginTop: 2 },

  drawerItems: { flex: 1, paddingHorizontal: SPACING.md },
  drawerItem: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm, borderRadius: RADIUS.md, marginBottom: 4,
  },
  drawerItemIcon:    { fontSize: 20, width: 32 },
  drawerItemLabel:   { flex: 1, fontSize: FONTS.sizes.md, color: COLORS.textPrimary, fontWeight: '600' },
  drawerItemChevron: { fontSize: FONTS.sizes.xl, color: COLORS.textMuted },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: SPACING.md, marginBottom: SPACING.md,
    paddingHorizontal: SPACING.sm, paddingVertical: SPACING.md,
    borderRadius: RADIUS.md, borderWidth: 1, borderColor: COLORS.danger + '40',
    backgroundColor: COLORS.danger + '15',
  },
  logoutIcon:  { fontSize: 20, marginRight: SPACING.sm },
  logoutText:  { fontSize: FONTS.sizes.md, color: COLORS.danger, fontWeight: '700' },

  version:  { textAlign: 'center', color: COLORS.textMuted, fontSize: FONTS.sizes.xs, paddingBottom: SPACING.xl },

  placeholder: {
    flex: 1, backgroundColor: COLORS.bgDark, alignItems: 'center', justifyContent: 'center', padding: SPACING.xl,
  },
  placeholderIcon:  { fontSize: 64, marginBottom: SPACING.base },
  placeholderTitle: { fontSize: FONTS.sizes.xl, fontWeight: '700', color: COLORS.textPrimary, textAlign: 'center' },
  placeholderSub:   { fontSize: FONTS.sizes.md, color: COLORS.textSecondary, marginTop: SPACING.sm, textAlign: 'center' },
});

export default DrawerNavigator;
