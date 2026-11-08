import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import UserHelpScreen from '../../user/screens/UserHelpScreen';

export default function UserHelpRoute() {
  return (
    <View style={styles.container}>
      <UserHelpScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
