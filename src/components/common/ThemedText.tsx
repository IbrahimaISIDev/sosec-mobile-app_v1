// src/components/common/ThemedText.tsx
import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';
import { useColorScheme } from '../../hooks/useColorScheme';
import { Colors } from '../../constants/Colors';

export const ThemedText: React.FC<TextProps> = (props) => {
  const colorScheme = useColorScheme();
  return (
    <Text
      {...props}
      style={[styles.text, { color: Colors[colorScheme].text }, props.style]}
    />
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});