//src/queue/queue.ts
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { extractTicket, extractMileage, storeExpense, uploadToCloudinary, getCloudinarySignature } from "../api/laravelService";

export const addToQueue = async (imageUri: string, metadata: any, type: "ticket" | "mileage" | "expense") => {
  const queue = JSON.parse((await AsyncStorage.getItem("syncQueue")) || "[]");
  const updatedQueue = [...queue, { imageUri, metadata, type, timestamp: Date.now() }];
  await AsyncStorage.setItem("syncQueue", JSON.stringify(updatedQueue));
};

export const syncQueue = async (token: string) => {
  const { isConnected } = await NetInfo.fetch();
  if (!isConnected) return;

  const queue = JSON.parse((await AsyncStorage.getItem("syncQueue")) || "[]");
  if (queue.length === 0) return;

  try {
    const signatureData = await getCloudinarySignature(token); 

    for (const item of queue) {
      try {
        const imageUrl = await uploadToCloudinary(item.imageUri, signatureData);
        let response;
        switch (item.type) {
          case "ticket":
            response = await extractTicket(token, item.imageUri, item.metadata); 
            break;
          case "mileage":
            response = await extractMileage(token, item.imageUri, item.metadata); 
            break;
          case "expense":
            response = await storeExpense(token, item.metadata, item.imageUri); 
            break;
          default:
            throw new Error(`Type inconnu : ${item.type}`);
        }
        const updatedQueue = queue.filter((q: any) => q.timestamp !== item.timestamp);
        await AsyncStorage.setItem("syncQueue", JSON.stringify(updatedQueue));
        console.log("Synced:", response);
      } catch (error) {
        console.error("Échec de la synchronisation pour l’élément :", error);
        // L’élément reste dans la file en cas d’échec
      }
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la signature Cloudinary :", error);
  }
};
