
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UnifiedDataProvider } from './contexts/UnifiedDataContext';
import LoginPage from './components/LoginPage';
import MainLayout from './layouts/MainLayout';

// AppContent will decide which main component to show based on auth status.
const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  // We are showing a blank screen or a spinner while auth state is loading.
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>; 
  }

  return currentUser ? <MainLayout /> : <LoginPage />;
};

// App is the root component that wraps everything with context providers.
const App: React.FC = () => {
  return (
    <AuthProvider>
      <UnifiedDataProvider>
        <AppContent />
      </UnifiedDataProvider>
    </AuthProvider>
  );
};

export default App;
