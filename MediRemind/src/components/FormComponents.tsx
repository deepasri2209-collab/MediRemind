import React from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

// ─── Search Bar ───────────────────────────────────────────────────────────────
interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search medicines...',
  style,
}) => (
  <View style={[styles.searchContainer, style]}>
    <Text style={styles.searchIcon}>🔍</Text>
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={COLORS.textMuted}
    />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChangeText('')}>
        <Text style={styles.searchClear}>✕</Text>
      </TouchableOpacity>
    )}
  </View>
);

// ─── Form Input ───────────────────────────────────────────────────────────────
interface FormInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  icon?: string;
  editable?: boolean;
  style?: ViewStyle;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
}

export const FormInput: React.FC<FormInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  error,
  icon,
  editable = true,
  style,
  autoCapitalize = 'sentences',
}) => (
  <View style={[styles.inputWrapper, style]}>
    {label && <Text style={styles.inputLabel}>{label}</Text>}
    <View style={[
      styles.inputContainer,
      error ? styles.inputError : null,
      !editable ? styles.inputDisabled : null,
    ]}>
      {icon && <Text style={styles.inputIcon}>{icon}</Text>}
      <TextInput
        style={[styles.input, multiline && styles.inputMultiline]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.textMuted}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? numberOfLines : 1}
        editable={editable}
        autoCapitalize={autoCapitalize}
      />
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  // Search Bar
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.round,
    paddingHorizontal: SPACING.base,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchIcon:  { fontSize: 16, marginRight: SPACING.sm },
  searchInput: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    height: 32,
  },
  searchClear: { fontSize: FONTS.sizes.md, color: COLORS.textMuted, paddingLeft: SPACING.sm },

  // Form Input
  inputWrapper:   { marginBottom: SPACING.base },
  inputLabel:     { fontSize: FONTS.sizes.sm, fontWeight: '600', color: COLORS.textSecondary, marginBottom: SPACING.xs },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgInput,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.base,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    minHeight: 52,
  },
  inputError:    { borderColor: COLORS.danger },
  inputDisabled: { opacity: 0.6 },
  inputIcon:     { fontSize: FONTS.sizes.base, marginRight: SPACING.sm },
  input: {
    flex: 1,
    fontSize: FONTS.sizes.md,
    color: COLORS.textPrimary,
    paddingVertical: SPACING.sm,
  },
  inputMultiline: { height: 90, textAlignVertical: 'top' },
  errorText:     { fontSize: FONTS.sizes.xs, color: COLORS.danger, marginTop: 4, marginLeft: 4 },
});
