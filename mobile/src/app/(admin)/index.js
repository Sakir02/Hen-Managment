import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import DashboardScreen from '../../screens/DashboardScreen';
import RateSettingModal from '../../components/RateSettingModal';
import AddCustomerModal from '../../components/AddCustomerModal';

export default function AdminDashboardRoute() {
  const { rates, updateStandardRates, addCustomer } = useAdminData();
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);

  const handleNavigateTab = (tab, subScreen) => {
    if (tab === 'customers') {
      router.push('/(admin)/customers');
    } else if (tab === 'hens') {
      router.push('/(admin)/hens');
    } else if (tab === 'users') {
      router.push('/(admin)/users');
    } else if (tab === 'more') {
      if (subScreen === 'rates') router.push('/(admin)/rates');
      else if (subScreen === 'roles') router.push('/(admin)/roles');
      else if (subScreen === 'audit') router.push('/(admin)/audit');
      else if (subScreen === 'payments') router.push('/(admin)/payments');
      else if (subScreen === 'settings') router.push('/(admin)/settings');
      else if (subScreen === 'chat') router.push('/(admin)/chat');
      else router.push('/(admin)/settings');
    }
  };

  const handleSelectCustomer = (customerId) => {
    router.push(`/(admin)/customers/${customerId}`);
  };

  const handleSaveCustomer = (customerData) => {
    const created = addCustomer(customerData);
    setIsCustomerModalOpen(false);
    if (created && created.id) {
      router.push(`/(admin)/customers/${created.id}`);
    }
  };

  return (
    <View style={styles.container}>
      <DashboardScreen
        onNavigateTab={handleNavigateTab}
        onOpenRateModal={() => setIsRateModalOpen(true)}
        onOpenAddCustomer={() => setIsCustomerModalOpen(true)}
        onSelectCustomer={handleSelectCustomer}
      />

      <RateSettingModal
        visible={isRateModalOpen}
        onClose={() => setIsRateModalOpen(false)}
        currentRates={rates}
        onSaveRates={(marga, margee) => {
          updateStandardRates(marga, margee);
          setIsRateModalOpen(false);
        }}
      />

      <AddCustomerModal
        visible={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSaveCustomer={handleSaveCustomer}
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
