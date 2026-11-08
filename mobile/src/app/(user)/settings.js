import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import UserSettingsScreen from '../../user/screens/UserSettingsScreen';

export default function UserSettingsRoute() {
  const { logout, setPortalMode } = useAdminData();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  const handleSwitchToAdmin = () => {
    setPortalMode('admin');
    router.replace('/(admin)');
  };

  return (
    <View style={styles.container}>
      <UserSettingsScreen
        onBack={() => router.back()}
        onLogout={handleLogout}
        onSwitchToAdmin={handleSwitchToAdmin}
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
