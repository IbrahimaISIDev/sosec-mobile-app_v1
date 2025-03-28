import { useState } from "react";
import firestore from "@react-native-firebase/firestore";
import { useAuth } from "./useAuth";
import { addToQueue } from "../queue/queue";
import { extractMileage, storeExpense } from "../api/laravelService";
import { Truck } from "../types/truck.types";
import { Expense } from "../types/expense.types";
import { Mileage } from "../types/mileage.types";
import { HistoryItem } from "../types/history.types";

export const useFirestore = () => {
  const { user, truck, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTruckById = async (truckId: string): Promise<Truck | null> => {
    if (!truckId) return null;
    setLoading(true);
    setError(null);
    try {
      const truckDoc = await firestore()
        .collection("trucks")
        .doc(truckId)
        .get();
      if (truckDoc.exists) {
        return { id: truckDoc.id, ...truckDoc.data() } as Truck;
      }
      return null;
    } catch (err) {
      const errorMsg = "Erreur lors de la récupération du camion";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getLastFuelingForTruck = async (
    truckId: string
  ): Promise<Expense | null> => {
    if (!truckId) return null;
    setLoading(true);
    setError(null);
    try {
      const fuelingSnapshot = await firestore()
        .collection("expenses")
        .where("truckId", "==", truckId)
        .where("type", "==", "fuel")
        .orderBy("date", "desc")
        .limit(1)
        .get();

      if (!fuelingSnapshot.empty) {
        const fuelingDoc = fuelingSnapshot.docs[0];
        return { id: fuelingDoc.id, ...fuelingDoc.data() } as Expense;
      }
      return null;
    } catch (err) {
      const errorMsg = "Erreur lors de la récupération du dernier plein";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTruckMileage = async (
    truckId: string,
    newMileage: number
  ): Promise<{ success: boolean; message?: string }> => {
    if (!truckId || typeof newMileage !== "number") {
      return { success: false, message: "Paramètres invalides" };
    }
    setLoading(true);
    setError(null);
    try {
      await firestore().collection("trucks").doc(truckId).update({
        currentKm: newMileage,
        lastUpdated: firestore.FieldValue.serverTimestamp(),
      });
      return { success: true };
    } catch (err) {
      const errorMsg = "Erreur lors de la mise à jour du kilométrage";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const addMileageRecord = async (record: {
    truckId: string;
    driverId: string;
    imageUri?: string;
  }): Promise<{ success: boolean; data?: Mileage; message?: string }> => {
    if (!record.truckId || !record.driverId || !token) {
      return {
        success: false,
        message: "Paramètres invalides ou token manquant",
      };
    }
    setLoading(true);
    setError(null);
    try {
      if (!navigator.onLine) {
        await addToQueue(
          record.imageUri || "",
          { truckId: record.truckId, driverId: record.driverId },
          "mileage"
        );
        return {
          success: true,
          message: "Ajouté à la file d’attente hors ligne",
        };
      }

      const response = await extractMileage(token, record.imageUri || "", {
        truck_id: record.truckId,
        user_id: record.driverId,
      });
      if (response.success && response.data) {
        const mileageData = response.data;
        await updateTruckMileage(record.truckId, mileageData.kilometer);
        return { success: true, data: mileageData };
      }
      throw new Error("Échec de l’extraction du kilométrage");
    } catch (err) {
      const errorMsg = "Erreur lors de l’ajout du relevé kilométrique";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const addExpenseRecord = async (record: {
    truckId: string;
    driverId: string;
    type: "fuel" | "oil" | "repair";
    amount: number;
    imageUri?: string;
  }): Promise<{ success: boolean; data?: Expense; message?: string }> => {
    if (
      !record.truckId ||
      !record.driverId ||
      !record.type ||
      typeof record.amount !== "number" ||
      !token
    ) {
      return {
        success: false,
        message: "Paramètres invalides ou token manquant",
      };
    }
    setLoading(true);
    setError(null);
    try {
      if (!navigator.onLine) {
        await addToQueue(record.imageUri || "", { ...record }, "expense");
        return {
          success: true,
          message: "Ajouté à la file d’attente hors ligne",
        };
      }

      const response = await storeExpense(
        token,
        {
          truck_id: record.truckId,
          user_id: record.driverId,
          type: record.type,
          amount: record.amount,
        },
        record.imageUri
      );
      if (response.success && response.data) {
        return { success: true, data: response.data };
      }
      throw new Error("Échec de l’enregistrement de la dépense");
    } catch (err) {
      const errorMsg = "Erreur lors de l’ajout de la dépense";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      return { success: false, message: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  const getHistoryItems = async (userId: string): Promise<HistoryItem[]> => {
    if (!userId) return [];
    setLoading(true);
    setError(null);
    try {
      const mileageSnapshot = await firestore()
        .collection("mileage")
        .where("driverId", "==", userId)
        .orderBy("date", "desc")
        .get();

      const expensesSnapshot = await firestore()
        .collection("expenses")
        .where("driverId", "==", userId)
        .orderBy("date", "desc")
        .get();

      const mileageItems: HistoryItem[] = mileageSnapshot.docs.map((doc) => ({
        id: doc.id,
        category: "mileage" as const,
        type: "tableau_bord" as const,
        date: doc.data().date?.toDate() || new Date(),
        mileage: doc.data().kilometer,
        truck_id: doc.data().truckId, 
        user_id: doc.data().driverId, 
        imageUrl: doc.data().imageUrl,
        syncStatus: doc.data().syncStatus || "synced",
        verificationStatus: doc.data().isVerified ? "verified" : "pending",
      }));

      const expenseItems: HistoryItem[] = expensesSnapshot.docs.map((doc) => ({
        id: doc.id,
        category: doc.data().type === "fuel" ? "expense" : "ticket",
        type: (doc.data().type === "fuel"
          ? "carburant"
          : doc.data().type) as HistoryItem["type"],
        date: doc.data().date?.toDate() || new Date(),
        amount: doc.data().amount,
        truck_id: doc.data().truckId, 
        user_id: doc.data().driverId, 
        imageUrl: doc.data().receiptImageUrl,
        syncStatus: doc.data().syncStatus || "synced",
      }));

      return [...mileageItems, ...expenseItems].sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );
    } catch (err) {
      const errorMsg = "Erreur lors de la récupération de l’historique";
      console.error(`${errorMsg}:`, err);
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return {
    getTruckById,
    getLastFuelingForTruck,
    updateTruckMileage,
    addMileageRecord,
    addExpenseRecord,
    getHistoryItems,
    loading,
    error,
  };
};
