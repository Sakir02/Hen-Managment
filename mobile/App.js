import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { tokens } from './src/styles/tokens';
import { AdminDataProvider, useAdminData } from './src/context/AdminDataContext';

// Common Components
import MobileAppBar from './src/components/common/MobileAppBar';
import BottomNav from './src/components/common/BottomNav';
import ToastSnackbar from './src/components/common/ToastSnackbar';

// Primary Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import UsersScreen from './src/screens/UsersScreen';
import CustomersScreen from './src/screens/CustomersScreen';
import CustomerDetailsScreen from './src/screens/CustomerDetailsScreen';
import MoreScreen from './src/screens/MoreScreen';

// Secondary Sub-Screens under More
import GlobalHensScreen from './src/screens/GlobalHensScreen';
import GlobalPaymentsScreen from './src/screens/GlobalPaymentsScreen';
import RatesScreen from './src/screens/RatesScreen';
import RolesPermissionsScreen from './src/screens/RolesPermissionsScreen';
import AuditLogsScreen from './src/screens/AuditLogsScreen';
import SettingsScreen from './src/screens/SettingsScreen';

// Fast Action Modals
import RateSettingModal from './src/components/RateSettingModal';
import AddCustomerModal from './src/components/AddCustomerModal';

// User Portal (Specification v2.0 - Blue & Teal Aesthetic)
import UserAppShell from './src/user/UserAppShell';
import UserLoginScreen from './src/user/screens/UserLoginScreen';

// HenApp Mockup Flow & Home (Screens 1 to 6 from Specification Image)
import HenAppSplashFlow from './src/components/onboarding/HenAppSplashFlow';
import HenAppHomeScreen from './src/screens/HenAppHomeScreen';

function MainAppShell() {
  const {
    currentUser,
    logout,
    rates,
    updateStandardRates,
    addCustomer,
    systemMetrics,
    toast,
    hideToast,
    showToast
  } = useAdminData();

  // Onboarding Splash Flow: only show on first ever launch
  const [showSplashOnboarding, setShowSplashOnboarding] = useState(false);
  const [splashChecked, setSplashChecked] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem('has_seen_splash').then((value) => {
      if (!value) {
        setShowSplashOnboarding(true);
      }
      setSplashChecked(true);
    });
  }, []);

  const handleReplayOnboarding = async () => {
    await AsyncStorage.removeItem('has_seen_splash');
    setShowSplashOnboarding(true);
  };

  const handleSplashFinish = async () => {
    await AsyncStorage.setItem('has_seen_splash', 'true');
    setShowSplashOnboarding(false);
  };

  // Portal State: 'user' (JV Blue & Teal Operations) | 'admin' (Console)
  const [portalMode, setPortalMode] = useState('user');

  // Navigation State
  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'customers' | 'hens' | 'more'
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [moreSubScreen, setMoreSubScreen] = useState(null); // null | 'hens' | 'payments' | 'rates' | 'roles' | 'audit' | 'settings'

  // Global Fast Modals
  const [isQuickRateModalOpen, setIsQuickRateModalOpen] = useState(false);
  const [isQuickCustomerModalOpen, setIsQuickCustomerModalOpen] = useState(false);

  // Wait until AsyncStorage check is done to avoid flash
  if (!splashChecked) return null;

  // 1. Initial Splash & Welcome Onboarding Flow (first launch only)
  if (showSplashOnboarding) {
    return <HenAppSplashFlow onFinish={handleSplashFinish} />;
  }

  // 2. If user is not authenticated, render LoginScreen for appropriate portal
  if (!currentUser) {
    if (portalMode === 'admin') {
      return (
        <>
          <LoginScreen onSwitchToUser={() => setPortalMode('user')} />
          <ToastSnackbar
            visible={toast.visible}
            message={toast.message}
            type={toast.type}
            onDismiss={hideToast}
          />
        </>
      );
    }

    return (
      <>
        <UserLoginScreen onSwitchToAdmin={() => setPortalMode('admin')} />
        <ToastSnackbar
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      </>
    );
  }

  // 3. If Authenticated in User Portal (v2.0 Blue & Teal), render UserAppShell
  if (portalMode === 'user') {
    return (
      <>
        <UserAppShell
          onSwitchToAdmin={() => setPortalMode('admin')}
          onReplayOnboarding={handleReplayOnboarding}
        />
        <ToastSnackbar
          visible={toast.visible}
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      </>
    );
  }

  // Handle Tab Switch
  const handleTabSelect = (tabKey) => {
    setActiveTab(tabKey);
    // Reset deep sub-screens when switching bottom tabs
    if (tabKey !== 'customers') {
      setSelectedCustomerId(null);
    }
    if (tabKey !== 'more') {
      setMoreSubScreen(null);
    }
  };

  // Handle selecting a customer from Dashboard or Global Hens/Payments
  const handleSelectCustomer = (customerId) => {
    setActiveTab('customers');
    setSelectedCustomerId(customerId);
    setMoreSubScreen(null);
  };

  // App Bar Titles
  const getHeaderProps = () => {
    if (selectedCustomerId) {
      return {
        title: 'Customer Ledger',
        subtitle: 'Batch Hens & Payments',
        showBack: true,
        onBack: () => setSelectedCustomerId(null),
      };
    }

    if (activeTab === 'more' && moreSubScreen) {
      return {
        title: 'Hen Management',
        subtitle: 'Admin Console',
        showBack: true,
        onBack: () => setMoreSubScreen(null),
      };
    }

    switch (activeTab) {
      case 'home':
        return { title: 'HenApp', subtitle: 'Operations Dashboard' };
      case 'customers':
        return { title: 'Customer Hub', subtitle: 'Active Farms & Ledger Accounts' };
      case 'hens':
        return { title: 'Hens Inventory', subtitle: 'Live Bird Stock & Intake' };
      case 'more':
        return { title: 'HenApp Menu', subtitle: 'Secondary Tools & System Settings' };
      default:
        return { title: 'HenApp', subtitle: 'Mobile Portal' };
    }
  };

  const headerProps = getHeaderProps();
  const isHenAppHome = portalMode === 'henapp' && activeTab === 'home' && !selectedCustomerId;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Top Application Bar (Shown when not on standalone HenApp Home) */}
      {!isHenAppHome && (
        <MobileAppBar
          title={headerProps.title}
          subtitle={headerProps.subtitle}
          showBack={headerProps.showBack}
          onBack={headerProps.onBack}
          userAvatar={
            currentUser?.name
              ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
              : 'SK'
          }
          unreadNotifications={systemMetrics.dueCustomersCount}
          onNotificationPress={() => {
            setActiveTab('customers');
            showToast(`${systemMetrics.dueCustomersCount} accounts currently have pending dues.`, 'warning');
          }}
          onProfilePress={() => {
            setActiveTab('more');
            setMoreSubScreen('settings');
          }}
        />
      )}

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {activeTab === 'home' && (
          portalMode === 'henapp' ? (
            <HenAppHomeScreen
              onSelectCustomer={handleSelectCustomer}
              onNavigateTab={handleTabSelect}
              onReplayOnboarding={handleReplayOnboarding}
              onSwitchPortal={(mode) => setPortalMode(mode)}
            />
          ) : (
            <DashboardScreen
              onNavigateTab={(tab, sub) => {
                setActiveTab(tab);
                if (sub) setMoreSubScreen(sub);
              }}
              onOpenRateModal={() => setIsQuickRateModalOpen(true)}
              onOpenAddCustomer={() => setIsQuickCustomerModalOpen(true)}
              onSelectCustomer={handleSelectCustomer}
            />
          )
        )}

        {activeTab === 'customers' && (
          selectedCustomerId ? (
            <CustomerDetailsScreen
              customerId={selectedCustomerId}
              onBack={() => setSelectedCustomerId(null)}
            />
          ) : (
            <CustomersScreen onSelectCustomer={(id) => setSelectedCustomerId(id)} />
          )
        )}

        {activeTab === 'hens' && (
          <GlobalHensScreen
            onBack={() => setActiveTab('home')}
            onSelectCustomer={handleSelectCustomer}
          />
        )}

        {activeTab === 'users' && <UsersScreen />}

        {activeTab === 'more' && (
          moreSubScreen === 'hens' ? (
            <GlobalHensScreen
              onBack={() => setMoreSubScreen(null)}
              onSelectCustomer={handleSelectCustomer}
            />
          ) : moreSubScreen === 'payments' ? (
            <GlobalPaymentsScreen
              onBack={() => setMoreSubScreen(null)}
              onSelectCustomer={handleSelectCustomer}
            />
          ) : moreSubScreen === 'rates' ? (
            <RatesScreen onBack={() => setMoreSubScreen(null)} />
          ) : moreSubScreen === 'roles' ? (
            <RolesPermissionsScreen onBack={() => setMoreSubScreen(null)} />
          ) : moreSubScreen === 'audit' ? (
            <AuditLogsScreen onBack={() => setMoreSubScreen(null)} />
          ) : moreSubScreen === 'settings' ? (
            <SettingsScreen onBack={() => setMoreSubScreen(null)} onLogout={logout} />
          ) : (
            <MoreScreen
              onNavigateSubScreen={(sub) => setMoreSubScreen(sub)}
              onLogout={logout}
              onSwitchToUser={() => setPortalMode('user')}
              onReplayOnboarding={handleReplayOnboarding}
            />
          )
        )}
      </View>

      {/* Bottom Navigation Bar (Spec Section 4 & 22) */}
      {!selectedCustomerId && (
        <BottomNav
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          dueCount={systemMetrics.dueCustomersCount}
        />
      )}

      {/* Global Toast Feedback Banner */}
      <ToastSnackbar
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onDismiss={hideToast}
      />

      {/* Quick Rate Setting Modal from Dashboard/Ribbon */}
      <RateSettingModal
        visible={isQuickRateModalOpen}
        rates={rates}
        onClose={() => setIsQuickRateModalOpen(false)}
        onSaveRates={updateStandardRates}
      />

      {/* Quick Add Customer Modal */}
      <AddCustomerModal
        visible={isQuickCustomerModalOpen}
        onClose={() => setIsQuickCustomerModalOpen(false)}
        onSaveCustomer={(customerData) => {
          const created = addCustomer(customerData);
          if (created && created.id) {
            handleSelectCustomer(created.id);
          }
        }}
      />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <AdminDataProvider>
      <MainAppShell />
    </AdminDataProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: tokens.colors.primary,
  },
  contentArea: {
    flex: 1,
    backgroundColor: tokens.colors.background,
  }
});
