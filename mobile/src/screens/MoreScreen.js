import Icon2D from '../components/common/Icon2D';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { tokens } from '../styles/tokens';
import { useAdminData } from '../context/AdminDataContext';
import ConfirmationModal from '../components/common/ConfirmationModal';

export default function MoreScreen({ onNavigateSubScreen, onLogout, onSwitchToUser, onReplayOnboarding }) {
  const { currentUser, systemMetrics, rates } = useAdminData();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menuSections = [
    {
      title: 'INVENTORY & FINANCIAL LEDGERS',
      items: [
        {
          id: 'hens',
          title: 'All Hens Stock',
          subtitle: `${systemMetrics.totalHens} birds recorded (${systemMetrics.totalWeight} kg)`,
          icon: 'bird',
          badge: `${systemMetrics.totalHens} birds`,
        },
        {
          id: 'payments',
          title: 'Master Payments Ledger',
          subtitle: `${systemMetrics.allPayments.length} transactions across all accounts`,
          icon: 'payments',
          badge: null,
        },
        {
          id: 'rates',
          title: 'Daily Mandi Rates',
          subtitle: `Marga: ₹${rates.MARGA}/kg • Margee: ₹${rates.MARGEE}/kg`,
          icon: 'tag',
          badge: 'Live',
        }
      ]
    },
    {
      title: 'ACCESS CONTROL & AUDIT',
      items: [
        {
          id: 'roles',
          title: 'Roles & Permissions',
          subtitle: 'Granular field permissions and role matrix',
          icon: 'shield',
          badge: null,
        },
        {
          id: 'audit',
          title: 'Audit Logs & Change Diffs',
          subtitle: 'Immutable record of staff actions and rates changes',
          icon: 'document',
          badge: null,
        },
        {
          id: 'chat',
          title: 'Private User Chats',
          subtitle: 'Direct bilateral messaging with field operators',
          icon: 'chat',
          badge: 'Live',
        }
      ]
    },
    {
      title: 'PREFERENCES & SYSTEM',
      items: [
        {
          id: 'settings',
          title: 'App Settings & Preferences',
          subtitle: 'Notifications, currency format, units and security',
          icon: 'settings',
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
        {/* Admin Profile Mini Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => onNavigateSubScreen('settings')}
          activeOpacity={0.8}
        >
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>
              {currentUser?.name ? currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2) : 'SK'}
            </Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{currentUser?.name || 'Sakir Khan'}</Text>
            <Text style={styles.profileRole}>{currentUser?.role || 'Super Admin'}</Text>
            <Text style={styles.profileContact}>{currentUser?.phone || '+91 98765 43210'}</Text>
          </View>
          <Text style={styles.arrowIcon}>›</Text>
        </TouchableOpacity>

        {/* Portal Switch Card */}
        {onSwitchToUser ? (
          <TouchableOpacity
            style={styles.portalCard}
            onPress={onSwitchToUser}
            activeOpacity={0.8}
          >
            <View style={styles.portalLeft}>
              <View style={styles.portalIconBox}>
                <Icon2D name="bird" size={24} color="#2563EB" />
              </View>
              <View>
                <Text style={styles.portalTitle}>Switch to User Operations Portal</Text>
                <Text style={styles.portalSub}>v2.0 Interface • Blue & Teal Theme</Text>
              </View>
            </View>
            <Text style={styles.portalArrow}>›</Text>
          </TouchableOpacity>
        ) : null}

        {/* Watch Intro / Onboarding Card */}
        {onReplayOnboarding ? (
          <TouchableOpacity
            style={[styles.portalCard, { backgroundColor: '#F0FDF4', borderColor: '#BBF7D0', marginTop: tokens.spacing.sm }]}
            onPress={onReplayOnboarding}
            activeOpacity={0.8}
          >
            <View style={styles.portalLeft}>
              <View style={[styles.portalIconBox, { backgroundColor: '#DCFCE7' }]}>
                <Icon2D name="sparkles" size={24} color="#0D9488" />
              </View>
              <View>
                <Text style={[styles.portalTitle, { color: '#15803D' }]}>Watch HenApp Launch & Intro</Text>
                <Text style={[styles.portalSub, { color: '#16A34A' }]}>5-Step Splash, Loading & Welcome Flow</Text>
              </View>
            </View>
            <Text style={[styles.portalArrow, { color: '#15803D' }]}>›</Text>
          </TouchableOpacity>
        ) : null}

        {/* Menu Sections (Spec Section 18) */}
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
                      <Icon2D name={item.icon} size={20} color="#2563EB" />
                    </View>

                    <View style={styles.itemTextBox}>
                      <Text style={styles.itemTitle}>{item.title}</Text>
                      <Text style={styles.itemSub} numberOfLines={1}>{item.subtitle}</Text>
                    </View>

                    {item.badge ? (
                      <View style={styles.itemBadge}>
                        <Text style={styles.itemBadgeText}>{item.badge}</Text>
                      </View>
                    ) : null}

                    <Text style={styles.itemArrow}>›</Text>
                  </TouchableOpacity>

                  {itemIdx < sec.items.length - 1 && <View style={styles.itemDivider} />}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button (Spec Section 18) */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={() => setIsLogoutModalOpen(true)}
          activeOpacity={0.8}
        >
          <Icon2D name="logout" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Sign Out of Admin Portal</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Hen Management Admin Mobile • v1.0.0 (Production Mock)
        </Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: tokens.spacing.base,
    paddingBottom: 80,
    gap: tokens.spacing.base,
  },
  profileCard: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.xl,
    padding: tokens.spacing.base,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: tokens.colors.border,
    ...tokens.shadows.card,
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
    fontSize: tokens.typography.md,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
  profileInfo: {
    flex: 1,
    marginLeft: tokens.spacing.md,
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
    marginTop: 1,
  },
  profileContact: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  arrowIcon: {
    fontSize: 22,
    color: tokens.colors.textMuted,
    paddingRight: 4,
  },
  sectionBox: {
    gap: tokens.spacing.xs,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textSecondary,
    letterSpacing: 0.5,
    paddingHorizontal: 4,
  },
  cardGroup: {
    backgroundColor: tokens.colors.surface,
    borderRadius: tokens.radii.lg,
    borderWidth: 1,
    borderColor: tokens.colors.border,
    overflow: 'hidden',
    ...tokens.shadows.card,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: tokens.spacing.base,
    minHeight: tokens.touchTarget.minHeight + 6,
  },
  itemIconBox: {
    width: 36,
    height: 36,
    borderRadius: tokens.radii.md,
    backgroundColor: tokens.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: tokens.spacing.md,
  },
  itemIcon: {
    fontSize: 18,
  },
  itemTextBox: {
    flex: 1,
  },
  itemTitle: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.textPrimary,
  },
  itemSub: {
    fontSize: 11,
    color: tokens.colors.textSecondary,
    marginTop: 2,
  },
  itemBadge: {
    backgroundColor: tokens.colors.primaryLight,
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 3,
    borderRadius: tokens.radii.pill,
    marginRight: tokens.spacing.xs,
  },
  itemBadgeText: {
    fontSize: 10,
    color: tokens.colors.primary,
    fontWeight: tokens.typography.bold,
  },
  itemArrow: {
    fontSize: 20,
    color: tokens.colors.textMuted,
    marginLeft: 4,
  },
  itemDivider: {
    height: 1,
    backgroundColor: tokens.colors.border,
    marginLeft: 60,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: tokens.touchTarget.minHeight,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: tokens.colors.errorLight,
    borderRadius: tokens.radii.lg,
    gap: tokens.spacing.sm,
    marginTop: tokens.spacing.sm,
  },
  logoutIcon: {
    fontSize: 16,
  },
  logoutText: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 11,
    color: tokens.colors.textMuted,
    marginTop: tokens.spacing.sm,
  },
  portalCard: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    borderRadius: tokens.radii.lg,
    padding: tokens.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...tokens.shadows.card,
  },
  portalLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: tokens.spacing.md,
    flex: 1,
  },
  portalIconBox: {
    width: 40,
    height: 40,
    borderRadius: tokens.radii.md,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  portalEmoji: {
    fontSize: 20,
  },
  portalTitle: {
    fontSize: tokens.typography.sm,
    fontWeight: tokens.typography.bold,
    color: '#1E40AF',
  },
  portalSub: {
    fontSize: tokens.typography.xs,
    color: '#3B82F6',
    marginTop: 2,
  },
  portalArrow: {
    fontSize: 22,
    color: '#2563EB',
    fontWeight: 'bold',
  },
});
