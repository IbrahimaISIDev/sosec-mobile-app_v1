import React from 'react';
import { StatusBar } from 'expo-status-bar'; // Si tu utilises Expo, sinon retire cette ligne
import { AuthProvider } from './src/contexts/AuthContext';
import { SyncProvider } from './src/contexts/SyncContext';
import RootNavigator from './src/navigation/RootNavigator';

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
