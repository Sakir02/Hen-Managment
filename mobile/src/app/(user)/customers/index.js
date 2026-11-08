import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import UserCustomersScreen from '../../../user/screens/UserCustomersScreen';

export default function UserCustomersRoute() {
  const handleSelectCustomer = (customerId) => {
    router.push(`/(user)/customers/${customerId}`);
  };

  return (
    <View style={styles.container}>
      <UserCustomersScreen onSelectCustomer={handleSelectCustomer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
