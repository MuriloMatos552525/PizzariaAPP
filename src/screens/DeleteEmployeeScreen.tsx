import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, Platform, StatusBar } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebaseConfig';
import { deleteDoc, doc } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  'Delete Employee': { employeeId: string };
  Home: undefined;
};

type DeleteEmployeeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Delete Employee'>;
type DeleteEmployeeScreenRouteProp = RouteProp<RootStackParamList, 'Delete Employee'>;

type Props = {
  navigation: DeleteEmployeeScreenNavigationProp;
  route: DeleteEmployeeScreenRouteProp;
};

const DeleteEmployeeScreen = ({ navigation, route }: Props) => {
  const { employeeId } = route.params;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleDelete = async () => {
    const auth = getAuth();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      await deleteDoc(doc(db, 'employees', employeeId));
      Alert.alert('Sucesso', 'Funcionário apagado com sucesso');
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
      <TouchableOpacity onPress={handleDelete} style={styles.button}>
        <Text style={styles.buttonText}>Confirmar</Text>
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

export default DeleteEmployeeScreen;
