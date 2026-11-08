import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import AuditLogsScreen from '../../screens/AuditLogsScreen';

export default function AdminAuditRoute() {
  return (
    <View style={styles.container}>
      <AuditLogsScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
