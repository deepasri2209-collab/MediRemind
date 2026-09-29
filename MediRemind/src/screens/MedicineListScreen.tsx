import React, { useState, useContext } from 'react';
import {
  View, Text, StyleSheet, FlatList, StatusBar,
  TouchableOpacity, Alert,
} from 'react-native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { TabParamList } from '../types';
import { COLORS, FONTS, SPACING, RADIUS } from '../utils/theme';
import { SectionHeader, EmptyState, Button } from '../components/UIElements';
import { MedicineCard } from '../components/Cards';
import { SearchBar } from '../components/FormComponents';
import { MedicineContext } from '../context/MedicineContext';

type Props = BottomTabScreenProps<TabParamList, 'Medicines'>;

const MedicineListScreen: React.FC<Props> = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [filter,     setFilter]     = useState<'All' | 'Active' | 'Inactive'>('All');
  const { medicines, removeMedicine } = useContext(MedicineContext);

  const filtered = medicines.filter(m => {
    const matchText = m.name.toLowerCase().includes(searchText.toLowerCase()) ||
                      (m.category ?? '').toLowerCase().includes(searchText.toLowerCase());
    const matchFilter = filter === 'All' ? true : filter === 'Active' ? m.isActive : !m.isActive;
    return matchText && matchFilter;
  });

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      'Delete Medicine',
      `Remove "${name}" from your list?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => removeMedicine(id) },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor={COLORS.bgDark} barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Medicines</Text>
        <Text style={styles.count}>{medicines.length} total</Text>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <SearchBar value={searchText} onChangeText={setSearchText} placeholder="Search by name or category..." style={{ flex: 1 }} />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {(['All', 'Active', 'Inactive'] as const).map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
        <View style={{ flex: 1 }} />
        <Button title="+ Add" size="sm" onPress={() => (navigation as any).navigate('AddMedicine')} />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <EmptyState
            icon="💊"
            title="No medicines found"
            subtitle={searchText ? `No results for "${searchText}"` : 'Add your first medicine to get started.'}
            actionTitle="Add Medicine"
            onAction={() => (navigation as any).navigate('AddMedicine')}
          />
        }
        renderItem={({ item }) => (
          <MedicineCard
            medicine={item}
            onPress={() => (navigation as any).navigate('MedicineDetails', { medicine: item })}
            onEdit={() => (navigation as any).navigate('EditMedicine', { medicine: item })}
            onDelete={() => handleDelete(item.id, item.name)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bgDark },
  header: {
    paddingHorizontal: SPACING.xl, paddingTop: SPACING.xl, paddingBottom: SPACING.sm,
    flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between',
  },
  title: { fontSize: FONTS.sizes.xxl, fontWeight: '800', color: COLORS.textPrimary },
  count: { fontSize: FONTS.sizes.sm,  color: COLORS.textMuted },

  searchRow: { paddingHorizontal: SPACING.xl, marginBottom: SPACING.md },

  filterRow: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.sm,
    paddingHorizontal: SPACING.xl, marginBottom: SPACING.md,
  },
  filterChip: {
    paddingHorizontal: SPACING.md, paddingVertical: 6,
    borderRadius: RADIUS.round, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.bgCard,
  },
  filterChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '25' },
  filterText:       { fontSize: FONTS.sizes.sm, color: COLORS.textSecondary, fontWeight: '600' },
  filterTextActive: { color: COLORS.primary },

  list: { paddingHorizontal: SPACING.xl, paddingBottom: SPACING.xxxl },
});

export default MedicineListScreen;
