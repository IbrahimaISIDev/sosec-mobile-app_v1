// src/components/common/ThemedView.tsx
import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

export const ThemedView: React.FC<ViewProps> = (props) => {
  const colorScheme = useColorScheme();
  return (
    <View
      {...props}
      style={[styles.view, { backgroundColor: Colors[colorScheme].background }, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  view: {
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});