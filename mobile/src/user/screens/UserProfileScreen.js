import Icon2D from '../../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';

export default function UserProfileScreen({ onBack }) {
  const { currentUser, showToast } = useAdminData();

  const [name, setName] = useState(currentUser?.name || 'Vikram Singh');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 97123 45672');
  const [email, setEmail] = useState(currentUser?.email || 'vikram.singh@henoperations.com');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  const handleSaveProfile = () => {
    setIsEditModalOpen(false);
    showToast('Profile information updated successfully!', 'success');
  };

  const handleChangePassword = () => {
    if (!currentPass || !newPass) {
      showToast('Please fill out both password fields', 'warning');
      return;
    }
    setIsPasswordModalOpen(false);
    setCurrentPass('');
    setNewPass('');
    showToast('Security PIN / Password changed successfully!', 'success');
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Operator Profile</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <View style={styles.roleBadge}>
            <Text style={styles.roleBadgeText}>{currentUser?.role || 'Field Operator'}</Text>
          </View>
          <Text style={styles.farmName}>Al-Farooq Operations • Unit 2 Mandi</Text>

          <View style={styles.cardDivider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Staff Contact:</Text>
            <Text style={styles.infoVal}>{phone}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Official Email:</Text>
            <Text style={styles.infoVal}>{email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Operational Shift:</Text>
            <Text style={styles.infoVal}>Morning Weighing (06:00 AM - 02:00 PM)</Text>
          </View>
        </View>

        {/* Profile Actions (Spec Section 17) */}
        <Text style={styles.sectionHeader}>ACCOUNT ACTIONS</Text>
        <View style={styles.actionGroup}>
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setIsEditModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconBox}>
              <Icon2D name="edit" size={18} color="#2563EB" />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={styles.actionTitle}>Edit Profile Information</Text>
              <Text style={styles.actionSub}>Update your phone number and display name</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>

          <View style={styles.itemDivider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => setIsPasswordModalOpen(true)}
            activeOpacity={0.7}
          >
            <View style={styles.actionIconBox}>
              <Icon2D name="lock" size={18} color="#64748B" />
            </View>
            <View style={styles.actionTextBox}>
              <Text style={styles.actionTitle}>Change Password / PIN</Text>
              <Text style={styles.actionSub}>Update your field authentication passcode</Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsEditModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Edit Profile</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Full Name</Text>
              <TextInput style={styles.input} value={name} onChangeText={setName} />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Phone Number</Text>
              <TextInput style={styles.input} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Email Address</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsEditModalOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile}>
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Change Password Modal */}
      <Modal
        visible={isPasswordModalOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPasswordModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Change Security Passcode</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Current Passcode</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="••••••"
                value={currentPass}
                onChangeText={setCurrentPass}
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>New Passcode</Text>
              <TextInput
                style={styles.input}
                secureTextEntry
                placeholder="••••••"
                value={newPass}
                onChangeText={setNewPass}
              />
            </View>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsPasswordModalOpen(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleChangePassword}>
                <Text style={styles.saveBtnText}>Update Passcode</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  },
  navBar: {
    height: 52,
    backgroundColor: userTokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: userTokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: userTokens.colors.border,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: userTokens.spacing.md,
  },
  backBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  screenTitle: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    paddingBottom: 40,
    gap: userTokens.spacing.md,
  },
  profileCard: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.xl,
    padding: userTokens.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  avatarCircle: {
    width: 68,
    height: 68,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    borderColor: userTokens.colors.primary,
    marginBottom: userTokens.spacing.sm,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  userName: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  roleBadge: {
    backgroundColor: userTokens.colors.secondaryLight,
    paddingHorizontal: userTokens.spacing.md,
    paddingVertical: 3,
    borderRadius: userTokens.radii.pill,
    marginTop: 4,
    marginBottom: 4,
  },
  roleBadgeText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.secondary,
  },
  farmName: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
  },
  cardDivider: {
    height: 1,
    backgroundColor: userTokens.colors.border,
    width: '100%',
    marginVertical: userTokens.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
  },
  infoVal: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    letterSpacing: 0.5,
    marginTop: userTokens.spacing.sm,
  },
  actionGroup: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    overflow: 'hidden',
    ...userTokens.shadows.card,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: userTokens.spacing.base,
    minHeight: userTokens.touchTarget.minHeight + 6,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  actionIcon: {
    fontSize: 16,
  },
  actionTextBox: {
    flex: 1,
  },
  actionTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  actionSub: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 1,
  },
  actionArrow: {
    fontSize: 20,
    color: userTokens.colors.textMuted,
  },
  itemDivider: {
    height: 1,
    backgroundColor: userTokens.colors.border,
    marginLeft: 60,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: userTokens.colors.surface,
    borderTopLeftRadius: userTokens.radii.xl,
    borderTopRightRadius: userTokens.radii.xl,
    padding: userTokens.spacing.xl,
    paddingBottom: userTokens.spacing.xxl,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: userTokens.colors.border,
    borderRadius: userTokens.radii.full,
    alignSelf: 'center',
    marginBottom: userTokens.spacing.md,
  },
  sheetTitle: {
    fontSize: userTokens.typography.lg,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
    marginBottom: userTokens.spacing.md,
  },
  fieldGroup: {
    marginBottom: userTokens.spacing.base,
  },
  fieldLabel: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
    marginBottom: 6,
  },
  input: {
    backgroundColor: userTokens.colors.surface,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    borderRadius: userTokens.radii.md,
    paddingHorizontal: userTokens.spacing.md,
    height: userTokens.touchTarget.minHeight,
    fontSize: userTokens.typography.sm,
    color: userTokens.colors.textPrimary,
  },
  btnRow: {
    flexDirection: 'row',
    gap: userTokens.spacing.sm,
    marginTop: userTokens.spacing.md,
  },
  cancelBtn: {
    flex: 1,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textSecondary,
  },
  saveBtn: {
    flex: 2,
    height: userTokens.touchTarget.minHeight,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primary, // Blue #2563EB
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.surface,
  }
});
