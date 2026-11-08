import Icon2D from '../../../components/common/Icon2D';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { userTokens } from '../../styles/userTokens';

export default function UserCustomerModal({
  visible,
  initialCustomer = null,
  onClose,
  onSaveCustomer
}) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name || '');
      setPhone(initialCustomer.phone || '');
    } else {
      setName('');
      setPhone('');
    }
    setErrorMsg('');
  }, [initialCustomer, visible]);

  const handleSubmit = () => {
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg('Customer name is required');
      return;
    }
    if (!phone.trim() || phone.trim().length < 8) {
      setErrorMsg('Valid mobile number is required');
      return;
    }

    onSaveCustomer({
      id: initialCustomer ? initialCustomer.id : undefined,
      name: name.trim(),
      phone: phone.startsWith('+91') ? phone.trim() : `+91 ${phone.trim()}`,
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

          {/* Screen 7 Top Bar: ← Add Customer */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={onClose} activeOpacity={0.7}>
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <Text style={styles.title}>
              {initialCustomer ? 'Edit Customer' : 'Add Customer'}
            </Text>
            <View style={styles.headerRightSpacer} />
          </View>

          {errorMsg ? (
            <View style={styles.errorBox}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}><Icon2D name="warning" size={15} color="#DC2626" /><Text style={styles.errorText}>{errorMsg}</Text></View>
            </View>
          ) : null}

          <View style={styles.formContent}>
            {/* Field 1: Customer Name * */}
            <View style={styles.field}>
              <Text style={styles.label}>Customer Name *</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter name"
                placeholderTextColor={userTokens.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
            </View>

            {/* Field 2: Mobile Number * */}
            <View style={styles.field}>
              <Text style={styles.label}>Mobile Number *</Text>
              <View style={styles.phoneInputRow}>
                <Icon2D name="phone" size={18} color="#64748B" />
                <TextInput
                  style={styles.phoneInput}
                  placeholder="+91 98765 43210"
                  placeholderTextColor={userTokens.colors.textMuted}
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>
            </View>

            {/* Screen 7 Primary Action: Save Customer */}
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={handleSubmit}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>
                {initialCustomer ? 'Update Customer' : 'Save Customer'}
              </Text>
            </TouchableOpacity>

            {/* Explicit Requirement Note (Prototype Screen 7) */}
            <Text style={styles.requirementNote}>
              No address field (as per requirement)
            </Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.4)',
  },
  sheet: {
    backgroundColor: userTokens.colors.surface,
    borderTopLeftRadius: userTokens.radii.xl,
    borderTopRightRadius: userTokens.radii.xl,
    paddingTop: userTokens.spacing.sm,
    paddingBottom: Platform.OS === 'ios' ? 40 : userTokens.spacing.xl,
    paddingHorizontal: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.float,
  },
  handle: {
    width: 44,
    height: 4,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.border,
    alignSelf: 'center',
    marginBottom: userTokens.spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: userTokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  backBtn: {
    padding: userTokens.spacing.xs,
  },
  backArrow: {
    fontSize: 22,
    color: userTokens.colors.textPrimary,
    fontWeight: userTokens.typography.bold,
  },
  title: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  headerRightSpacer: {
    width: 24,
  },
  errorBox: {
    backgroundColor: userTokens.colors.primaryLight,
    padding: userTokens.spacing.md,
    borderRadius: userTokens.radii.md,
    marginTop: userTokens.spacing.md,
    borderWidth: 1,
    borderColor: userTokens.colors.error,
  },
  errorText: {
    color: userTokens.colors.error,
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
  },
  formContent: {
    paddingTop: userTokens.spacing.lg,
  },
  field: {
    marginBottom: userTokens.spacing.lg,
  },
  label: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginBottom: userTokens.spacing.xs + 2,
  },
  input: {
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    paddingHorizontal: userTokens.spacing.base,
    height: 48,
    fontSize: userTokens.typography.base,
    color: userTokens.colors.textPrimary,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    paddingHorizontal: userTokens.spacing.base,
    height: 48,
  },
  phoneIcon: {
    fontSize: 16,
    marginRight: userTokens.spacing.sm,
  },
  phoneInput: {
    flex: 1,
    fontSize: userTokens.typography.base,
    color: userTokens.colors.textPrimary,
  },
  saveBtn: {
    backgroundColor: userTokens.colors.primary, // Solid Blue #2563EB
    height: 52,
    borderRadius: userTokens.radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  saveBtnText: {
    color: userTokens.colors.surface,
    fontSize: userTokens.typography.md,
    fontWeight: userTokens.typography.bold,
    letterSpacing: 0.3,
  },
  requirementNote: {
    textAlign: 'center',
    color: userTokens.colors.textSecondary,
    fontSize: userTokens.typography.xs,
    marginTop: userTokens.spacing.md,
    fontStyle: 'italic',
  }
});
