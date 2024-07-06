import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert, SafeAreaView, Platform, StatusBar, Modal, FlatList, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { db } from '../services/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const CloseCashRegisterScreen = ({ navigation }) => {
  const [totalSales, setTotalSales] = useState('');
  const [pixExpenses, setPixExpenses] = useState('');
  const [cashExpenses, setCashExpenses] = useState('');
  const [cardExpenses, setCardExpenses] = useState('');
  const [initialCash, setInitialCash] = useState('');
  const [discrepancies, setDiscrepancies] = useState('');
  const [finalBalance, setFinalBalance] = useState('');
  const [expenseModalVisible, setExpenseModalVisible] = useState(false);
  const [expenseDescription, setExpenseDescription] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    const totalExpensesAmount = calculateTotalExpenses();
    const calculatedFinalBalance = (parseFloat(totalSales) || 0) - totalExpensesAmount + (parseFloat(initialCash) || 0);
    const discrepancy = calculatedFinalBalance - (parseFloat(initialCash) || 0);

    setFinalBalance(calculatedFinalBalance.toFixed(2));
    setDiscrepancies(discrepancy.toFixed(2));
  }, [totalSales, pixExpenses, cashExpenses, cardExpenses, initialCash, expenses]);

  const handleAddExpense = () => {
    if (!expenseDescription || !expenseAmount) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos da despesa.');
      return;
    }
    setExpenses([...expenses, { description: expenseDescription, amount: parseFloat(expenseAmount) }]);
    setExpenseDescription('');
    setExpenseAmount('');
    setExpenseModalVisible(false);
  };

  const calculateTotalExpenses = () => {
    const totalOtherExpenses = expenses.reduce((acc, expense) => acc + expense.amount, 0);
    return (parseFloat(pixExpenses) || 0) + (parseFloat(cashExpenses) || 0) + (parseFloat(cardExpenses) || 0) + totalOtherExpenses;
  };

  const handleCloseCashRegister = async () => {
    if (!totalSales || !pixExpenses || !cashExpenses || !cardExpenses || !initialCash) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos.');
      return;
    }

    const totalExpensesAmount = calculateTotalExpenses();
    const calculatedFinalBalance = parseFloat(totalSales) - totalExpensesAmount + parseFloat(initialCash);
    const discrepancy = calculatedFinalBalance - parseFloat(initialCash);

    try {
      await addDoc(collection(db, 'cash_register'), {
        totalSales: parseFloat(totalSales),
        pixExpenses: parseFloat(pixExpenses),
        cashExpenses: parseFloat(cashExpenses),
        cardExpenses: parseFloat(cardExpenses),
        initialCash: parseFloat(initialCash),
        totalExpenses: totalExpensesAmount,
        discrepancies: discrepancy,
        finalBalance: calculatedFinalBalance,
        otherExpenses: expenses,
        date: new Date(),
      });
      Alert.alert('Sucesso', 'Fechamento de caixa registrado com sucesso');
      setTotalSales('');
      setPixExpenses('');
      setCashExpenses('');
      setCardExpenses('');
      setInitialCash('');
      setExpenses([]);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Fechamento de Caixa</Text>
        <TextInput
          style={styles.input}
          placeholder="Total de Vendas"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setTotalSales}
          value={totalSales}
        />
        <TextInput
          style={styles.input}
          placeholder="Troco Inicial"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setInitialCash}
          value={initialCash}
        />
        <Text style={styles.subtitle}>Despesas</Text>
        <TextInput
          style={styles.input}
          placeholder="PIX"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setPixExpenses}
          value={pixExpenses}
        />
        <TextInput
          style={styles.input}
          placeholder="Dinheiro"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setCashExpenses}
          value={cashExpenses}
        />
        <TextInput
          style={styles.input}
          placeholder="Cartão"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          onChangeText={setCardExpenses}
          value={cardExpenses}
        />
        <TouchableOpacity onPress={() => setExpenseModalVisible(true)} style={styles.button}>
          <Text style={styles.buttonText}>Adicionar Despesa</Text>
        </TouchableOpacity>
        <FlatList
          data={expenses}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.expenseItem}>
              <Text style={styles.expenseText}>{item.description}: R${item.amount.toFixed(2)}</Text>
            </View>
          )}
        />
        <TextInput
          style={styles.input}
          placeholder="Discrepâncias"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          value={discrepancies}
          editable={false}
        />
        <TextInput
          style={styles.input}
          placeholder="Saldo Final"
          placeholderTextColor="#A0A0A0"
          keyboardType="numeric"
          value={finalBalance}
          editable={false}
        />
        <TouchableOpacity onPress={handleCloseCashRegister} style={styles.button}>
          <Text style={styles.buttonText}>Registrar Fechamento</Text>
        </TouchableOpacity>

        <Modal
          visible={expenseModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setExpenseModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Adicionar Despesa</Text>
              <TextInput
                style={styles.input}
                placeholder="Descrição da Despesa"
                placeholderTextColor="#A0A0A0"
                onChangeText={setExpenseDescription}
                value={expenseDescription}
              />
              <TextInput
                style={styles.input}
                placeholder="Valor da Despesa"
                placeholderTextColor="#A0A0A0"
                keyboardType="numeric"
                onChangeText={setExpenseAmount}
                value={expenseAmount}
              />
              <TouchableOpacity onPress={handleAddExpense} style={styles.button}>
                <Text style={styles.buttonText}>Adicionar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setExpenseModalVisible(false)} style={[styles.button, styles.cancelButton]}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10,
  },
  input: {
    height: 50,
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
    color: '#FFFFFF',
    backgroundColor: '#1C1C1C',
  },
  button: {
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  expenseItem: {
    backgroundColor: '#2E2E2E',
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
  },
  expenseText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#1C1C1C',
    borderRadius: 8,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  cancelButton: {
    backgroundColor: '#D32F2F',
  },
});

export default CloseCashRegisterScreen;
