import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import "@react-native-firebase/firestore";

// Vérifie que Firebase est initialisé (généralement automatique avec Expo bare workflow)
// Si tu utilises un workflow personnalisé, ajoute ici les credentials si nécessaire

export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    console.log("Firebase initialized");
    // Pas besoin de config manuelle si google-services.json et GoogleService-Info.plist sont en place
  }
};

// Export des modules pour usage direct
export const auth = firebase.auth;
export const firestore = firebase.firestore;