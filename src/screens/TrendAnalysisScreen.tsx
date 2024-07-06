import React, { useState, useEffect } from 'react';
import { View, Text, Dimensions, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import { LineChart } from 'react-native-chart-kit';

const TrendAnalysisScreen = () => {
  const [salesData, setSalesData] = useState([]);
  const [expensesData, setExpensesData] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchTrendData = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => ({
        date: new Date(doc.data().date.seconds * 1000),
        amount: doc.data().price,
      }));

      const expensesCollection = collection(db, 'expenses');
      const expensesSnapshot = await getDocs(expensesCollection);
      const expensesList = expensesSnapshot.docs.map(doc => ({
        date: new Date(doc.data().date.seconds * 1000),
        amount: doc.data().amount,
      }));

      const dates = [...new Set(salesList.concat(expensesList).map(item => item.date.toLocaleDateString()))];
      setLabels(dates);

      const salesAmounts = dates.map(date => {
        const total = salesList
          .filter(sale => sale.date.toLocaleDateString() === date)
          .reduce((sum, sale) => sum + sale.amount, 0);
        return total;
      });

      const expensesAmounts = dates.map(date => {
        const total = expensesList
          .filter(expense => expense.date.toLocaleDateString() === date)
          .reduce((sum, expense) => sum + expense.amount, 0);
        return total;
      });

      setSalesData(salesAmounts);
      setExpensesData(expensesAmounts);
    };

    fetchTrendData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Análise de Tendências</Text>
      <LineChart
        data={{
          labels: labels,
          datasets: [
            {
              data: salesData,
              color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`, // Verde
              strokeWidth: 2,
            },
            {
              data: expensesData,
              color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`, // Vermelho
              strokeWidth: 2,
            },
          ],
        }}
        width={Dimensions.get('window').width - 30}
        height={220}
        yAxisLabel="R$"
        chartConfig={{
          backgroundColor: '#000',
          backgroundGradientFrom: '#000',
          backgroundGradientTo: '#000',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
          propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: '#ffa726',
          },
        }}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: 16,
        }}
      />
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
});

export default TrendAnalysisScreen;
