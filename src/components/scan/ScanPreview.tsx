import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ScanPreviewProps {
  imageUri: string;
  onRetake: () => void;
  onConfirm: () => Promise<void>; // Changed to async function
  isProcessing?: boolean; // Added optional isProcessing prop
}

const ScanPreview: React.FC<ScanPreviewProps> = ({ 
  imageUri, 
  onRetake, 
  onConfirm, 
  isProcessing = false 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onRetake} 
          style={styles.backButton}
          disabled={isProcessing} // Disable when processing
        >
          <Ionicons name="arrow-back" size={28} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Aperçu du ticket</Text>
      </View>
      
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUri }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={onRetake}
          disabled={isProcessing} // Disable when processing
        >
          <Text style={styles.buttonText}>Reprendre</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[
            styles.button, 
            styles.confirmButton, 
            isProcessing && styles.disabledButton // Add disabled style when processing
          ]} 
          onPress={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Confirmer</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#333',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0066cc',
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  button: {
    flex: 1,
    backgroundColor: '#555',
    padding: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
  },
  disabledButton: {
    backgroundColor: '#888', // Slightly different color when disabled
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ScanPreview;