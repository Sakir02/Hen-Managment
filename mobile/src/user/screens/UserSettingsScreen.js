import Icon2D from '../../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import UserConfirmationModal from '../components/common/UserConfirmationModal';

export default function UserSettingsScreen({ onBack, onLogout, onSwitchToAdmin }) {
  const { adminProfile, updateSettings } = useAdminData();

  const [notifications, setNotifications] = useState(adminProfile.notificationsEnabled ?? true);
  const [offlineSync, setOfflineSync] = useState(true);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleToggleNotif = (val) => {
    setNotifications(val);
    updateSettings({ notificationsEnabled: val });
  };

  return (
    <View style={styles.container}>
      {/* Top Nav Bar */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>← More Hub</Text>
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Operational Settings</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Portal Switcher Card */}
        {onSwitchToAdmin ? (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.adminSwitchRow}
              onPress={onSwitchToAdmin}
              activeOpacity={0.8}
            >
              <View style={styles.adminIconCircle}>
                <Icon2D name="shield" size={24} color="#2563EB" />
              </View>
              <View style={styles.adminTextCol}>
                <Text style={styles.adminTitle}>Switch to Admin Portal</Text>
                <Text style={styles.adminSub}>Access Mandi daily rates, staff accounts & audit logs</Text>
              </View>
              <Text style={styles.arrowIcon}>›</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* Field Notification Preferences (Spec Section 18) */}
        <Text style={styles.sectionHeader}>NOTIFICATIONS & SYNC</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>New Dues & Collection Alerts</Text>
              <Text style={styles.switchSub}>Alert when high balance exceeds credit limit</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={handleToggleNotif}
              trackColor={{ false: userTokens.colors.border, true: userTokens.colors.primaryLight }}
              thumbColor={notifications ? userTokens.colors.primary : '#94A3B8'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.switchRow}>
            <View style={styles.switchTextCol}>
              <Text style={styles.switchTitle}>Offline Weighing Synchronization</Text>
              <Text style={styles.switchSub}>Cache batch weighing entries locally during mandi network drops</Text>
            </View>
            <Switch
              value={offlineSync}
              onValueChange={setOfflineSync}
              trackColor={{ false: userTokens.colors.border, true: userTokens.colors.primaryLight }}
              thumbColor={offlineSync ? userTokens.colors.primary : '#94A3B8'}
            />
          </View>
        </View>

        {/* Field Units & Formatting (Spec Section 18) */}
        <Text style={styles.sectionHeader}>APPLICATION PREFERENCES</Text>
        <View style={styles.card}>
          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Billing Currency</Text>
            <View style={styles.configBadge}>
              <Text style={styles.configBadgeText}>Indian Rupee (₹)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Weighing Unit Standard</Text>
            <View style={styles.configBadge}>
              <Text style={styles.configBadgeText}>Kilograms (kg)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.configRow}>
            <Text style={styles.configLabel}>Theme Palette</Text>
            <View style={styles.configBadge}>
              <Text style={styles.configBadgeText}>User Blue & Teal (v2.0)</Text>
            </View>
          </View>
        </View>

        {/* About App (Spec Section 18) */}
        <Text style={styles.sectionHeader}>APPLICATION INFO</Text>
        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Version</Text>
            <Text style={styles.aboutVal}>2.0.0 (User Mobile Operations)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Visual Identity</Text>
            <Text style={styles.aboutVal}>Blue (#2563EB) & Teal (#0D9488)</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>Target OS</Text>
            <Text style={styles.aboutVal}>Android Mobile (Thumb-Friendly)</Text>
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

      {/* Logout Confirmation */}
      <UserConfirmationModal
        visible={isLogoutModalOpen}
        title="Sign Out"
        message="Are you sure you want to end your operational session?"
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
  sectionHeader: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    padding: userTokens.spacing.base,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    ...userTokens.shadows.card,
  },
  adminSwitchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminIconCircle: {
    width: 40,
    height: 40,
    borderRadius: userTokens.radii.md,
    backgroundColor: '#E8F5E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  adminIconEmoji: {
    fontSize: 20,
  },
  adminTextCol: {
    flex: 1,
  },
  adminTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: '#2E7D32',
  },
  adminSub: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 20,
    color: userTokens.colors.textMuted,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchTextCol: {
    flex: 1,
    marginRight: userTokens.spacing.md,
  },
  switchTitle: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: userTokens.colors.border,
    marginVertical: userTokens.spacing.md,
  },
  configRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  configLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textPrimary,
    fontWeight: userTokens.typography.semibold,
  },
  configBadge: {
    backgroundColor: userTokens.colors.background,
    paddingHorizontal: userTokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: userTokens.radii.sm,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
  },
  configBadgeText: {
    fontSize: 11,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  aboutLabel: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
  },
  aboutVal: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  logoutBtn: {
    height: userTokens.touchTarget.minHeight,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: userTokens.colors.errorLight,
    borderRadius: userTokens.radii.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: userTokens.spacing.sm,
  },
  logoutBtnText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.error,
  }
});
