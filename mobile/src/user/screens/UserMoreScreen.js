import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { userTokens } from '../styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import UserConfirmationModal from '../components/common/UserConfirmationModal';
import Icon2D from '../../components/common/Icon2D';

export default function UserMoreScreen({
  onNavigateSubScreen,
  onLogout,
  onSwitchToAdmin,
  onReplayOnboarding,
}) {
  const { currentUser, systemMetrics } = useAdminData();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const paymentsCount = systemMetrics?.allPayments?.length || 0;

  const menuSections = [
    {
      title: 'FINANCIAL RECEIPTS & BILLING',
      items: [
        {
          id: 'payments',
          title: 'Master Payments Ledger',
          subtitle: `${paymentsCount} receipts collected across all customers`,
          icon: 'payments',
          badge: null,
        }
      ]
    },
    {
      title: 'OPERATOR SETTINGS & PREFERENCES',
      items: [
        {
          id: 'profile',
          title: 'Staff Profile & Passcode',
          subtitle: `${currentUser?.name || 'Operator'} (${currentUser?.role || 'Staff'})`,
          icon: 'profile',
          badge: null,
        },
        {
          id: 'settings',
          title: 'Application Preferences',
          subtitle: 'Alerts, offline weighing sync, and units',
          icon: 'settings',
          badge: null,
        },
        {
          id: 'chat',
          title: 'Private Chat with Admin',
          subtitle: 'Direct bilateral messaging with supervisor',
          icon: 'chat',
          badge: 'Live',
        },
        {
          id: 'help',
          title: 'Weighing Guide & Support',
          subtitle: 'Digital scale calibration and supervisor hotline',
          icon: 'help',
          badge: null,
        }
      ]
    }
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Operator Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => onNavigateSubScreen('profile')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'VS'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.name || 'Vikram Singh'}</Text>
            <Text style={styles.profileRole}>{currentUser?.role || 'Field Operator'}</Text>
            <Text style={styles.profileContact}>{currentUser?.phone || '+91 97123 45672'}</Text>
          </View>
          <Icon2D name="more" size={18} color={userTokens.colors.textSecondary} />
        </TouchableOpacity>

        {/* Portal Switcher Card */}
        {onSwitchToAdmin ? (
          <TouchableOpacity
            style={styles.portalCard}
            onPress={onSwitchToAdmin}
            activeOpacity={0.8}
          >
            <View style={styles.portalLeft}>
              <View style={styles.portalIconBox}>
                <Icon2D name="shield" size={20} color={userTokens.colors.primary} />
              </View>
              <View>
                <Text style={styles.portalTitle}>Switch to Admin Portal</Text>
                <Text style={styles.portalSub}>Manage daily rates, staff roles, and audit trail</Text>
              </View>
            </View>
            <Icon2D name="more" size={18} color={userTokens.colors.primary} />
          </TouchableOpacity>
        ) : null}

        {/* Watch Intro / Onboarding Card */}
        {onReplayOnboarding ? (
          <TouchableOpacity
            style={[styles.portalCard, { borderColor: '#93C5FD', backgroundColor: '#EFF6FF', marginTop: userTokens.spacing.sm }]}
            onPress={onReplayOnboarding}
            activeOpacity={0.8}
          >
            <View style={styles.portalLeft}>
              <View style={[styles.portalIconBox, { backgroundColor: '#DBEAFE' }]}>
                <Icon2D name="play" size={18} color="#1D4ED8" />
              </View>
              <View>
                <Text style={[styles.portalTitle, { color: '#1D4ED8' }]}>Watch HenApp Launch & Intro</Text>
                <Text style={[styles.portalSub, { color: '#2563EB' }]}>5-Step Splash, Loading & Welcome Flow</Text>
              </View>
            </View>
            <Icon2D name="more" size={18} color="#1D4ED8" />
          </TouchableOpacity>
        ) : null}

        {/* Menu Sections */}
        {menuSections.map((sec, idx) => (
          <View key={idx} style={styles.sectionBox}>
            <Text style={styles.sectionHeader}>{sec.title}</Text>
            <View style={styles.cardGroup}>
              {sec.items.map((item, itemIdx) => (
                <React.Fragment key={item.id}>
                  <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => onNavigateSubScreen(item.id)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.itemIconBox}>
                      <Icon2D name={item.icon} size={18} color={userTokens.colors.primary} />
                    </View>

                    <View style={styles.itemTextBox}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSub} numberOfLines={1}>{item.subtitle}</Text>
                    </View>

                    <Icon2D name="more" size={16} color={userTokens.colors.textSecondary} />
                  </TouchableOpacity>

                  {itemIdx < sec.items.length - 1 && <View style={styles.itemDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Action */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setIsLogoutModalOpen(true)}
          activeOpacity={0.8}
        >
          <Icon2D name="logout" size={18} color={userTokens.colors.error} />
          <Text style={styles.logoutText}>Sign Out from Operations Portal</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Hen Management User Mobile • v2.0.0 (Blue & Teal Edition)
        </Text>
      </ScrollView>

      {/* Logout Confirmation */}
      <UserConfirmationModal
        visible={isLogoutModalOpen}
        title="Sign Out"
        message="Are you sure you want to end your field operational session?"
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: userTokens.spacing.base,
    paddingBottom: userTokens.spacing.xxl * 2,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginBottom: userTokens.spacing.sm,
    ...userTokens.shadows.card,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: userTokens.radii.full,
    backgroundColor: userTokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  avatarText: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.primary,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: userTokens.typography.base,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  profileRole: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  profileContact: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  portalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: userTokens.colors.surface,
    padding: userTokens.spacing.base,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginBottom: userTokens.spacing.base,
    ...userTokens.shadows.card,
  },
  portalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  portalIconBox: {
    width: 36,
    height: 36,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  portalTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textPrimary,
  },
  portalSub: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  sectionBox: {
    marginBottom: userTokens.spacing.lg,
  },
  sectionHeader: {
    fontSize: userTokens.typography.xs,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.textSecondary,
    marginBottom: userTokens.spacing.sm,
    marginLeft: userTokens.spacing.xs,
  },
  cardGroup: {
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    overflow: 'hidden',
    ...userTokens.shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: userTokens.spacing.base,
  },
  itemIconBox: {
    width: 34,
    height: 34,
    borderRadius: userTokens.radii.md,
    backgroundColor: userTokens.colors.background,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: userTokens.spacing.md,
  },
  itemTextBox: {
    flex: 1,
  },
  itemTitle: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.semibold,
    color: userTokens.colors.textPrimary,
  },
  itemSub: {
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: 2,
  },
  itemDivider: {
    height: 1,
    backgroundColor: userTokens.colors.border,
    marginLeft: 54,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: userTokens.spacing.md,
    backgroundColor: userTokens.colors.surface,
    borderRadius: userTokens.radii.lg,
    borderWidth: 1,
    borderColor: userTokens.colors.border,
    marginTop: userTokens.spacing.md,
    gap: userTokens.spacing.sm,
  },
  logoutText: {
    fontSize: userTokens.typography.sm,
    fontWeight: userTokens.typography.bold,
    color: userTokens.colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: userTokens.typography.xs,
    color: userTokens.colors.textSecondary,
    marginTop: userTokens.spacing.lg,
  }
});
