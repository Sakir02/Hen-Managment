import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import RolesPermissionsScreen from '../../screens/RolesPermissionsScreen';

export default function AdminRolesRoute() {
  return (
    <View style={styles.container}>
      <RolesPermissionsScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
