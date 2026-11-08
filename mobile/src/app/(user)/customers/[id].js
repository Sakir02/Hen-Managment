import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import UserCustomerDetailsScreen from '../../../user/screens/UserCustomerDetailsScreen';

export default function UserCustomerDetailsRoute() {
  const { id } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <UserCustomerDetailsScreen
        customerId={id}
        onBack={() => router.back()}
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
