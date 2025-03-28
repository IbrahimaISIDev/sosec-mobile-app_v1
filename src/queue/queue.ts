import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { extractTicket, extractMileage, storeExpense, uploadToCloudinary, getCloudinarySignature } from '../api/laravelService';

export const addToQueue = async (imageUri: string, metadata: any, type: 'ticket' | 'mileage' | 'expense') => {
  const queue = JSON.parse(await AsyncStorage.getItem('syncQueue') || '[]');
  const updatedQueue = [...queue, { imageUri, metadata, type, timestamp: Date.now() }];
  await AsyncStorage.setItem('syncQueue', JSON.stringify(updatedQueue));
};

export const syncQueue = async () => {
  const { isConnected } = await NetInfo.fetch();
  if (!isConnected) return;

  const queue = JSON.parse(await AsyncStorage.getItem('syncQueue') || '[]');
  const signatureData = await getCloudinarySignature();

  for (const item of queue) {
    try {
      const imageUrl = await uploadToCloudinary(item.imageUri, signatureData);
      let response;
      switch (item.type) {
        case 'ticket':
          response = await extractTicket(item.imageUri, item.metadata);
          break;
        case 'mileage':
          response = await extractMileage(item.imageUri, item.metadata);
          break;
        case 'expense':
          response = await storeExpense(item.metadata, item.imageUri);
          break;
      }
      const updatedQueue = queue.filter((q: any) => q.timestamp !== item.timestamp);
      await AsyncStorage.setItem('syncQueue', JSON.stringify(updatedQueue));
      console.log('Synced:', response);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};

NetInfo.addEventListener(state => {
  if (state.isConnected) syncQueue();
});