// src/hooks/useCamera.ts
import { useState, useEffect } from 'react';
import { Camera, CameraView, CameraType, FlashMode } from 'expo-camera'; // Ajout de Camera
import * as ImageManipulator from 'expo-image-manipulator';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<CameraView | null>(null);
  const [flashMode, setFlashMode] = useState<FlashMode>('off');
  const [cameraType, setCameraType] = useState<CameraType>('back');

  // Vérifier et demander les permissions au montage
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync(); // Correction ici
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Basculer le flash
  const toggleFlash = () => {
    setFlashMode(prev => (prev === 'off' ? 'on' : 'off'));
  };

  // Basculer entre caméra avant et arrière
  const toggleCameraType = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  // Prendre une photo et la traiter
  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef || !hasPermission) {
      console.error('Caméra non prête ou permissions manquantes');
      return null;
    }

    try {
      const photo = await cameraRef.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      if (!photo) return null;

      // Redimensionner et compresser l’image
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [
          { resize: { width: 1200 } }, // Redimensionner à 1200px de large
          { crop: { originX: 0, originY: 0, width: 1200, height: 800 } }, // Recadrer
        ],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      return processedImage.uri; // Retourner uniquement l’URI pour compatibilité
    } catch (error) {
      console.error('Erreur lors de la prise de photo:', error);
      throw error;
    }
  };

  return {
    hasPermission,
    cameraRef,
    setCameraRef,
    flashMode,
    toggleFlash,
    cameraType,
    toggleCameraType,
    takePicture,
  };
};