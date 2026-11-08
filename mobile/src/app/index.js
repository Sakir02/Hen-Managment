import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useAdminData } from '../context/AdminDataContext';
import { userTokens } from '../user/styles/userTokens';

export default function AppIndex() {
  const { currentUser, portalMode } = useAdminData();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function checkState() {
      try {
        const hasSeenSplash = await AsyncStorage.getItem('has_seen_splash');

        if (!isMounted) return;

        if (!hasSeenSplash) {
          router.replace('/(auth)/splash');
          return;
        }

        if (!currentUser) {
          if (portalMode === 'admin') {
            router.replace('/(auth)/admin-login');
          } else {
            router.replace('/(auth)/login');
          }
          return;
        }

        if (portalMode === 'admin') {
          router.replace('/(admin)');
        } else {
          router.replace('/(user)');
        }
      } catch (e) {
        if (isMounted) {
          router.replace('/(auth)/login');
        }
      } finally {
        if (isMounted) setIsReady(true);
      }
    }

    checkState();

    return () => {
      isMounted = false;
    };
  }, [currentUser, portalMode]);

  return (
    <View style={styles.container}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>JV</Text>
      </View>
      <Text style={styles.brandTitle}>JV • Hen Management</Text>
      <Text style={styles.brandSubtitle}>Initializing poultry operations...</Text>
      <ActivityIndicator size="small" color={userTokens.colors.primary} style={styles.loader} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: userTokens.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: userTokens.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 1,
  },
  brandTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: userTokens.colors.textPrimary,
    marginBottom: 4,
  },
  brandSubtitle: {
    fontSize: 13,
    color: userTokens.colors.textSecondary,
    marginBottom: 24,
  },
  loader: {
    marginTop: 8,
  },
});
