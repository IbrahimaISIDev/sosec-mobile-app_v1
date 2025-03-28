import React, { useState } from "react";
import { StyleSheet, View, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../types/navigation.types";
import { useAuth } from "../../contexts/AuthContext";
import { useFirestore } from "../../hooks/useFirestore";
import Camera from "../../components/scan/Camera";
import ScanPreview from "../../components/scan/ScanPreview";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "ScanTicket">;

const ScanTicketScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { user } = useAuth();
  const { addTicketRecord, loading: firestoreLoading } = useFirestore();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = (uri: string) => {
    setImageUri(uri);
  };

  const handleRetake = () => {
    setImageUri(null);
  };

  const handleConfirm = async () => {
    if (!imageUri || !user || !user.truckAssigned) {
      Alert.alert("Erreur", "Aucune image, utilisateur non connecté ou camion non assigné.");
      return;
    }

    setIsProcessing(true);
    try {
      // Simuler l'extraction des données (à remplacer par une API réelle)
      const extractedData = {
        id: "temp-id", // Simulé, sera remplacé par l’ID Firestore
        description: "Ticket carburant - Station Total",
        date: new Date(),
        ticket_num: "TICKET123",
        date_entree: new Date().toISOString(),
        date_sortie: new Date().toISOString(),
        truckId: user.truckAssigned,
        produit: "Carburant",
        poids_net: 0, // Non pertinent pour carburant, ajustable
        chauffeur: user.displayName || "Inconnu",
        amount: 45.75,
        imageUri,
        userId: user.id,
      };

      const result = await addTicketRecord({
        truckId: user.truckAssigned,
        driverId: user.id,
        description: extractedData.description,
        amount: extractedData.amount,
        imageUri,
      });

      if (result.success && result.data) {
        navigation.navigate("ScanResult", {
          ticketData: {
            id: result.data.id, // ID réel de Firestore
            description: result.data.description,
            date: new Date(result.data.date),
            ticket_num: extractedData.ticket_num,
            date_entree: extractedData.date_entree,
            date_sortie: extractedData.date_sortie,
            truckId: user.truckAssigned,
            produit: extractedData.produit,
            poids_net: extractedData.poids_net,
            chauffeur: extractedData.chauffeur,
            amount: result.data.amount,
            imageUri,
            userId: user.id,
          },
          imageUri,
        });
      } else {
        throw new Error(result.message || "Échec de l’enregistrement du ticket");
      }
    } catch (error) {
      console.error("Erreur lors du traitement du ticket :", error);
      Alert.alert(
        "Erreur",
        "Impossible d'extraire ou de sauvegarder les informations du ticket. Veuillez réessayer.",
        [{ text: "OK", onPress: () => setImageUri(null) }]
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {imageUri ? (
        <ScanPreview
          imageUri={imageUri}
          onRetake={handleRetake}
          onConfirm={handleConfirm}
          isProcessing={isProcessing || firestoreLoading}
        />
      ) : (
        <Camera onCapture={handleCapture} onBack={handleBack} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default ScanTicketScreen;