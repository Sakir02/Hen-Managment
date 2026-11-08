import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { userTokens } from './styles/userTokens';
import { useAdminData } from '../context/AdminDataContext';

// User Common Components
import UserAppBar from './components/common/UserAppBar';
import UserBottomNav from './components/common/UserBottomNav';
import UserCustomerModal from './components/customer/UserCustomerModal';
import UserBatchAddHenModal from './components/hen/UserBatchAddHenModal';

// User Screens
import UserDashboardScreen from './screens/UserDashboardScreen';
import UserCustomersScreen from './screens/UserCustomersScreen';
import UserCustomerDetailsScreen from './screens/UserCustomerDetailsScreen';
import UserHensScreen from './screens/UserHensScreen';
import UserPaymentsScreen from './screens/UserPaymentsScreen';
import UserMoreScreen from './screens/UserMoreScreen';
import UserProfileScreen from './screens/UserProfileScreen';
import UserSettingsScreen from './screens/UserSettingsScreen';
import UserHelpScreen from './screens/UserHelpScreen';

export default function UserAppShell({ onSwitchToAdmin, onReplayOnboarding }) {
  const {
    currentUser,
    logout,
    rates,
    addCustomer,
    addHenToCustomer,
    addHensBatchToCustomer,
    customers,
    systemMetrics,
    showToast
  } = useAdminData();

  // Navigation State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'customers' | 'hens' | 'more'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [moreSubScreen, setMoreSubScreen] = useState(null); // null | 'payments' | 'profile' | 'settings' | 'help'

  // Global Quick Modals
  const [isQuickCustomerOpen, setIsQuickCustomerOpen] = useState(false);
  const [isQuickAddHenOpen, setIsQuickAddHenOpen] = useState(false);

  // Tab Switcher
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    if (tabKey !== 'customers') {
      setSelectedCustomerId(null);
    }
    if (tabKey !== 'more') {
      setMoreSubScreen(null);
    }
  };

  const handleSelectCustomer = (customerId) => {
    setActiveTab('customers');
    setSelectedCustomerId(customerId);
    setMoreSubScreen(null);
  };

  // Header Props based on current screen
  const getHeaderProps = () => {
    if (selectedCustomerId) {
      return {
        title: 'Customer Ledger',
        subtitle: 'Batch Intake & Payments',
        showBack: true,
        onBack: () => setSelectedCustomerId(null),
      };
    }

    if (activeTab === 'more' && moreSubScreen) {
      return {
        title: 'Hen Management',
        subtitle: 'Staff Operations',
        showBack: true,
        onBack: () => setMoreSubScreen(null),
      };
    }

    switch (activeTab) {
      case 'home':
        return { title: 'JV • Hen Management', subtitle: 'Operations Dashboard' };
      case 'customers':
        return { title: 'Customer Hub', subtitle: 'Live Buyer & Farm Ledgers' };
      case 'hens':
        return { title: 'Birds Inventory', subtitle: 'Total Stock & Batch Intake' };
      case 'more':
        return { title: 'Staff Menu', subtitle: 'Receipts, Profile & Guide' };
      default:
        return { title: 'Hen Management', subtitle: 'Staff Portal' };
    }
  };

  const headerProps = getHeaderProps();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={userTokens.colors.primary} />

      {/* Top Application Bar (Spec Section 6 & 8) */}
      <UserAppBar
        title={headerProps.title}
        subtitle={headerProps.subtitle}
        showBack={headerProps.showBack}
        onBack={headerProps.onBack}
        userAvatar={
          currentUser?.name
            ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
            : 'VS'
        }
        unreadNotifications={systemMetrics.dueCustomersCount}
        onNotificationPress={() => {
          setActiveTab('customers');
          showToast(`${systemMetrics.dueCustomersCount} buyers have outstanding balances.`, 'warning');
        }}
        onProfilePress={() => {
          setActiveTab('more');
          setMoreSubScreen('profile');
        }}
        onTogglePortal={onSwitchToAdmin}
      />

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {activeTab === 'home' && (
          <UserDashboardScreen
            onNavigateTab={(tab, sub) => {
              setActiveTab(tab);
              if (sub) setMoreSubScreen(sub);
            }}
            onOpenAddCustomer={() => setIsQuickCustomerOpen(true)}
            onOpenAddHen={() => setIsQuickAddHenOpen(true)}
            onSelectCustomer={handleSelectCustomer}
          />
        )}

        {activeTab === 'customers' && (
          selectedCustomerId ? (
            <UserCustomerDetailsScreen
              customerId={selectedCustomerId}
              onBack={() => setSelectedCustomerId(null)}
            />
          ) : (
            <UserCustomersScreen onSelectCustomer={handleSelectCustomer} />
          )
        )}

        {activeTab === 'hens' && (
          <UserHensScreen onSelectCustomer={handleSelectCustomer} />
        )}

        {activeTab === 'more' && (
          moreSubScreen === 'payments' ? (
            <UserPaymentsScreen
              onBack={() => setMoreSubScreen(null)}
              onSelectCustomer={handleSelectCustomer}
            />
          ) : moreSubScreen === 'profile' ? (
            <UserProfileScreen onBack={() => setMoreSubScreen(null)} />
          ) : moreSubScreen === 'settings' ? (
            <UserSettingsScreen
              onBack={() => setMoreSubScreen(null)}
              onLogout={logout}
              onSwitchToAdmin={onSwitchToAdmin}
            />
          ) : moreSubScreen === 'help' ? (
            <UserHelpScreen onBack={() => setMoreSubScreen(null)} />
          ) : (
            <UserMoreScreen
              onNavigateSubScreen={(sub) => setMoreSubScreen(sub)}
              onLogout={logout}
              onSwitchToAdmin={onSwitchToAdmin}
              onReplayOnboarding={onReplayOnboarding}
            />
          )
        )}
      </View>

      {/* Bottom Navigation Bar (Spec Section 5) */}
      {!selectedCustomerId && (
        <UserBottomNav
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          dueCount={systemMetrics.dueCustomersCount}
        />
      )}

      {/* Fast Action Modal: Add Customer */}
      <UserCustomerModal
        visible={isQuickCustomerOpen}
        onClose={() => setIsQuickCustomerOpen(false)}
        onSaveCustomer={(customerData) => {
          const created = addCustomer(customerData);
          if (created && created.id) {
            handleSelectCustomer(created.id);
          }
        }}
      />

      {/* Fast Action Modal: Batch Add Hens */}
      <UserBatchAddHenModal
        visible={isQuickAddHenOpen}
        customerName={customers[0]?.name || 'Active Buyer'}
        rates={rates}
        onClose={() => setIsQuickAddHenOpen(false)}
        onSaveBatch={(batchHens) => {
          if (customers.length > 0) {
            addHensBatchToCustomer(customers[0].id, batchHens);
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: userTokens.colors.primary,
  },
  contentArea: {
    flex: 1,
    backgroundColor: userTokens.colors.background,
  }
});
