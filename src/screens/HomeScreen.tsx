import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db, auth } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { signOut } from "firebase/auth";
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

type RootStackParamList = {
  'Registrar Vale': { employee: Employee };
  'Registrar Funcionário': undefined;
  'Detalhes do Funcionário': { employee: Employee };
  'Confirmar Limpeza': undefined;
  Home: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
type HomeScreenRouteProp = RouteProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: HomeScreenRouteProp;
};

type Employee = {
  id: string;
  name: string;
  position: string;
  salary: number;
  vales?: Vale[];
  totalVales?: number;
};

type Vale = {
  id: string;
  employeeName: string;
  title: string;
  amount: number;
  date: { seconds: number };
};

const HomeScreen = ({ navigation }: Props) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEmployeesAndVales = async () => {
    try {
      const employeeCollection = collection(db, 'employees');
      const employeeSnapshot = await getDocs(employeeCollection);
      const employeeList = employeeSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Employee[];

      const valesCollection = collection(db, 'vales');
      const valesSnapshot = await getDocs(valesCollection);
      const valesList = valesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Vale[];

      employeeList.forEach(employee => {
        const employeeVales = valesList.filter(vale => vale.employeeName.trim() === employee.name.trim());
        employee.vales = employeeVales;
        employee.totalVales = employeeVales.reduce((acc, vale) => acc + vale.amount, 0);
      });

      // Ordenar a lista de funcionários em ordem alfabética
      employeeList.sort((a, b) => a.name.localeCompare(b.name));

      setEmployees(employeeList);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar funcionários e vales: ", error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navega para a tela de login após deslogar
    } catch (error) {
      console.error("Erro ao deslogar: ", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchEmployeesAndVales();
    }, [])
  );

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  return (
    <SafeAreaView style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Vales Q Bella Italia</Text>
        </View>
        <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Registrar Funcionário')}>
          <Text style={styles.registerButtonText}>Registrar Funcionário</Text>
        </TouchableOpacity>
        <FlatList
          data={employees}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.employeeContainer}>
              <Text style={styles.employeeName}>{item.name}</Text>
              <Text style={styles.employeePosition}>{item.position}</Text>
              <Text style={styles.totalVales}>Total de Vales: R${item.totalVales?.toFixed(2)}</Text>
              <TouchableOpacity
                style={styles.expandButton}
                onPress={() => navigation.navigate('Detalhes do Funcionário', { employee: item })}
              >
                <Text style={styles.expandButtonText}>Detalhes</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.registerValeButton}
                onPress={() => navigation.navigate('Registrar Vale', { employee: item })}
              >
                <Text style={styles.registerButtonText}>Registrar Vale</Text>
              </TouchableOpacity>
            </View>
          )}
        />
        <TouchableOpacity style={styles.cleanButton} onPress={() => navigation.navigate('Confirmar Limpeza')}>
          <Text style={styles.cleanButtonText}>Limpar Vales</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0E0E0E',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 20,
  },
  employeeContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  employeeName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  employeePosition: {
    fontSize: 16,
    color: '#A0A0A0',
    marginBottom: 10,
  },
  totalVales: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  expandButton: {
    backgroundColor: '#018037',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  expandButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
  },
  registerValeButton: {
    backgroundColor: '#018037',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  cleanButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  cleanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  logoutButton: {
    padding: 10,
  },
});

export default HomeScreen;
