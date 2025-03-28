// src/components/home/HelloWave.tsx
import React from 'react';
import { Text, StyleSheet } from 'react-native';

export const HelloWave: React.FC = () => {
  return <Text style={styles.text}>👋 Bienvenue !</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 24,
    padding: 16,
    textAlign: 'center',
  },
});