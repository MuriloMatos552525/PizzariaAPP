import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from 'firebase/auth';
import DateTimePicker from '@react-native-community/datetimepicker';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  'Registrar Vale': { employee: Employee };
  Home: undefined;
};

type ValeRegistrationScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Registrar Vale'>;
type ValeRegistrationScreenRouteProp = RouteProp<RootStackParamList, 'Registrar Vale'>;

type Props = {
  navigation: ValeRegistrationScreenNavigationProp;
  route: ValeRegistrationScreenRouteProp;
};

type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  cpf: string;
  valeTransporte: number;
};

const ValeRegistrationScreen = ({ route, navigation }: Props) => {
  const { employee } = route.params;
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleRegister = async () => {
    try {
      const auth = getAuth();
      if (auth.currentUser) {
        await addDoc(collection(db, 'vales'), {
          employeeName: employee.name,
          title,
          amount: parseFloat(amount),
          date,
        });
        alert('Vale registrado com sucesso');
        setTitle('');
        setAmount('');
        setDate(new Date());
        navigation.navigate('Home');
      } else {
        alert('Usuário não autenticado');
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.label}>Funcionário: {employee.name}</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Título:</Text>
          <TextInput
            style={styles.input}
            placeholder="Título"
            placeholderTextColor="#A0A0A0"
            onChangeText={setTitle}
            value={title}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Valor:</Text>
          <TextInput
            style={styles.input}
            placeholder="Valor"
            placeholderTextColor="#A0A0A0"
            keyboardType="numeric"
            onChangeText={setAmount}
            value={amount}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Data:</Text>
          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
            <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display="default"
              onChange={onChangeDate}
            />
          )}
        </View>
        <TouchableOpacity onPress={handleRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrar Vale</Text>
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
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    height: 50,
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
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
  dateButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default ValeRegistrationScreen;
