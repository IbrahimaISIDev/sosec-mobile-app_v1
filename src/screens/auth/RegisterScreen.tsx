import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../hooks/useAuth';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { login, loading } = useAuth(); // Pas de register ici, à ajouter si nécessaire

  const handleRegister = async () => {
    try {
      // Placeholder : simule une inscription puis connexion
      // À remplacer par une vraie logique d'inscription (ex. : Firebase Auth createUserWithEmailAndPassword)
      Alert.alert('Inscription', 'Inscription non implémentée. Connexion simulée.');
      await login(email, password); // Simulé pour le moment
    } catch (error) {
      Alert.alert('Erreur', 'Échec de l’inscription.');
      console.error('Erreur d’inscription:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Inscription</Text>
      <TextInput
        style={styles.input}
        placeholder="Nom d’utilisateur"
        value={displayName}
        onChangeText={setDisplayName}
      />
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
      <Button title="S’inscrire" onPress={handleRegister} disabled={loading} />
      {loading && <Text>Inscription en cours...</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
});

export default RegisterScreen;