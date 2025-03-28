// src/components/common/HapticTab.tsx
import React from 'react';
import { TouchableOpacity, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

interface HapticTabProps {
  onPress?: () => void;
  children: React.ReactNode;
}

export const HapticTab: React.FC<HapticTabProps> = ({ onPress, children }) => {
  const handlePress = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <TouchableOpacity style={styles.tab} onPress={handlePress} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});