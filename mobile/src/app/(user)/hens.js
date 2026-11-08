import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import UserHensScreen from '../../user/screens/UserHensScreen';

export default function UserHensRoute() {
  const handleSelectCustomer = (customerId) => {
    router.push(`/(user)/customers/${customerId}`);
  };

  return (
    <View style={styles.container}>
      <UserHensScreen onSelectCustomer={handleSelectCustomer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
});
