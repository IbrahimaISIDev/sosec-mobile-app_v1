// src/components/ui/IconSymbol.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet } from 'react-native';

interface IconSymbolProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color = '#000' }) => {
  return <Ionicons name={name} size={size} color={color} style={styles.icon} />;
};

const styles = StyleSheet.create({
  icon: {
    padding: 4,
  },
});