// app/login.tsx
import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
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

  const router = useRouter(); //para navegar a otra pantalla

  useEffect(() => {
    appOn();
  });
  
  const appOn = async () => {
    try {
      const data = await axios.request({
        method: 'GET',
        url: ConfigVariables.api.appOn,
      })
    } catch (error) {
      setMessage('Error de conexión');
      setMessageType('FAILED');
      console.log(error);
    } 
  }

  const handleLogin = async (credentials: {email: string, password: string}) => {
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
      const {result, statusCode} = data;
      if (statusCode != 200 ) {
        handleMessage('Usuario o contraseña incorrectos');    
      }
      await storeTokens(result.access_token, result.refresh_token);
      router.push("/home")
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
        <Image
          source={require("../assets/images/logo.png")}
          style={styles.logo}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <MsgBox type = {messageType}>{message}</MsgBox>
      <TouchableOpacity
        style={styles.button}
        onPress={() => handleLogin({email: username, password: password})}
      >
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <View style={styles.registerContainer}>
        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.registerText}>¿No estás registrado? </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 100,
  },
  logo: {
    width: 200,
    height: 200,
    opacity: 0.4,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  registerContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  registerText: {
    color: "#666",
  },
  registerLink: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
