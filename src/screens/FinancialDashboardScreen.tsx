import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const FinancialDashboardScreen = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [profit, setProfit] = useState(0);
  const [cashBalance, setCashBalance] = useState(0);

  useEffect(() => {
    const fetchFinancialData = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesTotal = salesSnapshot.docs.reduce((total, doc) => total + doc.data().price, 0);

      const expensesCollection = collection(db, 'expenses');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expensesTotal = expensesSnapshot.docs.reduce((total, doc) => total + doc.data().amount, 0);

      const cashRegisterCollection = collection(db, 'cash_register');
      const cashRegisterSnapshot = await getDocs(cashRegisterCollection);
      const latestCashRegister = cashRegisterSnapshot.docs[cashRegisterSnapshot.docs.length - 1].data();

      setTotalSales(salesTotal);
      setTotalExpenses(expensesTotal);
      setProfit(salesTotal - expensesTotal);
      setCashBalance(latestCashRegister.finalBalance);
    };

    fetchFinancialData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Dashboard Financeiro</Text>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorTitle}>Total de Vendas</Text>
        <Text style={styles.indicatorValue}>R${totalSales.toFixed(2)}</Text>
      </View>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorTitle}>Total de Despesas</Text>
        <Text style={styles.indicatorValue}>R${totalExpenses.toFixed(2)}</Text>
      </View>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorTitle}>Lucro/Prejuízo</Text>
        <Text style={styles.indicatorValue}>R${profit.toFixed(2)}</Text>
      </View>
      <View style={styles.indicatorContainer}>
        <Text style={styles.indicatorTitle}>Saldo de Caixa</Text>
        <Text style={styles.indicatorValue}>R${cashBalance.toFixed(2)}</Text>
      </View>
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
  indicatorContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    marginBottom: 10,
  },
  indicatorTitle: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 5,
  },
  indicatorValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default FinancialDashboardScreen;
