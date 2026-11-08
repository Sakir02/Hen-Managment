import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import GlobalHensScreen from '../../screens/GlobalHensScreen';

export default function AdminHensRoute() {
  const handleSelectCustomer = (customerId) => {
    router.push(`/(admin)/customers/${customerId}`);
  };

  return (
    <View style={styles.container}>
      <GlobalHensScreen
        onBack={() => router.back()}
        onSelectCustomer={handleSelectCustomer}
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
