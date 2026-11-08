import React from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import OneToOneChatScreen from '../../screens/OneToOneChatScreen';

export default function UserChatRoute() {
  const { currentUser } = useAdminData();

  return (
    <View style={styles.container}>
      <OneToOneChatScreen
        mode="user"
        currentUser={currentUser}
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
