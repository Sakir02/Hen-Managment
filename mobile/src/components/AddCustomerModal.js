import Icon2D from './common/Icon2D';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { tokens } from '../styles/tokens';

export default function AddCustomerModal({
  visible,
  initialCustomer = null,
  onClose,
  onSaveCustomer
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name || '');
      setPhone(initialCustomer.phone || '');
      setNotes(initialCustomer.notes || '');
    } else {
      setName('');
      setPhone('+91 ');
      setNotes('');
    }
    setErrorMsg('');
  }, [initialCustomer, visible]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Customer or business name is required');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Valid contact phone number is required');
      return;
    }

    onSaveCustomer({
      id: initialCustomer ? initialCustomer.id : undefined,
      name: name.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backdrop} />
        </TouchableWithoutFeedback>

        <View style={styles.sheet}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {initialCustomer ? 'Edit Customer Profile' : 'New Customer Account'}
              </Text>
              <Text style={styles.subtitle}>
                {initialCustomer
                  ? 'Update trading partner details and delivery address'
                  : 'Register a poultry farm, broiler trader, or buyer'}
              </Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <Icon2D name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
            </View>
          ) : null}

          <ScrollView
            style={styles.form}
            contentContainerStyle={styles.formContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.field}>
              <Text style={styles.label}>Customer / Farm Business Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Ramesh Poultry Farm"
                placeholderTextColor={tokens.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Mobile Phone Number *</Text>
              <TextInput
                style={styles.input}
                placeholder="+91 98765 43210"
                placeholderTextColor={tokens.colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
            </View>


            <View style={styles.field}>
              <Text style={styles.label}>Commercial / Operational Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="e.g. Weekly bulk buyer, prefers early morning dispatch"
                placeholderTextColor={tokens.colors.textMuted}
                multiline
                numberOfLines={2}
                value={notes}
                onChangeText={setNotes}
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSubmit}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>
                {initialCustomer ? 'Save Changes' : 'Create Account'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
  },
  sheet: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    maxHeight: '88%',
    paddingTop: tokens.spacing.md,
    ...tokens.shadows.float,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: tokens.colors.border,
    borderRadius: tokens.radii.full,
    alignSelf: 'center',
    marginBottom: tokens.spacing.sm,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.base,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  title: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: {
    fontSize: 14,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.bold,
  },
  errorBox: {
    backgroundColor: tokens.colors.errorLight,
    padding: tokens.spacing.sm,
    marginHorizontal: tokens.spacing.base,
    marginTop: tokens.spacing.sm,
    borderRadius: tokens.radii.sm,
  },
  errorText: {
    color: tokens.colors.error,
    fontSize: 12,
    fontWeight: tokens.typography.medium,
  },
  form: {
    paddingHorizontal: tokens.spacing.base,
  },
  formContent: {
    paddingVertical: tokens.spacing.base,
    gap: tokens.spacing.base,
  },
  field: {},
  label: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: tokens.colors.surface,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    borderRadius: tokens.radii.md,
    height: tokens.touchTarget.minHeight,
    paddingHorizontal: tokens.spacing.md,
    fontSize: tokens.typography.sm,
    color: tokens.colors.textPrimary,
  },
  textArea: {
    height: 64,
    paddingTop: tokens.spacing.sm,
    textAlignVertical: 'top',
  },
  footer: {
    flexDirection: 'row',
    padding: tokens.spacing.base,
    gap: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  cancelBtn: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.card,
  },
  saveBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
