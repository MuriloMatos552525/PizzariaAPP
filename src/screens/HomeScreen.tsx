import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp, useFocusEffect } from '@react-navigation/native';

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

  useFocusEffect(
    useCallback(() => {
      fetchEmployeesAndVales();
    }, [])
  );

  if (loading) {
    return <Text style={styles.loadingText}>Carregando...</Text>;
  }

  return (
    <View style={styles.outerContainer}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Vales Q Bella Italia</Text>
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
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#0E0E0E',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingText: {
    color: '#FFFFFF',
  },
  employeeContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  employeeName: {
    fontSize: 18,
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
});

export default HomeScreen;
