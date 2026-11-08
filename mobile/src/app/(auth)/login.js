import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import UserLoginScreen from '../../user/screens/UserLoginScreen';

export default function UserLoginRoute() {
  const { currentUser, setPortalMode } = useAdminData();

  useEffect(() => {
    if (currentUser) {
      setPortalMode('user');
      router.replace('/(user)');
    }
  }, [currentUser]);

  return (
    <UserLoginScreen
      onSwitchToAdmin={() => {
        setPortalMode('admin');
        router.push('/(auth)/admin-login');
      }}
    />
  );
}
