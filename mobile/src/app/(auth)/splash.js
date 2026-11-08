import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import HenAppSplashFlow from '../../components/onboarding/HenAppSplashFlow';

export default function SplashScreen() {
  const handleFinish = async () => {
    await AsyncStorage.setItem('has_seen_splash', 'true');
    router.replace('/(auth)/login');
  };

  return <HenAppSplashFlow onFinish={handleFinish} />;
}
