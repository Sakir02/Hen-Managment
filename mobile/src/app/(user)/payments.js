import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import UserPaymentsScreen from '../../user/screens/UserPaymentsScreen';

export default function UserPaymentsRoute() {
  const handleSelectCustomer = (customerId) => {
    router.push(`/(user)/customers/${customerId}`);
  };

  return (
    <View style={styles.container}>
      <UserPaymentsScreen
        onBack={() => router.back()}
        onSelectCustomer={handleSelectCustomer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
