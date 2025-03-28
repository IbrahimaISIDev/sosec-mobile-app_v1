// src/components/home/TaskItem.tsx
import React, { useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TaskItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  status: "todo" | "inprogress" | "completed";
  onPress?: () => void;
}

const TaskItem = ({
  icon,
  title,
  description,
  status,
  onPress,
}: TaskItemProps) => {
  // 🔥 Typage strict pour garantir des icônes valides
  const statusConfig = useMemo(
    () =>
      ({
        todo: { text: "À faire", color: "#FFA726" },
        inprogress: { text: "En cours", color: "#29B6F6" },
        completed: { text: "Complété", color: "#66BB6A" },
      } as const),
    []
  );

  const { text, color } = statusConfig[status];

  // Choix du bon conteneur en fonction de `onPress`
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container style={styles.container} {...(onPress && { onPress })}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={24} color="#0066CC" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Text style={[styles.status, { color }]}>{text}</Text>
    </Container>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  description: {
    fontSize: 14,
    color: "#757575",
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default TaskItem;
