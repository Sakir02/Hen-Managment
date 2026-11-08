import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import RatesScreen from '../../screens/RatesScreen';

export default function AdminRatesRoute() {
  return (
    <View style={styles.container}>
      <RatesScreen onBack={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
