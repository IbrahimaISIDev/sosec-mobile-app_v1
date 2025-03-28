// src/contexts/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { auth, firestore } from '../config/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../types/user.types';
import { Truck } from '../types/truck.types';
import { User as FirebaseUser } from 'firebase/auth';
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'; 
import { collection, doc, getDoc } from 'firebase/firestore'; 

interface AuthState {
  token: string | null;
  userId: string | null;
  user: User | null;
  truck: Truck | null;
  isLoggedIn: boolean;
}

interface AuthContextType {
  token: string | null;
  userId: string | null;
  user: User | null;
  truck: Truck | null;
  isLoggedIn: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  user: null,
  truck: null,
  isLoggedIn: false,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    user: null,
    truck: null,
    isLoggedIn: false,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      const storedUserId = await AsyncStorage.getItem('userId');
      if (storedToken && storedUserId) {
        setAuthState(prev => ({
          ...prev,
          token: storedToken,
          userId: storedUserId,
        }));
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userRef = doc(firestore, 'users', firebaseUser.uid); // Utilisation de doc()
          const userDoc = await getDoc(userRef); // Utilisation de getDoc()
          if (userDoc.exists()) {
            const userData = userDoc.data();
            const newUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              displayName: userData?.displayName || firebaseUser.displayName || '',
              role: userData?.role || 'driver',
              truckAssigned: userData?.truckAssigned,
              photoURL: userData?.photoURL || firebaseUser.photoURL,
              phoneNumber: userData?.phoneNumber || firebaseUser.phoneNumber || '',
            };

            let newTruck: Truck | null = null;
            if (newUser.truckAssigned) {
              const truckRef = doc(firestore, 'trucks', newUser.truckAssigned); // Utilisation de doc()
              const truckDoc = await getDoc(truckRef); // Utilisation de getDoc()
              if (truckDoc.exists()) {
                const truckData = truckDoc.data();
                newTruck = {
                  id: newUser.truckAssigned,
                  model: truckData?.model || '',
                  licensePlate: truckData?.licensePlate || '',
                  currentKm: truckData?.currentKm || 0,
                  lastServiceKm: truckData?.lastServiceKm || 0,
                  nextServiceKm: truckData?.nextServiceKm || 0,
                  lastServiceDate: truckData?.lastServiceDate,
                  fuelEfficiency: truckData?.fuelEfficiency,
                };
              }
            }

            const firebaseToken = await firebaseUser.getIdToken();
            await AsyncStorage.setItem('token', firebaseToken);
            await AsyncStorage.setItem('userId', firebaseUser.uid);
            setAuthState({
              token: firebaseToken,
              userId: firebaseUser.uid,
              user: newUser,
              truck: newTruck,
              isLoggedIn: true,
            });
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des données:', error);
        }
      } else {
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('userId');
        setAuthState({
          token: null,
          userId: null,
          user: null,
          truck: null,
          isLoggedIn: false,
        });
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password); // Syntaxe modulaire
      const firebaseToken = await userCredential.user.getIdToken();
      await AsyncStorage.setItem('token', firebaseToken);
      await AsyncStorage.setItem('userId', userCredential.user.uid);
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.signOut();
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('userId');
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: authState.token,
        userId: authState.userId,
        user: authState.user,
        truck: authState.truck,
        isLoggedIn: authState.isLoggedIn,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};