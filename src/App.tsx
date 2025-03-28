import React from 'react';
import { StatusBar } from 'expo-status-bar'; // Si tu utilises Expo, sinon retire cette ligne
import { AuthProvider } from './contexts/AuthContext';
import { SyncProvider } from './contexts/SyncContext';
import RootNavigator from './navigation/RootNavigator';

const App = () => {
  return (
    <AuthProvider>
      <SyncProvider>
        <RootNavigator />
        <StatusBar style="auto" /> {/* Optionnel, pour Expo */}
      </SyncProvider>
    </AuthProvider>
  );
};

export default App;
