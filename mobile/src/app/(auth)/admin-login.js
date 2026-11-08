import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import LoginScreen from '../../screens/LoginScreen';

export default function AdminLoginRoute() {
  const { currentUser, setPortalMode } = useAdminData();

  useEffect(() => {
    if (currentUser) {
      setPortalMode('admin');
      router.replace('/(admin)');
    }
  }, [currentUser]);

  return (
    <LoginScreen
      onSwitchToUser={() => {
        setPortalMode('user');
        router.push('/(auth)/login');
      }}
    />
  );
}
