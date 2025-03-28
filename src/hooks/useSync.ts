// src/hooks/useSync.ts
import { useEffect, useContext } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { SyncContext } from '../contexts/SyncContext';

export const useSync = () => {
  const context = useContext(SyncContext);

  // Vérification que le contexte est défini
  if (context === undefined) {
    throw new Error('useSync doit être utilisé à l’intérieur d’un SyncProvider');
  }

  const { sync, syncStatus, lastSyncTime } = context;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && syncStatus !== 'syncing') { 
        sync();
      }
    });

    return () => unsubscribe();
  }, [sync, syncStatus]); 
  return {
    sync,
    isSyncing: syncStatus === 'syncing', 
    lastSync: lastSyncTime,
  };
};
