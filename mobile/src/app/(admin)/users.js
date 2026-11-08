import React from 'react';
import { View, StyleSheet } from 'react-native';
import UsersScreen from '../../screens/UsersScreen';

export default function AdminUsersRoute() {
  return (
    <View style={styles.container}>
      <UsersScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAF8',
  },
});
