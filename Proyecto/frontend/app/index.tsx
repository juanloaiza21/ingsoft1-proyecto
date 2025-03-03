import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native";
import { useRouter } from "expo-router";
import { ConfigVariables } from "./config/config";
import axios from "axios";
import { ApiResponse } from "./types/api-response.type";
import { MsgBox} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Login() {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [fadeAnim] = useState(new Animated.Value(0)); // Animación de fade-in
  const [welcomeVisible, setWelcomeVisible] = useState(false); // Estado para manejar la visibilidad del mensaje

  const router = useRouter(); // para navegar a otra pantalla

  // Animación para el logo
  const logoScale = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.spring(logoScale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();

    appOn();
  });

  const appOn = async () => {
    try {
      const data = await axios.request({
        method: 'GET',
        url: ConfigVariables.api.appOn,
      });
    } catch (error) {
      setMessage('Error de conexión');
      setMessageType('FAILED');
      console.log(error);
    }
  };

  const handleLogin = async (credentials: { email: string, password: string }) => {
    try {
      const petititon = await axios.request({
        method: ConfigVariables.api.auth.login.method,
        url: ConfigVariables.api.auth.login.url,
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      });
      const data: ApiResponse = petititon.data;
      const { result, statusCode } = data;
      if (statusCode !== 200) {
        handleMessage('Usuario o contraseña incorrectos');
      }
      await storeTokens(result.access_token, result.refresh_token);
      
      // Aquí es donde se activa la animación de bienvenida después de un login exitoso
      setWelcomeVisible(true);
      // Animación de desvanecimiento del texto
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 2000,  // Asegúrate de que sea suficientemente largo para visualizar la animación
        useNativeDriver: true,
      }).start();

      setTimeout(() => {
        router.push("/home");
      }, 2000); // Navegar después de 2 segundos (cuando termine la animación)
    } catch (error) {
      console.log(error);
    }
  };

  const storeTokens = async (accessToken: string, refreshToken: string) => {
    try {
      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', refreshToken);
    } catch (error) {
      console.error('Error storing tokens:', error);
    }
  };

  const handleMessage = (newMessage: string, type = 'FAILED') => {
    setMessage(newMessage);
    setMessageType(type);
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require("../assets/images/logo.png")}
          style={[styles.logo, { transform: [{ scale: logoScale }] }]} // Animación de escala
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, username && styles.labelFilled]}>Usuario</Text>
        <TextInput
          style={[styles.input, username && styles.inputFilled]}
          placeholder="Ingresa tu usuario"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={[styles.label, password && styles.labelFilled]}>Contraseña</Text>
        <TextInput
          style={[styles.input, password && styles.inputFilled]}
          placeholder="Ingresa tu contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      <MsgBox type={messageType}>{message}</MsgBox>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLogin({ email: username, password: password })}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Animación de bienvenida */}
      {welcomeVisible && (
        <Animated.Text style={[styles.welcomeText, { opacity: fadeAnim }]}>
          Bienvenido a Owheels 
        </Animated.Text>
      )}

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={styles.registerText}>¿No estás registrado?</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#024059", // Fondo azul oscuro
  },
  logoContainer: {
    backgroundColor: "#fff", // Fondo blanco
    borderRadius: 100, // Bordes redondeados
    padding: 20, // Espaciado alrededor del logo
    marginBottom: 40, // Espacio hacia abajo
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 150,
    height: 150,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#F2C572', // Amarillo claro para los labels
    paddingLeft: 4,
  },
  labelFilled: {
    color: '#1B8CA6', // Color del label cuando el input está lleno
  },
  input: {
    height: 50,
    backgroundColor: '#fff', // Fondo blanco para los campos de entrada
    borderWidth: 1,
    borderColor: '#F2C572',
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#000', // Texto en negro
  },
  inputFilled: {
    backgroundColor: '#F2C572', // Color de fondo cuando el campo está completado
  },
  button: {
    backgroundColor: "#FC9414", // Color naranja para el botón
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff", // Texto blanco en el botón
    fontWeight: "bold",
  },
  registerText: {
    color: "#fff", // Texto blanco para "¿No estás registrado?"
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  welcomeText: {
    fontSize: 24,
    color: '#fff', // Texto blanco para el mensaje de bienvenida
    fontWeight: 'bold',
    marginTop: 20,
  },
});
