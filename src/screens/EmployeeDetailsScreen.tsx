import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Platform, StatusBar, TouchableOpacity, Modal, TextInput, Alert, Keyboard } from 'react-native';
import { db } from '../services/firebaseConfig';
import { doc, updateDoc, collection, getDocs, query, where, writeBatch, deleteDoc } from 'firebase/firestore';
import { Swipeable } from 'react-native-gesture-handler';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

const EmployeeDetailsScreen = ({ route, navigation }) => {
  const { employee } = route.params;

  const [salary, setSalary] = useState(employee.salary);
  const [valeTransporte, setValeTransporte] = useState(employee.valeTransporte);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedVale, setSelectedVale] = useState(null);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

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

  const handleDeleteVales = async () => {
    try {
      const valesQuery = query(collection(db, 'vales'), where('employeeName', '==', employee.name));
      const valesSnapshot = await getDocs(valesQuery);
      const batch = writeBatch(db);

      valesSnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      Alert.alert('Sucesso', 'Todos os vales do funcionário foram limpos.');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao apagar vales: ', error);
      Alert.alert('Erro', 'Erro ao apagar os vales do funcionário');
    }
  };

  const handleDeleteVale = async (id) => {
    try {
      await deleteDoc(doc(db, 'vales', id));
      Alert.alert('Sucesso', 'Vale apagado com sucesso.');
      // Atualizar a lista de vales após a exclusão
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao apagar vale: ', error);
      Alert.alert('Erro', 'Erro ao apagar o vale');
    }
  };

  const handleEditVale = async () => {
    try {
      if (selectedVale) {
        const valeRef = doc(db, 'vales', selectedVale.id);
        await updateDoc(valeRef, {
          title,
          amount: parseFloat(amount),
          date,
        });
        Alert.alert('Sucesso', 'Vale atualizado com sucesso.');
        setEditModalVisible(false);
        // Atualizar a lista de vales após a alteração
        navigation.navigate('Home');
      }
    } catch (error) {
      console.error('Erro ao atualizar vale: ', error);
      Alert.alert('Erro', 'Erro ao atualizar o vale');
    }
  };

  const openEditModal = (vale) => {
    setSelectedVale(vale);
    setTitle(vale.title);
    setAmount(vale.amount.toString());
    setDate(new Date(vale.date.seconds * 1000));
    setEditModalVisible(true);
  };

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const renderRightActions = (vale) => (
    <View style={styles.swipeContainer}>
      <TouchableOpacity style={styles.iconButton} onPress={() => openEditModal(vale)}>
        <Icon name="edit" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.iconButton, styles.deleteButton]} onPress={() => handleDeleteVale(vale.id)}>
        <Icon name="trash" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );

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
        <TouchableOpacity style={styles.cleanButton} onPress={handleDeleteVales}>
          <Text style={styles.cleanButtonText}>Limpar Vales</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={sortedVales}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <Swipeable renderRightActions={() => renderRightActions(item)}>
            <View style={styles.valeContainer}>
              <Text style={styles.valeTitle}>Título: {item.title}</Text>
              <Text style={styles.text}>Valor: R${item.amount ? item.amount.toFixed(2) : '0.00'}</Text>
              <Text style={styles.text}>Data: {new Date(item.date.seconds * 1000).toLocaleDateString()}</Text>
            </View>
          </Swipeable>
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
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Alterar Vale</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Título:</Text>
              <TextInput
                style={styles.input}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Valor:</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={amount}
                onChangeText={setAmount}
                onBlur={() => Keyboard.dismiss()}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Data:</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
                <Text style={styles.dateButtonText}>{date.toLocaleDateString()}</Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleEditVale}>
                <Text style={styles.modalButtonText}>Salvar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={() => setEditModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
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
  cleanButton: {
    backgroundColor: '#D32F2F',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  cleanButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
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
  swipeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  iconButton: {
    backgroundColor: '#018037',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: 75,
  },
  dateButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#A0A0A0',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#1C1C1C',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
});

export default EmployeeDetailsScreen;
