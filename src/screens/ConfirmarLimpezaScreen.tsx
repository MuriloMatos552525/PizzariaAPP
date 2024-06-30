import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import { collection, getDocs, deleteDoc, writeBatch } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  'Confirmar Limpeza': undefined;
  Home: undefined;
};

type ConfirmarLimpezaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Confirmar Limpeza'>;
type ConfirmarLimpezaScreenRouteProp = RouteProp<RootStackParamList, 'Confirmar Limpeza'>;

type Props = {
  navigation: ConfirmarLimpezaScreenNavigationProp;
  route: ConfirmarLimpezaScreenRouteProp;
};

const ConfirmarLimpezaScreen = ({ navigation }: Props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCleanVales = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const valesCollection = collection(db, 'vales');
      const valesSnapshot = await getDocs(valesCollection);
      const batch = writeBatch(db);
      valesSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();
      Alert.alert('Sucesso', 'Todos os vales foram limpos.');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Confirme sua Identidade</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        onChangeText={setEmail}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        placeholderTextColor="#A0A0A0"
        onChangeText={setPassword}
        value={password}
        secureTextEntry
      />
      <TouchableOpacity onPress={handleCleanVales} style={styles.button}>
        <Text style={styles.buttonText}>Confirmar Limpeza</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#0E0E0E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#FFFFFF',
    backgroundColor: '#1C1C1C',
  },
  button: {
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default ConfirmarLimpezaScreen;
