import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import CustomerDetailsScreen from '../../../screens/CustomerDetailsScreen';

export default function AdminCustomerDetailsRoute() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <CustomerDetailsScreen
        customerId={id}
        onBack={() => router.back()}
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
