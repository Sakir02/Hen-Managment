import React from 'react';
import { Tabs, router, usePathname } from 'expo-router';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { userTokens } from '../../user/styles/userTokens';
import { useAdminData } from '../../context/AdminDataContext';
import UserAppBar from '../../user/components/common/UserAppBar';
import Icon2D from '../../components/common/Icon2D';

export default function UserLayout() {
  const { currentUser, setPortalMode, systemMetrics } = useAdminData();
  const pathname = usePathname();

  // Determine top header title and back button based on active route
  const getHeaderInfo = () => {
    if (pathname.includes('/customers/') && pathname !== '/(user)/customers') {
      return {
        title: 'Customer Ledger',
        subtitle: 'Batch Intake & Payments',
        showBack: true,
      };
    }
    if (pathname.includes('/profile')) {
      return {
        title: 'Operator Profile',
        subtitle: 'Handheld Operator Credentials',
        showBack: true,
      };
    }
    if (pathname.includes('/settings')) {
      return {
        title: 'Field Settings',
        subtitle: 'Sync & Security Preferences',
        showBack: true,
      };
    }
    if (pathname.includes('/payments')) {
      return {
        title: 'Payments Ledger',
        subtitle: 'Receipts & Settle Records',
        showBack: true,
      };
    }
    if (pathname.includes('/chat')) {
      return {
        title: 'Private Chat',
        subtitle: 'Bilateral Operator ↔ Admin messaging',
        showBack: true,
      };
    }
    if (pathname.includes('/help')) {
      return {
        title: 'Staff Guide',
        subtitle: 'Weighing & Invoicing Help',
        showBack: true,
      };
    }
    if (pathname.includes('/customers')) {
      return {
        title: 'Customer Hub',
        subtitle: 'Live Buyer & Farm Ledgers',
        showBack: false,
      };
    }
    if (pathname.includes('/hens')) {
      return {
        title: 'Birds Inventory',
        subtitle: 'Total Stock & Batch Intake',
        showBack: false,
      };
    }
    if (pathname.includes('/more')) {
      return {
        title: 'Staff Menu',
        subtitle: 'Receipts, Profile & Tools',
        showBack: false,
      };
    }
    return {
      title: 'JV • Hen Management',
      subtitle: 'Smart Poultry Intake & Billing',
      showBack: false,
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Persistent Brand Header */}
      <UserAppBar
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        showBack={headerInfo.showBack}
        onBack={() => router.back()}
        userAvatar={
          currentUser?.name
            ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
            : 'RK'
        }
        unreadNotifications={systemMetrics?.dueCustomersCount || 0}
        onNotificationPress={() => router.push('/(user)/customers')}
        onProfilePress={() => router.push('/(user)/profile')}
        onChatPress={() => router.push('/(user)/chat')}
        onTogglePortal={() => {
          setPortalMode('admin');
          router.replace('/(admin)');
        }}
      />

      {/* Expo Router Bottom Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: userTokens.colors.primary,
          tabBarInactiveTintColor: userTokens.colors.textSecondary,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 76 : 64,
            backgroundColor: userTokens.colors.surface,
            borderTopWidth: 1,
            borderTopColor: userTokens.colors.border,
            paddingBottom: Platform.OS === 'ios' ? 16 : 8,
            paddingTop: 8,
            elevation: 8,
            shadowColor: '#0F172A',
            shadowOffset: { width: 0, height: -2 },
            shadowOpacity: 0.06,
            shadowRadius: 6,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
            marginTop: 2,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => (
              <Icon2D name="home" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="customers/index"
          options={{
            title: 'Customers',
            tabBarBadge: (systemMetrics?.dueCustomersCount || 0) > 0 ? systemMetrics.dueCustomersCount : undefined,
            tabBarBadgeStyle: {
              backgroundColor: userTokens.colors.warning,
              color: '#FFFFFF',
              fontSize: 10,
              fontWeight: '700',
            },
            tabBarIcon: ({ color }) => (
              <Icon2D name="customers" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="hens"
          options={{
            title: 'Hens',
            tabBarIcon: ({ color }) => (
              <Icon2D name="hens" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            title: 'More',
            tabBarIcon: ({ color }) => (
              <Icon2D name="more" size={22} color={color} />
            ),
          }}
        />

        {/* Hidden auxiliary screens */}
        <Tabs.Screen
          name="customers/[id]"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="payments"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="chat"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="help"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: userTokens.colors.surface,
  },
});
