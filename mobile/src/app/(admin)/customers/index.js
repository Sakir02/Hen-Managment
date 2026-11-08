import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import CustomersScreen from '../../../screens/CustomersScreen';

export default function AdminCustomersRoute() {
  const handleSelectCustomer = (customerId) => {
    router.push(`/(admin)/customers/${customerId}`);
  };

  return (
    <View style={styles.container}>
      <CustomersScreen onSelectCustomer={handleSelectCustomer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
