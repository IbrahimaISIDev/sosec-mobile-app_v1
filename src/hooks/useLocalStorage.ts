import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useLocalStorage = () => {
  const setItem = useCallback(async (key: string, value: any) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem(key, jsonValue);
    } catch (error) {
      console.error(`Erreur lors de l’écriture dans AsyncStorage (${key}):`, error);
    }
  }, []);

  const getItem = useCallback(async <T>(key: string): Promise<T | null> => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (error) {
      console.error(`Erreur lors de la lecture dans AsyncStorage (${key}):`, error);
      return null;
    }
  }, []);

  const removeItem = useCallback(async (key: string) => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Erreur lors de la suppression dans AsyncStorage (${key}):`, error);
    }
  }, []);

  const clear = useCallback(async () => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Erreur lors du vidage d’AsyncStorage:', error);
    }
  }, []);

  return { setItem, getItem, removeItem, clear };
};