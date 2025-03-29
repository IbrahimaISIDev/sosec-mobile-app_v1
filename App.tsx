import React, { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { SyncProvider } from "./src/contexts/SyncContext";
import RootNavigator from "./src/navigation/RootNavigator";
import { ActivityIndicator, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { syncQueue } from "./src/queue/queue";

const SyncHandler: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token } = useAuth();

  useEffect(() => {
    if (token) {
      syncQueue(token);
      const unsubscribe = NetInfo.addEventListener((state) => {
        if (state.isConnected) {
          syncQueue(token);
        }
      });
      return () => unsubscribe();
    }
  }, [token]);

  return <>{children}</>;
};

const App = () => {
  return (
    <AuthProvider>
      <SyncProvider>
        <SyncHandler>
          <RootNavigator />
          <StatusBar style="auto" />
        </SyncHandler>
      </SyncProvider>
    </AuthProvider>
  );
};

export default App;