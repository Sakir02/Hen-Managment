import React from 'react';
import { View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import UserMoreScreen from '../../user/screens/UserMoreScreen';

export default function UserMoreRoute() {
  const { logout, setPortalMode } = useAdminData();

  const handleNavigateSubScreen = (subScreen) => {
    if (subScreen === 'payments') {
      router.push('/(user)/payments');
    } else if (subScreen === 'profile') {
      router.push('/(user)/profile');
    } else if (subScreen === 'settings') {
      router.push('/(user)/settings');
    } else if (subScreen === 'help') {
      router.push('/(user)/help');
    } else if (subScreen === 'chat') {
      router.push('/(user)/chat');
    }
  };

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleSwitchToAdmin = () => {
    setPortalMode('admin');
    router.replace('/(admin)');
  };

  const handleReplayOnboarding = async () => {
    await AsyncStorage.removeItem('has_seen_splash');
    router.replace('/(auth)/splash');
  };

  return (
    <View style={styles.container}>
      <UserMoreScreen
        onNavigateSubScreen={handleNavigateSubScreen}
        onLogout={handleLogout}
        onSwitchToAdmin={handleSwitchToAdmin}
        onReplayOnboarding={handleReplayOnboarding}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
