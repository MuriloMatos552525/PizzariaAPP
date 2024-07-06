import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const ProfitLossReportScreen = () => {
  const [report, setReport] = useState(null);

  const generateReport = async () => {
    const salesCollection = collection(db, 'sales');
    const salesSnapshot = await getDocs(salesCollection);
    const salesTotal = salesSnapshot.docs.reduce((total, doc) => total + doc.data().price, 0);

    const expensesCollection = collection(db, 'expenses');
    const expensesSnapshot = await getDocs(expensesCollection);
    const expensesTotal = expensesSnapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);

    const profitLoss = salesTotal - expensesTotal;
    setReport({ salesTotal, expensesTotal, profitLoss });
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={generateReport} style={styles.button}>
        <Text style={styles.buttonText}>Gerar Relatório</Text>
      </TouchableOpacity>
      {report && (
        <View style={styles.reportContainer}>
          <Text style={styles.reportText}>Total de Vendas: R${report.salesTotal.toFixed(2)}</Text>
          <Text style={styles.reportText}>Total de Despesas: R${report.expensesTotal.toFixed(2)}</Text>
          <Text style={styles.reportText}>Lucro/Prejuízo: R${report.profitLoss.toFixed(2)}</Text>
        </View>
      )}
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
  reportContainer: {
    padding: 20,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
  },
  reportText: {
    color: '#FFFFFF',
    marginBottom: 10,
  },
});

export default ProfitLossReportScreen;
