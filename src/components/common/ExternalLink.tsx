// src/components/common/ExternalLink.tsx
import React from 'react';
import { Linking, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({ href, children }) => {
  const handlePress = () => Linking.openURL(href);

  return (
    <TouchableOpacity style={styles.link} onPress={handlePress}>
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  link: {
    padding: 8,
  },
  text: {
    color: '#1976D2',
    fontSize: 16,
  },
});