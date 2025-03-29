//src/contexts/SyncContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useOffline } from "./OfflineContext";
import { syncQueue } from "../queue/queue";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useAuth } from "../hooks/useAuth";

type SyncStatus = "synced" | "syncing" | "offline";

interface SyncContextType {
  syncStatus: SyncStatus;
  lastSyncTime: string | null;
  sync: () => Promise<void>;
}

export const SyncContext = createContext<SyncContextType | undefined>(undefined);

export const useSyncContext = () => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error("useSyncContext must be used within a SyncProvider");
  }
  return context;
};

export const SyncProvider = ({ children }: { children: ReactNode }) => {
  const { isOffline } = useOffline();
  const { token } = useAuth(); // Ajouté pour récupérer le token
  const { getItem, setItem } = useLocalStorage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(isOffline ? "offline" : "synced");
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  // Charger lastSyncTime depuis AsyncStorage au démarrage
  useEffect(() => {
    const loadLastSync = async () => {
      const storedLastSync = await getItem<string>("lastSyncTime");
      if (storedLastSync) {
        setLastSyncTime(storedLastSync);
      }
    };
    loadLastSync();
  }, [getItem]);

  // Fonction de synchronisation
  const sync = async (): Promise<void> => {
    if (isOffline || !token) {
      setSyncStatus("offline");
      return;
    }

    if (syncStatus === "syncing") return; // Éviter les synchronisations simultanées

    setSyncStatus("syncing");
    try {
      await syncQueue(token); // Passer le token à syncQueue
      const now = new Date().toISOString(); // Utiliser ISO pour une norme cohérente
      setLastSyncTime(now);
      await setItem("lastSyncTime", now);
      setSyncStatus("synced");
    } catch (error) {
      console.error("Erreur de synchronisation:", error);
      setSyncStatus("offline");
    }
  };

  // Synchronisation automatique quand la connexion revient ou le token change
  useEffect(() => {
    if (!isOffline && token && syncStatus === "offline") {
      sync();
    }
  }, [isOffline, token]); // Dépendances : isOffline et token

  // Mettre à jour syncStatus en fonction de isOffline et token
  useEffect(() => {
    if (isOffline || !token) {
      setSyncStatus("offline");
    } else if (syncStatus !== "syncing") {
      setSyncStatus("synced");
    }
  }, [isOffline, token]);

  return (
    <SyncContext.Provider value={{ syncStatus, lastSyncTime, sync }}>
      {children}
    </SyncContext.Provider>
  );
};