import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';

const CashRegisterHistoryScreen = () => {
  const [cashRegisterHistory, setCashRegisterHistory] = useState([]);

  useEffect(() => {
    const fetchCashRegisterHistory = async () => {
      const cashRegisterCollection = collection(db, 'cash_register');
      const cashRegisterSnapshot = await getDocs(cashRegisterCollection);
      const cashRegisterList = cashRegisterSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCashRegisterHistory(cashRegisterList);
    };
    fetchCashRegisterHistory();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={cashRegisterHistory}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>Data: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            <Text style={styles.itemText}>Total de Vendas: R${item.totalSales.toFixed(2)}</Text>
            <Text style={styles.itemText}>Total de Despesas: R${item.totalExpenses.toFixed(2)}</Text>
            <Text style={styles.itemText}>Discrepâncias: R${item.discrepancies.toFixed(2)}</Text>
            <Text style={styles.itemText}>Saldo Final: R${item.finalBalance.toFixed(2)}</Text>
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
  itemContainer: {
    padding: 15,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
    marginBottom: 10,
  },
  itemText: {
    color: '#FFFFFF',
    marginBottom: 5,
  },
});

export default CashRegisterHistoryScreen;
