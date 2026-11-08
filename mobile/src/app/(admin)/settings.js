import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import SettingsScreen from '../../screens/SettingsScreen';

export default function AdminSettingsRoute() {
  const { logout } = useAdminData();

  const handleLogout = () => {
    logout();
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <SettingsScreen
        onBack={() => router.back()}
        onLogout={handleLogout}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
