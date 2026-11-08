import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function SettingsScreen({ onBack, onLogout }) {
  const { adminProfile, updateSettings, showToast } = useAdminData();

  const [notifications, setNotifications] = useState(adminProfile.notificationsEnabled ?? true);
  const [smsReceipts, setSmsReceipts] = useState(adminProfile.smsReceiptsEnabled ?? true);
  const [autoBackup, setAutoBackup] = useState(adminProfile.autoBackupEnabled ?? true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleToggleNotif = (val) => {
    setNotifications(val);
    updateSettings({ notificationsEnabled: val });
  };

  const handleToggleSms = (val) => {
    setSmsReceipts(val);
    updateSettings({ smsReceiptsEnabled: val });
  };

  const handleToggleBackup = (val) => {
    setAutoBackup(val);
    updateSettings({ autoBackupEnabled: val });
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Settings & Preferences</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Profile Section (Spec Section 19) */}
        <Text style={styles.sectionHeader}>ADMIN PROFILE & FARM FACILITY</Text>
        <View style={styles.card}>
          <View style={styles.profileRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>
                {adminProfile.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{adminProfile.name}</Text>
              <Text style={styles.profileRole}>{adminProfile.role}</Text>
              <Text style={styles.profileFarm}>{adminProfile.farmName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoVal}>{adminProfile.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoVal}>{adminProfile.phone}</Text>
          </View>
        </View>

        {/* Notification Preferences (Spec Section 19) */}
        <Text style={styles.sectionHeader}>NOTIFICATION ALERTS</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Payment Receipts & Dues Alerts</Text>
              <Text style={styles.switchSub}>Push alert when receivables are settled or overdue</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotif}
              trackColor={{ false: tokens.colors.border, true: tokens.colors.primaryLight }}
              thumbColor={notifications ? tokens.colors.primary : '#9CA3AF'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Customer WhatsApp/SMS Slips</Text>
              <Text style={styles.switchSub}>Simulate dispatching digital payment slips to buyers</Text>
            </View>
            <Switch
              value={smsReceipts}
              onValueChange={handleToggleSms}
              trackColor={{ false: tokens.colors.border, true: tokens.colors.primaryLight }}
              thumbColor={smsReceipts ? tokens.colors.primary : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Operational Preferences (Spec Section 19) */}
        <Text style={styles.sectionHeader}>APPLICATION CONFIGURATION</Text>
        <View style={styles.card}>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Default Currency</Text>
            <View style={styles.configBadge}>
              <Text style={styles.configBadgeText}>Indian Rupee (₹)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Standard Unit of Measure</Text>
            <View style={styles.configBadge}>
              <Text style={styles.configBadgeText}>Kilograms (kg)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Daily Data Synchronization</Text>
              <Text style={styles.switchSub}>Periodic local state snapshotting</Text>
            </View>
            <Switch
              value={autoBackup}
              onValueChange={handleToggleBackup}
              trackColor={{ false: tokens.colors.border, true: tokens.colors.primaryLight }}
              thumbColor={autoBackup ? tokens.colors.primary : '#9CA3AF'}
            />
          </View>
        </View>

        {/* Security / Password (Spec Section 19) */}
        <Text style={styles.sectionHeader}>SECURITY & ACCESS</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.securityBtn}
            onPress={() => showToast('Password change link sent to your registered email.', 'info')}
            activeOpacity={0.7}
          >
            <View>
              <Text style={styles.securityTitle}>Change Admin Password</Text>
              <Text style={styles.securitySub}>Last changed 45 days ago</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>

        {/* About Application (Spec Section 19) */}
        <Text style={styles.sectionHeader}>ABOUT APPLICATION</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutVal}>1.0.0 (Admin Mobile UI)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Platform Architecture</Text>
            <Text style={styles.aboutVal}>React Native • Expo 57</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Design Specification</Text>
            <Text style={styles.aboutVal}>v1.0 (Deep Green / Warm Orange)</Text>
          </View>
        </View>

        {/* Destructive Logout Button */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setIsLogoutModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.logoutBtnText}>Sign Out from Device</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Confirmation Modal for Logout */}
      <ConfirmationModal
        visible={isLogoutModalOpen}
        title="Sign Out"
        message="Are you sure you want to end your administrative session?"
        confirmLabel="Yes, Sign Out"
        cancelLabel="Stay Logged In"
        isDestructive={true}
        onConfirm={() => {
          setIsLogoutModalOpen(false);
          onLogout();
        }}
        onCancel={() => setIsLogoutModalOpen(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  },
  navBar: {
    height: 52,
    backgroundColor: tokens.colors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: tokens.colors.border,
  },
  backBtn: {
    paddingVertical: 6,
    paddingRight: tokens.spacing.md,
  },
  backBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  screenTitle: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.base,
    paddingBottom: 40,
    gap: tokens.spacing.md,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.base,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: tokens.radii.full,
    backgroundColor: tokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: tokens.colors.primary,
  },
  avatarText: {
    fontSize: tokens.typography.lg,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  profileInfo: {
    marginLeft: tokens.spacing.md,
    flex: 1,
  },
  profileName: {
    fontSize: tokens.typography.base,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  profileRole: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.semibold,
  },
  profileFarm: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginVertical: tokens.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
  },
  infoVal: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextCol: {
    flex: 1,
    marginRight: tokens.spacing.md,
  },
  switchTitle: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textPrimary,
    fontWeight: tokens.typography.semibold,
  },
  configBadge: {
    backgroundColor: tokens.colors.background,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radii.sm,
    borderWidth: 1,
    borderColor: tokens.colors.border,
  },
  configBadgeText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  securityBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  securityTitle: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  securitySub: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: tokens.colors.textMuted,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: tokens.typography.xs,
    color: tokens.colors.textSecondary,
  },
  aboutVal: {
    fontSize: tokens.typography.xs,
    fontWeight: tokens.typography.semibold,
    color: tokens.colors.textPrimary,
  },
  logoutBtn: {
    height: tokens.touchTarget.minHeight,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: tokens.colors.errorLight,
    borderRadius: tokens.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: tokens.spacing.sm,
  },
  logoutBtnText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.error,
  }
});
