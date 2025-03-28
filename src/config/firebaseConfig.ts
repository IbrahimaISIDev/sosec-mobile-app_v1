// src/config/firebaseConfig.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'VOTRE_API_KEY',           // Remplacez par votre clé API Firebase
  authDomain: 'VOTRE_AUTH_DOMAIN',   // Ex: "votre-projet.firebaseapp.com"
  projectId: 'VOTRE_PROJECT_ID',     // Ex: "votre-projet"
  storageBucket: 'VOTRE_STORAGE_BUCKET', // Ex: "votre-projet.appspot.com"
  messagingSenderId: 'VOTRE_MESSAGING_SENDER_ID', // Ex: "123456789"
  appId: 'VOTRE_APP_ID',             // Ex: "1:123456789:web:abcdef123456"
};

// Initialisation de Firebase
const app = initializeApp(firebaseConfig);
// Accéder aux services Firebase
const auth = getAuth(app);
const firestore = getFirestore(app);

// Exporter les services
export { app, auth, firestore };