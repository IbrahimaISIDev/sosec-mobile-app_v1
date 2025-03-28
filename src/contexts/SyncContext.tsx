//src/contexts/SyncContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useOffline } from './OfflineContext';
import { syncQueue } from '../queue/queue';
import { useLocalStorage } from '../hooks/useLocalStorage';

type SyncStatus = 'synced' | 'syncing' | 'offline';

interface SyncContextType {
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  sync: () => Promise<void>;
}

export const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSyncContext must be used within a SyncProvider');
  }
  return context;
};

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const { isOffline } = useOffline();
  const { getItem, setItem } = useLocalStorage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('synced');
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Charger lastSyncTime depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadLastSync = async () => {
      const storedLastSync = await getItem<string>('lastSyncTime');
      if (storedLastSync) {
        setLastSyncTime(storedLastSync);
      }
    };
    loadLastSync();
  }, [getItem]);

  // Mettre à jour syncStatus en fonction de isOffline
  useEffect(() => {
    setSyncStatus(isOffline ? 'offline' : syncStatus === 'syncing' ? 'syncing' : 'synced');
  }, [isOffline]);

  // Synchronisation automatique quand la connexion revient
  useEffect(() => {
    if (!isOffline && syncStatus === 'offline') {
      sync();
    }
  }, [isOffline, syncStatus]);

  // Fonction de synchronisation
  const sync = async (): Promise<void> => {
    if (isOffline) {
      setSyncStatus('offline');
      return;
    }

    if (syncStatus === 'syncing') return; // Éviter les synchronisations simultanées

    setSyncStatus('syncing');
    try {
      await syncQueue(); // Synchroniser les données en attente via queue.ts
      const now = new Date().toLocaleString();
      setLastSyncTime(now);
      await setItem('lastSyncTime', now); // Persister dans AsyncStorage
      setSyncStatus('synced');
    } catch (error) {
      console.error('Erreur de synchronisation:', error);
      setSyncStatus('offline');
    }
  };

  return (
    <SyncContext.Provider value={{ syncStatus, lastSyncTime, sync }}>
      {children}
    </SyncContext.Provider>
  );
};