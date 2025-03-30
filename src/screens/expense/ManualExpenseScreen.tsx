import React from "react";
import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import ExpenseForm from "../../components/expense/ExpenseForm";
import { ExpenseType, ExpenseFormData } from "../../types/expense.types";
import { addToQueue } from "../../queue/queue"; // Alternative pour la file d’attente hors ligne
import { useAuth } from "../../hooks/useAuth";

const ManualExpenseScreen: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { userId, truck } = useAuth(); // Récupérer userId et truck depuis useAuth

  const { expenseType } = route.params as { expenseType: ExpenseType };

  const getExpenseTypeTitle = (type: ExpenseType): string => {
    switch (type) {
      case ExpenseType.FUEL:
        return "Carburant";
      case ExpenseType.OIL:
        return "Huile";
      case ExpenseType.REPAIRS:
        return "Réparations";
      case ExpenseType.OTHER:
        return "Autres";
      default:
        return "Dépense";
    }
  };

  const handleSubmit = async (formData: ExpenseFormData) => {
    const expenseData = {
      ...formData,
      id: Date.now().toString(),
      truck_id: truck?.id || "unknown", // À adapter selon ton contexte
      user_id: userId || "unknown",
      type: expenseType,
    };

    // Ajouter à la file d’attente hors ligne au lieu de Redux
    await addToQueue("", expenseData, "expense"); // imageUri vide si pas d’image

    console.log("Expense submitted:", expenseData);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          Nouvelle Dépense - {getExpenseTypeTitle(expenseType)}
        </Text>
      </View>
      <ExpenseForm expenseType={expenseType} onSubmit={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#0066cc",
  },
  backButton: {
    marginRight: 10,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default ManualExpenseScreen;