import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import HomeScreen from './src/screens/HomeScreen';
import ValeRegistrationScreen from './src/screens/ValeRegistrationScreen';
import EmployeeRegistrationScreen from './src/screens/EmployeeRegistrationScreen';
import EmployeeDetailsScreen from './src/screens/EmployeeDetailsScreen';
import ConfirmarLimpezaScreen from './src/screens/ConfirmarLimpezaScreen';
import LoginScreen from './src/screens/LoginScreen';
import DeleteEmployeeScreen from './src/screens/DeleteEmployeeScreen';
import CloseCashRegisterScreen from './src/screens/CloseCashRegisterScreen';
import CashRegisterHistoryScreen from './src/screens/CashRegisterHistoryScreen';
import ProfitLossReportScreen from './src/screens/ProfitLossReportScreen';
import TrendAnalysisScreen from './src/screens/TrendAnalysisScreen';
import FinancialDashboardScreen from './src/screens/FinancialDashboardScreen';
import FinancialManagementScreen from './src/screens/FinancialManagementScreen';

const Stack = createStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null; // Ou você pode renderizar um indicador de carregamento aqui
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {user ? (
          <>
            <Stack.Screen 
              name="Home" 
              component={HomeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Registrar Vale" 
              component={ValeRegistrationScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Registrar Funcionário" 
              component={EmployeeRegistrationScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Detalhes do Funcionário" 
              component={EmployeeDetailsScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Confirmar Limpeza" 
              component={ConfirmarLimpezaScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Delete Employee" 
              component={DeleteEmployeeScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Fechamento de Caixa" 
              component={CloseCashRegisterScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Histórico de Caixa" 
              component={CashRegisterHistoryScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Relatório de Lucros e Perdas" 
              component={ProfitLossReportScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Análise de Tendências" 
              component={TrendAnalysisScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Dashboard Financeiro" 
              component={FinancialDashboardScreen} 
              options={{ headerShown: false }} 
            />
            <Stack.Screen 
              name="Gestão Financeira" 
              component={FinancialManagementScreen} 
              options={{ headerShown: false }} 
            />
          </>
        ) : (
          <Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ headerShown: false }} 
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
