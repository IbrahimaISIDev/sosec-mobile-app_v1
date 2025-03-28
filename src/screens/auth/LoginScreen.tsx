import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { useAuth } from "../../hooks/useAuth";

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, loading } = useAuth();

  const handleLogin = async () => {
    try {
      await login(email, password);
    } catch (error) {
      Alert.alert(
        "Erreur",
        "Échec de la connexion. Vérifiez vos identifiants."
      );
      console.error("Erreur de connexion:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Se connecter" onPress={handleLogin} disabled={loading} />
      {loading && <Text>Connexion en cours...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default LoginScreen;

// import React, { useState } from "react";
// import { View, Text, TextInput, Button, StyleSheet } from "react-native";
// import { useAuth } from "../../contexts/AuthContext";
// import { extractTicket } from "../../api/laravelService";

// const LoginScreen = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const { login, token, userId } = useAuth();

//   const handleLogin = async () => {
//     try {
//       await login(email, password);
//       console.log("Connexion réussie !");
//     } catch (error) {
//       console.error("Échec de la connexion :", error);
//     }
//   };

//   const handleExtractTicket = async () => {
//     if (!token || !userId) {
//       console.log("Pas de token ou userId disponible");
//       return;
//     }
//     try {
//       const result = await extractTicket(token, "file:///path/to/image.jpg", {
//         truck_id: "truck123",
//         user_id: userId,
//       });
//       console.log("Ticket extrait :", result);
//     } catch (error) {
//       console.error("Erreur lors de l’extraction du ticket :", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text>Connexion</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Email"
//         value={email}
//         onChangeText={setEmail}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="Mot de passe"
//         value={password}
//         onChangeText={setPassword}
//         secureTextEntry
//       />
//       <Button title="Se connecter" onPress={handleLogin} />
//       <Button title="Extraire un ticket" onPress={handleExtractTicket} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", padding: 16 },
//   input: { borderWidth: 1, padding: 8, marginVertical: 8 },
// });

// export default LoginScreen;
