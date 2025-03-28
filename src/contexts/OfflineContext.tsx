import React, { createContext, useState, useEffect, ReactNode } from 'react';
import NetInfo from '@react-native-community/netinfo';

interface OfflineContextType {
  isOffline: boolean;
}

export const OfflineContext = createContext<OfflineContextType>({
  isOffline: false,
});

export const OfflineProvider = ({ children }: { children: ReactNode }) => {
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    // Vérifier l’état initial
    NetInfo.fetch().then(state => {
      setIsOffline(!state.isConnected);
    });

    // Écouter les changements de connexion
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  return (
    <OfflineContext.Provider value={{ isOffline }}>
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => React.useContext(OfflineContext);