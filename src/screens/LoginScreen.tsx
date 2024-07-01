import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Image, Animated, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../services/firebaseConfig'; // Certifique-se de que o caminho esteja correto

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [logoAnimation] = useState(new Animated.Value(0));

  React.useEffect(() => {
    Animated.spring(logoAnimation, {
      toValue: 1,
      speed: 1,
      bounciness: 10,
      useNativeDriver: true,
    }).start();
  }, [logoAnimation]);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('Home');
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
          <Animated.Image source={require('../../assets/logoPizzaria.jpg')} style={[styles.logo, { transform: [{ scale: logoAnimation }] }]} />
          <Text style={styles.title}>Login Administrativo</Text>
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              <FontAwesome name="envelope" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email ID"
                placeholderTextColor="#888"
                onChangeText={setEmail}
                value={email}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.separator} />
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed" size={24} color="#fff" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#888"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
                autoCapitalize="none"
              />
            </View>
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0e0e0e', // Preto
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 30,
    borderRadius: 60, // Fazendo o logotipo ser circular
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff', // Branco
  },
  inputSection: {
    width: '100%',
    backgroundColor: '#1c1c1c', // Preto mais claro para contraste
    borderRadius: 10,
    marginBottom: 20,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#555', // Cor de borda inferior para contraste
    paddingLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#333', // Cor de separação
    marginVertical: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#018037', // Verde
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default LoginScreen;
