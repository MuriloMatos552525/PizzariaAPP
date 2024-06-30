import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';

const EmployeeRegistrationScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [position, setPosition] = useState('');
  const [salary, setSalary] = useState('');
  const [valeTransporte, setValeTransporte] = useState('');

  const handleRegister = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await addDoc(collection(db, 'employees'), {
          name,
          cpf,
          position,
          salary: parseFloat(salary),
          valeTransporte: parseFloat(valeTransporte),
        });
        alert('Funcionário registrado com sucesso');
        setName('');
        setCpf('');
        setPosition('');
        setSalary('');
        setValeTransporte('');
        navigation.navigate('Home');
      } else {
        alert('Usuário não autenticado');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.label}>Nome:</Text>
        <TextInput
          style={styles.input}
          placeholder="Nome"
          placeholderTextColor="#A0A0A0"
          onChangeText={setName}
          value={name}
        />
        <Text style={styles.label}>CPF:</Text>
        <TextInput
          style={styles.input}
          placeholder="CPF"
          placeholderTextColor="#A0A0A0"
          onChangeText={setCpf}
          value={cpf}
        />
        <Text style={styles.label}>Função:</Text>
        <TextInput
          style={styles.input}
          placeholder="Função"
          placeholderTextColor="#A0A0A0"
          onChangeText={setPosition}
          value={position}
        />
        <Text style={styles.label}>Salário:</Text>
        <TextInput
          style={styles.input}
          placeholder="Salário"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setSalary}
          value={salary}
        />
        <Text style={styles.label}>Vale Transporte:</Text>
        <TextInput
          style={styles.input}
          placeholder="Vale Transporte"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setValeTransporte}
          value={valeTransporte}
        />
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrar Funcionário</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
    backgroundColor: '#0E0E0E',
  },
  input: {
    height: 50,
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    color: '#FFFFFF',
    backgroundColor: '#1C1C1C',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#FFFFFF',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EmployeeRegistrationScreen;
