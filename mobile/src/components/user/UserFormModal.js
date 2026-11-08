import Icon2D from '../common/Icon2D';
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback
} from 'react-native';
import { tokens } from '../../styles/tokens';

const ROLE_PERMISSIONS_SUMMARY = {
  'Super Admin': [
    'Unrestricted access to all ledgers & settings',
    'Full permission to edit Mandi daily rates',
    'Add, deactivate, and manage all staff users',
    'Delete records with full audit trail tracking'
  ],
  'Farm Manager': [
    'Create and edit customer profiles & ledgers',
    'Full authority over Hen inventory & weighing',
    'Record payments and issue transaction receipts',
    'Cannot alter Mandi standard rates or staff roles'
  ],
  'Field Operator': [
    'Log daily bird intake (Marga & Margee)',
    'Collect cash & UPI tokens at farm counter',
    'View assigned customer lists & stock',
    'Cannot edit standard rates or remove historical data'
  ],
  'Billing Auditor': [
    'View all billing ledgers, totals, and receipts',
    'Read-only access to audit trail diff logs',
    'Reconcile bank payments and flag disputes',
    'Cannot add hens or delete customer accounts'
  ]
};

export default function UserFormModal({
  visible,
  initialUser = null,
  onSave,
  onClose
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Field Operator');
  const [status, setStatus] = useState('ACTIVE');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialUser) {
      setName(initialUser.name || '');
      setEmail(initialUser.email || '');
      setPhone(initialUser.phone || '');
      setRole(initialUser.role || 'Field Operator');
      setStatus(initialUser.status || 'ACTIVE');
    } else {
      setName('');
      setEmail('');
      setPhone('+91 ');
      setRole('Field Operator');
      setStatus('ACTIVE');
    }
    setErrors({});
  }, [initialUser, visible]);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Full name is required';
    if (!email.trim() || !email.includes('@')) errs.email = 'Valid email address is required';
    if (!phone.trim() || phone.length < 10) errs.phone = 'Valid phone number is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    onSave({
      id: initialUser ? initialUser.id : undefined,
      name,
      email,
      phone,
      role,
      status
    });
    onClose();
  };

  const rolesList = ['Super Admin', 'Farm Manager', 'Field Operator', 'Billing Auditor'];

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

        <View style={styles.sheetContainer}>
          <View style={styles.handle} />

          {/* Modal Header */}
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.modalTitle}>
                {initialUser ? 'Edit Staff Account' : 'Register New Staff'}
              </Text>
              <Text style={styles.modalSubtitle}>
                {initialUser ? 'Update permissions and personal information' : 'Create an operational profile with assigned role'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon2D name="close" size={22} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.formScroll}
            contentContainerStyle={styles.formScrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Avatar / Profile Area (Spec Section 9) */}
            <View style={styles.avatarSection}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {name ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : <Icon2D name="user" size={24} color="#2563EB" />}
                </Text>
              </View>
              <Text style={styles.avatarHint}>Staff Profile Picture / Initials</Text>
            </View>

            {/* Name */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Legal Name *</Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="e.g. Ramesh Patel"
                placeholderTextColor={tokens.colors.textMuted}
                value={name}
                onChangeText={setName}
              />
              {errors.name ? <Text style={styles.errorText}>{errors.name}</Text> : null}
            </View>

            {/* Phone */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Contact Phone Number *</Text>
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+91 98765 43210"
                placeholderTextColor={tokens.colors.textMuted}
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              {errors.phone ? <Text style={styles.errorText}>{errors.phone}</Text> : null}
            </View>

            {/* Email */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Official Email Address *</Text>
              <TextInput
                style={[styles.input, errors.email && styles.inputError]}
                placeholder="ramesh.patel@henoperations.com"
                placeholderTextColor={tokens.colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              {errors.email ? <Text style={styles.errorText}>{errors.email}</Text> : null}
            </View>

            {/* Role Selector Chips */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Assigned System Role *</Text>
              <View style={styles.roleChips}>
                {rolesList.map((r) => {
                  const isSelected = role === r;
                  return (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleChip, isSelected && styles.roleChipSelected]}
                      onPress={() => setRole(r)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.roleChipText, isSelected && styles.roleChipTextSelected]}>
                        {r}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Status Switch (Active / Inactive) */}
            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Account Operational Status</Text>
              <View style={styles.statusToggleRow}>
                <TouchableOpacity
                  style={[styles.statusToggleBtn, status === 'ACTIVE' && styles.statusToggleActive]}
                  onPress={() => setStatus('ACTIVE')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statusToggleText, status === 'ACTIVE' && styles.statusToggleTextActive]}>
                    Active Account
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.statusToggleBtn, status === 'INACTIVE' && styles.statusToggleInactive]}
                  onPress={() => setStatus('INACTIVE')}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.statusToggleText, status === 'INACTIVE' && styles.statusToggleTextInactive]}>
                    Inactive / Suspended
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Access / Permission Summary Preview (Spec Section 9) */}
            <View style={styles.permissionBox}>
              <Text style={styles.permissionBoxTitle}>
                Access Summary: <Text style={styles.boldText}>{role}</Text>
              </Text>
              <View style={styles.permissionList}>
                {(ROLE_PERMISSIONS_SUMMARY[role] || []).map((perm, idx) => (
                  <Text key={idx} style={styles.permissionItem}>
                    {perm}
                  </Text>
                ))}
              </View>
            </View>
          </ScrollView>

          {/* Action Footer */}
          <View style={styles.footerRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <Text style={styles.saveButtonText}>
                {initialUser ? 'Update Profile' : 'Save Staff Account'}
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
  sheetContainer: {
    backgroundColor: tokens.colors.surface,
    borderTopLeftRadius: tokens.radii.xl,
    borderTopRightRadius: tokens.radii.xl,
    maxHeight: '90%',
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: tokens.spacing.base,
    paddingBottom: tokens.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  modalTitle: {
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  modalSubtitle: {
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
  formScroll: {
    paddingHorizontal: tokens.spacing.base,
  },
  formScrollContent: {
    paddingVertical: tokens.spacing.base,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: tokens.spacing.base,
  },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    borderWidth: 2,
    borderColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: tokens.spacing.xs,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  avatarHint: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
  },
  fieldGroup: {
    marginBottom: tokens.spacing.base,
  },
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
  inputError: {
    borderColor: tokens.colors.error,
  },
  errorText: {
    fontSize: 11,
    color: tokens.colors.error,
    marginTop: 4,
  },
  roleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: tokens.spacing.xs,
  },
  roleChip: {
    paddingHorizontal: tokens.spacing.md,
    paddingVertical: tokens.spacing.sm,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  roleChipSelected: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  roleChipText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.medium,
  },
  roleChipTextSelected: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  statusToggleRow: {
    flexDirection: 'row',
    gap: tokens.spacing.sm,
  },
  statusToggleBtn: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: tokens.colors.background,
  },
  statusToggleActive: {
    backgroundColor: tokens.colors.primaryLight,
    borderColor: tokens.colors.primary,
  },
  statusToggleInactive: {
    backgroundColor: '#FEE2E2',
    borderColor: tokens.colors.error,
  },
  statusToggleText: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
    fontWeight: tokens.typography.semibold,
  },
  statusToggleTextActive: {
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  statusToggleTextInactive: {
    color: tokens.colors.error,
    fontWeight: tokens.typography.bold,
  },
  permissionBox: {
    backgroundColor: tokens.colors.background,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    marginBottom: tokens.spacing.base,
  },
  permissionBoxTitle: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
    marginBottom: tokens.spacing.sm,
  },
  boldText: {
    color: tokens.colors.primary,
  },
  permissionList: {
    gap: 6,
  },
  permissionItem: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    lineHeight: 16,
  },
  footerRow: {
    flexDirection: 'row',
    padding: tokens.spacing.base,
    gap: tokens.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: tokens.colors.border,
    backgroundColor: tokens.colors.surface,
  },
  cancelButton: {
    flex: 1,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textSecondary,
  },
  saveButton: {
    flex: 2,
    height: tokens.touchTarget.minHeight,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...tokens.shadows.card,
  },
  saveButtonText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.surface,
  }
});
