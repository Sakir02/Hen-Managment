import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import UserProfileScreen from '../../user/screens/UserProfileScreen';

export default function UserProfileRoute() {
  return (
    <View style={styles.container}>
      <UserProfileScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
