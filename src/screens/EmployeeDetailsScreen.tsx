import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { db } from '../services/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const EmployeeDetailsScreen = ({ route, navigation }) => {
  const { employee } = route.params;

  const [salary, setSalary] = useState(employee.salary);
  const [valeTransporte, setValeTransporte] = useState(employee.valeTransporte);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const finalSalary = salary + valeTransporte - (employee.totalVales ? employee.totalVales : 0);

  const handleUpdate = async () => {
    try {
      const employeeRef = doc(db, 'employees', employee.id);
      await updateDoc(employeeRef, {
        salary,
        valeTransporte,
      });
      Alert.alert('Sucesso', 'Informações atualizadas com sucesso');
      setModalVisible(false);
    } catch (error) {
      console.error('Erro ao atualizar funcionário: ', error);
      Alert.alert('Erro', 'Erro ao atualizar informações do funcionário');
    }
  };

  const handleDeletePress = () => {
    setModalVisible(false); // Feche o modal de atualização de salário
    navigation.navigate('Delete Employee', { employeeId: employee.id }); // Navegue para a tela de exclusão
  };

  const sortedVales = employee.vales?.sort((a, b) => b.date.seconds - a.date.seconds);

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
        <TouchableOpacity style={styles.updateButton} onPress={() => setModalVisible(true)}>
          <Text style={styles.updateButtonText}>Alterar Informações</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedVales}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.valeContainer}>
            <Text style={styles.valeTitle}>Título: {item.title}</Text>
            <Text style={styles.text}>Valor: R${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
            <Text style={styles.text}>Data: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
          </View>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alterar Informações</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Salário:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={salary.toString()}
                onChangeText={text => setSalary(parseFloat(text))}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Vale Transporte:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={valeTransporte.toString()}
                onChangeText={text => setValeTransporte(parseFloat(text))}
              />
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleUpdate}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.deleteButton} onPress={handleDeletePress}>
              <Text style={styles.deleteButtonText}>Apagar Funcionário</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  updateButton: {
    backgroundColor: '#018037',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
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
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
  },
  inputContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 18,
    color: '#A0A0A0',
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#FFFFFF',
    color: '#000',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    backgroundColor: '#018037',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});

export default EmployeeDetailsScreen;
