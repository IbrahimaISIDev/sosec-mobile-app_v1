// src/components/ui/TabBarBackground.tsx
import React from 'react';
import { BlurView } from 'expo-blur';
import { StyleSheet, Platform, View } from 'react-native';

export const TabBarBackground: React.FC = () => {
  return Platform.OS === 'ios' ? (
    <BlurView intensity={80} tint="light" style={styles.background} />
  ) : (
    <View style={styles.background} />
  );
};

const styles = StyleSheet.create({
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});