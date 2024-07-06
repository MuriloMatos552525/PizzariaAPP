import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  'Fechamento de Caixa': undefined;
  'Histórico de Caixa': undefined;
  'Relatório de Lucros e Perdas': undefined;
  'Análise de Tendências': undefined;
  'Dashboard Financeiro': undefined;
  GestãoFinanceira: undefined;
};

type FinancialManagementScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Gestão Financeira'>;
type FinancialManagementScreenRouteProp = RouteProp<RootStackParamList, 'Gestão Financeira'>;

type Props = {
  navigation: FinancialManagementScreenNavigationProp;
  route: FinancialManagementScreenRouteProp;
};

const FinancialManagementScreen = ({ navigation }: Props) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Gestão Financeira</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Fechamento de Caixa')}>
        <Text style={styles.buttonText}>Fechamento de Caixa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Histórico de Caixa')}>
        <Text style={styles.buttonText}>Histórico de Caixa</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Relatório de Lucros e Perdas')}>
        <Text style={styles.buttonText}>Relatório de Lucros e Perdas</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Análise de Tendências')}>
        <Text style={styles.buttonText}>Análise de Tendências</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Dashboard Financeiro')}>
        <Text style={styles.buttonText}>Dashboard Financeiro</Text>
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
  button: {
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default FinancialManagementScreen;
