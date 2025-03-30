import firebase from "@react-native-firebase/app";
import auth from "@react-native-firebase/auth"; // Import explicite
import firestore from "@react-native-firebase/firestore"; // Import explicite

// Vérifie que Firebase est initialisé (généralement automatique avec google-services.json et GoogleService-Info.plist)
export const initializeFirebase = () => {
  if (!firebase.apps.length) {
    console.log("Firebase initialized");
    // Pas besoin de configuration manuelle si les fichiers natifs sont en place
  } else {
    console.log("Firebase already initialized");
  }
};

// Export des modules pour usage direct
export { auth, firestore };