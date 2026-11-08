import React from 'react';
import { Tabs, router, usePathname } from 'expo-router';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { tokens } from '../../styles/tokens';
import { useAdminData } from '../../context/AdminDataContext';
import MobileAppBar from '../../components/common/MobileAppBar';
import Icon2D from '../../components/common/Icon2D';

export default function AdminLayout() {
  const { currentUser, setPortalMode, systemMetrics } = useAdminData();
  const pathname = usePathname();

  const getHeaderInfo = () => {
    if (pathname.includes('/customers/') && pathname !== '/(admin)/customers') {
      return {
        title: 'Customer Ledger',
        subtitle: 'Batch Hens & Payments',
        showBack: true,
      };
    }
    if (pathname.includes('/users')) {
      return {
        title: 'Staff Management',
        subtitle: 'Field Operators & Role Permissions',
        showBack: false,
      };
    }
    if (pathname.includes('/settings')) {
      return {
        title: 'System Settings',
        subtitle: 'Global Mandi Parameters & Export',
        showBack: false,
      };
    }
    if (pathname.includes('/rates')) {
      return {
        title: 'Mandi Rates Center',
        subtitle: 'Benchmark Price Broadcast',
        showBack: true,
      };
    }
    if (pathname.includes('/roles')) {
      return {
        title: 'Roles & Permissions',
        subtitle: 'Access Control Matrix',
        showBack: true,
      };
    }
    if (pathname.includes('/audit')) {
      return {
        title: 'System Audit Logs',
        subtitle: 'Security & Transaction Trail',
        showBack: true,
      };
    }
    if (pathname.includes('/hens')) {
      return {
        title: 'Birds Inventory',
        subtitle: 'Live Bird Stock & Intake',
        showBack: true,
      };
    }
    if (pathname.includes('/payments')) {
      return {
        title: 'Master Payments Ledger',
        subtitle: 'Cross-Farm Transactions',
        showBack: true,
      };
    }
    if (pathname.includes('/chat')) {
      return {
        title: 'Private User Chats',
        subtitle: 'Bilateral Operator Messaging',
        showBack: true,
      };
    }
    if (pathname.includes('/customers')) {
      return {
        title: 'Customer Hub',
        subtitle: 'Active Farms & Ledger Accounts',
        showBack: false,
      };
    }
    return {
      title: 'JV Admin Console',
      subtitle: 'Executive Poultry Oversight',
      showBack: false,
    };
  };

  const headerInfo = getHeaderInfo();

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* Top Application Bar */}
      <MobileAppBar
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        showBack={headerInfo.showBack}
        onBack={() => router.back()}
        userAvatar={
          currentUser?.name
            ? currentUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)
            : 'AD'
        }
        unreadNotifications={systemMetrics?.dueCustomersCount || 0}
        onNotificationPress={() => router.push('/(admin)/customers')}
        onProfilePress={() => router.push('/(admin)/settings')}
        onChatPress={() => router.push('/(admin)/chat')}
        rightAction={
          <TouchableOpacity
            style={styles.portalToggleBtn}
            onPress={() => {
              setPortalMode('user');
              router.replace('/(user)');
            }}
            activeOpacity={0.8}
          >
            <Icon2D name="user" size={13} color={tokens.colors.primary} style={{ marginRight: 4 }} />
            <Text style={styles.portalToggleText}>User Portal</Text>
          </TouchableOpacity>
        }
      />

      {/* Admin Bottom Tabs */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: tokens.colors.primary,
          tabBarInactiveTintColor: tokens.colors.textSecondary,
          tabBarStyle: {
            height: Platform.OS === 'ios' ? 76 : 64,
            backgroundColor: tokens.colors.surface,
            borderTopWidth: 1,
            borderTopColor: tokens.colors.border,
            paddingBottom: Platform.OS === 'ios' ? 16 : 8,
            paddingTop: 8,
            elevation: 8,
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
            title: 'Dashboard',
            tabBarIcon: ({ color }) => (
              <Icon2D name="home" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="users"
          options={{
            title: 'Users',
            tabBarIcon: ({ color }) => (
              <Icon2D name="users" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="customers/index"
          options={{
            title: 'Customers',
            tabBarBadge: (systemMetrics?.dueCustomersCount || 0) > 0 ? systemMetrics.dueCustomersCount : undefined,
            tabBarIcon: ({ color }) => (
              <Icon2D name="customers" size={22} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color }) => (
              <Icon2D name="settings" size={22} color={color} />
            ),
          }}
        />

        {/* Hidden sub-screens */}
        <Tabs.Screen
          name="customers/[id]"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="rates"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="roles"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="audit"
          options={{
            href: null,
            tabBarStyle: { display: 'none' },
          }}
        />
        <Tabs.Screen
          name="hens"
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
          name="chat"
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
    backgroundColor: tokens.colors.surface,
  },
  portalToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: tokens.spacing.sm,
    paddingVertical: 4,
    borderRadius: tokens.radii.pill,
    backgroundColor: tokens.colors.primaryLight,
    borderWidth: 1,
    borderColor: tokens.colors.primary,
  },
  portalToggleText: {
    fontSize: 11,
    fontWeight: tokens.typography.bold,
    color: tokens.colors.primary,
  },
});
