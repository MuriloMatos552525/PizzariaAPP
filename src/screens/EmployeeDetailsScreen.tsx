import React from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';

const EmployeeDetailsScreen = ({ route }) => {
  const { employee } = route.params;

  const finalSalary = employee.salary + employee.valeTransporte - (employee.totalVales ? employee.totalVales : 0);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.employeeName}>{employee.name}</Text>
        <Text style={styles.employeeCpf}>CPF: {employee.cpf}</Text>
        <Text style={styles.employeePosition}>Função: {employee.position}</Text>
        <Text style={styles.employeeSalary}>Salário: R${employee.salary ? employee.salary.toFixed(2) : '0.00'}</Text>
        <Text style={styles.employeeValeTransporte}>Vale Transporte: R${employee.valeTransporte ? employee.valeTransporte.toFixed(2) : '0.00'}</Text>
        <Text style={styles.totalVales}>Total de Vales: R${employee.totalVales ? employee.totalVales.toFixed(2) : '0.00'}</Text>
        <Text style={styles.finalSalary}>Salário Final: R${finalSalary.toFixed(2)}</Text>
      </View>
      <FlatList
        data={employee.vales}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.valeContainer}>
            <Text style={styles.valeTitle}>Título: {item.title}</Text>
            <Text style={styles.text}>Valor: R${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
            <Text style={styles.text}>Data: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    padding: 20,
    backgroundColor: '#0E0E0E',
  },
  header: {
    marginBottom: 20,
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  employeeName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },
  employeeCpf: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 10,
  },
  employeePosition: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 10,
  },
  employeeSalary: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  employeeValeTransporte: {
    fontSize: 18,
    color: '#FFFFFF',
    marginBottom: 10,
  },
  totalVales: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  finalSalary: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 10,
    fontWeight: 'bold',
  },
  valeContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  valeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  text: {
    color: '#FFFFFF',
  },
});

export default EmployeeDetailsScreen;
