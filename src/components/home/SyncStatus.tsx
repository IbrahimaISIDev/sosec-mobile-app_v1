// src/components/home/SyncStatus.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SyncStatusProps {
  status: "synced" | "syncing" | "offline";
  lastSync?: string;
}

const SyncStatus = ({ status, lastSync }: SyncStatusProps) => {
  const spin = new Animated.Value(0);

  if (status === "syncing") {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      })
    ).start();
  }

  const spinInterpolate = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  // 🔥 Typage strict pour éviter les erreurs TypeScript
  const statusConfig: Record<
    SyncStatusProps["status"],
    { icon: keyof typeof Ionicons.glyphMap; color: string; text: string }
  > = useMemo(
    () => ({
      synced: {
        icon: "checkmark-done-circle",
        color: "#4CAF50",
        text: "Synchronisé",
      },
      syncing: {
        icon: "sync",
        color: "#FFC107",
        text: "Synchronisation en cours...",
      },
      offline: { icon: "cloud-offline", color: "#F44336", text: "Hors ligne" },
    }),
    []
  );

  const { icon, color, text } = statusConfig[status];

  return (
    <View style={styles.container}>
      {status === "syncing" ? (
        <Animated.View style={{ transform: [{ rotate: spinInterpolate }] }}>
          <Ionicons name={icon} size={24} color={color} />
        </Animated.View>
      ) : (
        <Ionicons name={icon} size={24} color={color} />
      )}
      <Text style={[styles.text, { color }]}>{text}</Text>
      {status === "synced" && lastSync && (
        <Text style={styles.lastSync}>Dernière sync: {lastSync}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "#F5F5F5",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 8,
  },
  lastSync: {
    fontSize: 12,
    color: "#757575",
    marginLeft: 8,
  },
});

export default SyncStatus;
