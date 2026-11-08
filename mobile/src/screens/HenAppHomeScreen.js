import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import HenAppMascot from '../components/common/HenAppMascot';
import { useAdminData } from '../context/AdminDataContext';
import { formatCurrency } from '../utils/calculations';

/**
 * HenAppHomeScreen
 * Screen 6 from the user's specification image:
 * - Deep Forest Green (#2563EB) Top Bar with HenApp Mascot, Bell & Hamburger Menu
 * - Greeting: "Hello, User! Here's what's happening today."
 * - 3 Stat Cards in a row: Total Customers (12), Total Hens (48), Total Due (â‚¹ 8,250)
 * - Recent Customers with "View All": Ramesh Patel, Suresh Kumar, Priya Singh, etc.
 */
export default function HenAppHomeScreen({
  onSelectCustomer,
  onNavigateTab,
  onReplayOnboarding,
  onSwitchPortal,
}) {
  const { currentUser, customers, systemMetrics, rates } = useAdminData();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Pick top 3 recent customers or fallback to Ramesh Patel, Suresh Kumar, Priya Singh
  const recentList = customers.slice(0, 3);

  // Avatar background colors matching the screenshot
  const getAvatarColors = (index) => {
    if (index === 0) return { bg: '#FFE4E6', text: '#BE123C' }; // Coral pink for Ramesh (R)
    if (index === 1) return { bg: '#E0F2FE', text: '#0284C7' }; // Soft sky blue for Suresh (S)
    return { bg: '#FFEDD5', text: '#C2410C' }; // Soft peach/salmon for Priya (P)
  };

  const displayName = currentUser?.name?.split(' ')[0] || 'User';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Top Header Bar (#2563EB deep forest green from image) */}
      <View style={styles.topHeader}>
        <View style={styles.brandGroup}>
          <HenAppMascot size="small" />
          <Text style={styles.headerBrandTitle}>HenApp</Text>
        </View>

        <View style={styles.headerActions}>
          {/* Notification Bell with red unread indicator */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsNotificationOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.bellEmoji}>ðŸ””</Text>
            <View style={styles.notificationDot} />
          </TouchableOpacity>

          {/* Hamburger Menu â˜° */}
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => setIsMenuOpen(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.hamburgerIcon}>â˜°</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting Section */}
        <View style={styles.greetingSection}>
          <Text style={styles.greetingTitle}>Hello, {displayName}!</Text>
          <Text style={styles.greetingSubtitle}>Here's what's happening today.</Text>
        </View>

        {/* 3 Summary Stat Cards in a row (Total Customers, Total Hens, Total Due) */}
        <View style={styles.statCardsRow}>
          {/* Card 1: Total Customers */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => onNavigateTab && onNavigateTab('customers')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#E0F2FE' }]}>
              <Text style={styles.statEmoji}>ðŸ‘¥</Text>
            </View>
            <Text style={styles.statLabel}>Total Customers</Text>
            <Text style={styles.statNumber}>{systemMetrics.totalCustomers || 12}</Text>
          </TouchableOpacity>

          {/* Card 2: Total Hens */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => onNavigateTab && onNavigateTab('hens')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#DCFCE7' }]}>
              <Text style={styles.statEmoji}>ðŸ”</Text>
            </View>
            <Text style={styles.statLabel}>Total Hens</Text>
            <Text style={styles.statNumber}>{systemMetrics.totalHens || 48}</Text>
          </TouchableOpacity>

          {/* Card 3: Total Due */}
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => onNavigateTab && onNavigateTab('customers')}
            activeOpacity={0.8}
          >
            <View style={[styles.statIconCircle, { backgroundColor: '#D1FAE5' }]}>
              <Text style={[styles.statEmoji, { color: '#059669', fontWeight: 'bold' }]}>â‚¹</Text>
            </View>
            <Text style={styles.statLabel}>Total Due</Text>
            <Text style={styles.statNumber}>
              {formatCurrency(systemMetrics.totalPayable || 8250)}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Customers Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent Customers</Text>
          <TouchableOpacity
            onPress={() => onNavigateTab && onNavigateTab('customers')}
            activeOpacity={0.7}
          >
            <Text style={styles.viewAllLink}>View All</Text>
          </TouchableOpacity>
        </View>

        {/* Customer List Items */}
        <View style={styles.customerList}>
          {recentList.map((customer, index) => {
            const avatarColor = getAvatarColors(index);
            const initial = customer.name ? customer.name.charAt(0).toUpperCase() : 'C';
            const hensCount = customer.hens ? customer.hens.length : 0;
            const customerTotal = customer.hens
              ? customer.hens.reduce((acc, h) => acc + (h.weight * h.rateApplied), 0)
              : 0;

            return (
              <TouchableOpacity
                key={customer.id || index}
                style={styles.customerItemCard}
                onPress={() => onSelectCustomer && onSelectCustomer(customer.id)}
                activeOpacity={0.7}
              >
                {/* Left: Avatar Circle */}
                <View style={[styles.avatarCircle, { backgroundColor: avatarColor.bg }]}>
                  <Text style={[styles.avatarLetter, { color: avatarColor.text }]}>
                    {initial}
                  </Text>
                </View>

                {/* Center: Details */}
                <View style={styles.customerDetails}>
                  <Text style={styles.customerName}>{customer.name}</Text>
                  <Text style={styles.customerSub}>
                    {hensCount} Hens  â€¢  {formatCurrency(customerTotal)}
                  </Text>
                </View>

                {/* Right: Chevron */}
                <Text style={styles.chevronIcon}>â€º</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Quick Market Ribbon */}
        <View style={styles.rateNoteBox}>
          <Text style={styles.rateNoteTitle}>Today's Mandi Rates</Text>
          <View style={styles.rateNoteRow}>
            <Text style={styles.rateNoteItem}>Marga: <Text style={styles.rateBold}>â‚¹{rates?.MARGA || 260}/kg</Text></Text>
            <Text style={styles.rateNoteDivider}>â€¢</Text>
            <Text style={styles.rateNoteItem}>Margee: <Text style={styles.rateBold}>â‚¹{rates?.MARGEE || 240}/kg</Text></Text>
          </View>
        </View>
      </ScrollView>

      {/* Slide Drawer / Menu Modal */}
      <Modal
        visible={isMenuOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsMenuOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setIsMenuOpen(false)}
          />

          <View style={styles.drawerCard}>
            <View style={styles.drawerHeader}>
              <View style={styles.drawerHeaderBrand}>
                <HenAppMascot size="small" />
                <Text style={styles.drawerTitle}>HenApp Menu</Text>
              </View>
              <TouchableOpacity onPress={() => setIsMenuOpen(false)}>
                <Text style={styles.closeDrawer}>âœ•</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setIsMenuOpen(false);
                if (onReplayOnboarding) onReplayOnboarding();
              }}
            >
              <Text style={styles.drawerItemIcon}>âœ¨</Text>
              <View>
                <Text style={styles.drawerItemTitle}>Replay Splash & Onboarding</Text>
                <Text style={styles.drawerItemSub}>View the 5-step welcome flow</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setIsMenuOpen(false);
                if (onSwitchPortal) onSwitchPortal('user');
              }}
            >
              <Text style={styles.drawerItemIcon}>ðŸ”</Text>
              <View>
                <Text style={styles.drawerItemTitle}>User Operations Portal (v2.0)</Text>
                <Text style={styles.drawerItemSub}>Blue & Teal field staff console</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.drawerItem}
              onPress={() => {
                setIsMenuOpen(false);
                if (onSwitchPortal) onSwitchPortal('admin');
              }}
            >
              <Text style={styles.drawerItemIcon}>ðŸ›¡ï¸</Text>
              <View>
                <Text style={styles.drawerItemTitle}>Admin Management Console</Text>
                <Text style={styles.drawerItemSub}>Deep Green & Orange admin tools</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        visible={isNotificationOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsNotificationOpen(false)}
      >
        <View style={styles.modalBackdrop}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            onPress={() => setIsNotificationOpen(false)}
          />

          <View style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <Text style={styles.notificationTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setIsNotificationOpen(false)}>
                <Text style={styles.closeDrawer}>âœ•</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notifIcon}>ðŸ’°</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTextBold}>Pending Dues Reminder</Text>
                <Text style={styles.notifTextSub}>Ramesh Patel has â‚¹2,400 pending balance</Text>
              </View>
            </View>
            <View style={styles.notificationItem}>
              <Text style={styles.notifIcon}>ðŸ·ï¸</Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.notifTextBold}>Mandi Rate Updated</Text>
                <Text style={styles.notifTextSub}>Marga standard is set to â‚¹{rates?.MARGA}/kg</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2563EB',
  },
  topHeader: {
    height: 56,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  brandGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerBrandTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  headerIconBtn: {
    position: 'relative',
    padding: 6,
  },
  bellEmoji: {
    fontSize: 20,
  },
  notificationDot: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1.5,
    borderColor: '#2563EB',
  },
  hamburgerIcon: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },

  scrollView: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 28,
  },

  // Greeting
  greetingSection: {
    marginBottom: 20,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 4,
  },
  greetingSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },

  // 3 Stat Cards Row
  statCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 26,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  statIconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  statEmoji: {
    fontSize: 18,
  },
  statLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 4,
  },
  statNumber: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
  },

  // Section Header
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#0F172A',
  },
  viewAllLink: {
    fontSize: 13,
    fontWeight: '700',
    color: '#16A34A',
  },

  // Customer List
  customerList: {
    gap: 10,
    marginBottom: 24,
  },
  customerItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 14,
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1.5,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  avatarLetter: {
    fontSize: 18,
    fontWeight: '800',
  },
  customerDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 3,
  },
  customerSub: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
  },
  chevronIcon: {
    fontSize: 20,
    color: '#94A3B8',
    fontWeight: '600',
  },

  // Rate note
  rateNoteBox: {
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#DCFCE7',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  rateNoteTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#16A34A',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rateNoteRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  rateNoteItem: {
    fontSize: 12,
    color: '#334155',
  },
  rateBold: {
    fontWeight: '700',
    color: '#0F172A',
  },
  rateNoteDivider: {
    color: '#94A3B8',
  },

  // Drawer modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  drawerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  drawerHeaderBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  drawerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  closeDrawer: {
    fontSize: 18,
    color: '#64748B',
    padding: 4,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 14,
  },
  drawerItemIcon: {
    fontSize: 22,
  },
  drawerItemTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  drawerItemSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },

  // Notification card
  notificationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  notificationTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#0F172A',
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 10,
  },
  notifIcon: {
    fontSize: 20,
  },
  notifTextBold: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  notifTextSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
