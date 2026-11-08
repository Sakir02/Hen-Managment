import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import { useAdminData } from '../../context/AdminDataContext';
import UserDashboardScreen from '../../user/screens/UserDashboardScreen';
import UserCustomerModal from '../../user/components/customer/UserCustomerModal';
import UserBatchAddHenModal from '../../user/components/hen/UserBatchAddHenModal';

export default function UserDashboardRoute() {
  const { customers, addCustomer, addHensBatchToCustomer, rates } = useAdminData();

  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isBatchHenModalOpen, setIsBatchHenModalOpen] = useState(false);

  const handleSelectCustomer = (customerId) => {
    router.push(`/(user)/customers/${customerId}`);
  };

  const handleNavigateTab = (tab, subScreen) => {
    if (tab === 'customers') {
      router.push('/(user)/customers');
    } else if (tab === 'hens') {
      router.push('/(user)/hens');
    } else if (tab === 'more') {
      if (subScreen === 'profile') router.push('/(user)/profile');
      else if (subScreen === 'settings') router.push('/(user)/settings');
      else if (subScreen === 'payments') router.push('/(user)/payments');
      else if (subScreen === 'help') router.push('/(user)/help');
      else if (subScreen === 'chat') router.push('/(user)/chat');
      else router.push('/(user)/more');
    }
  };

  const handleSaveCustomer = (customerData) => {
    const created = addCustomer(customerData);
    setIsCustomerModalOpen(false);
    if (created && created.id) {
      router.push(`/(user)/customers/${created.id}`);
    }
  };

  const handleSaveBatchHens = (batchHens) => {
    const targetCustId = customers[0]?.id;
    if (targetCustId) {
      addHensBatchToCustomer(targetCustId, batchHens);
    }
    setIsBatchHenModalOpen(false);
  };

  return (
    <View style={styles.container}>
      <UserDashboardScreen
        onNavigateTab={handleNavigateTab}
        onOpenAddCustomer={() => setIsCustomerModalOpen(true)}
        onOpenAddHen={() => setIsBatchHenModalOpen(true)}
        onSelectCustomer={handleSelectCustomer}
      />

      {/* Quick Add Customer Modal (strictly Name & Phone, no Address) */}
      <UserCustomerModal
        visible={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
        onSave={handleSaveCustomer}
      />

      {/* Quick Combined Batch Intake Modal */}
      <UserBatchAddHenModal
        visible={isBatchHenModalOpen}
        customerName={customers[0]?.name || 'Rahul Patel'}
        standardRates={rates}
        onClose={() => setIsBatchHenModalOpen(false)}
        onSaveBatch={handleSaveBatchHens}
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
