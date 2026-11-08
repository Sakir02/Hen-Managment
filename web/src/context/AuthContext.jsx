import React, { createContext, useContext, useState } from 'react';
import { initialStaffUsers } from '../data/mockData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // portal: 'user' | 'admin'
  const [portal, setPortal] = useState('user');
  
  // Current user session
  const [currentUser, setCurrentUser] = useState({
    id: 'usr-1',
    name: 'Rahul Kumar',
    role: 'Field Operator',
    email: 'rahul.kumar@henoperations.com',
    phone: '+91 98765 43210',
    avatar: 'RK'
  });

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loginUser = (phone, otp) => {
    const user = initialStaffUsers.find(u => u.phone.includes(phone)) || initialStaffUsers[0];
    setCurrentUser(user);
    setPortal('user');
    showToast(`Welcome back, ${user.name}!`);
    return true;
  };

  const loginAdmin = (email, password) => {
    const admin = initialStaffUsers.find(u => u.role.includes('Admin')) || initialStaffUsers[1];
    setCurrentUser(admin);
    setPortal('admin');
    showToast(`Logged into Admin Dashboard as ${admin.name}!`);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Signed out securely.', 'info');
  };

  const switchPortal = (targetPortal) => {
    setPortal(targetPortal);
    if (!currentUser) return;
    if (targetPortal === 'admin' && !currentUser.role.includes('Admin')) {
      // Elevate or assign admin profile for demo ease
      setCurrentUser(initialStaffUsers[1]);
    } else if (targetPortal === 'user' && currentUser.role.includes('Admin')) {
      setCurrentUser(initialStaffUsers[0]);
    }
    showToast(`Switched to ${targetPortal === 'admin' ? 'Admin Dashboard' : 'User Portal'}`);
  };

  return (
    <AuthContext.Provider
      value={{
        portal,
        setPortal,
        currentUser,
        setCurrentUser,
        loginUser,
        loginAdmin,
        logout,
        switchPortal,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
