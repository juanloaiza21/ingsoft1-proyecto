import React, { useEffect, useRef, useState } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  ActivityIndicator, 
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  Easing
} from "react-native";
import { useRouter } from "expo-router";
import { ConfigVariables } from "./config/config";
import axios from "axios";
import { ApiResponse } from "./types/api-response.type";
import { MsgBox } from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Login() {
  // State
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameFocus, setUsernameFocus] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(50)).current;
  const formOpacity = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  const successAnim = useRef(new Animated.Value(0)).current;
  const circleSize = useRef(new Animated.Value(0)).current;
  const checkmarkStroke = useRef(new Animated.Value(0)).current;

  const router = useRouter();
  
  // Entry animations
  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Logo animation
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 3,
        tension: 40,
        useNativeDriver: true,
      }),
      
      // 2. Form slide in and fade
      Animated.parallel([
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(formOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    appOn();
  }, []);

  const appOn = async () => {
    try {
      await axios.request({
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
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const petition = await axios.request({
        method: ConfigVariables.api.auth.login.method,
        url: ConfigVariables.api.auth.login.url,
        data: {
          email: credentials.email,
          password: credentials.password,
        },
      });
      const data: ApiResponse = petition.data;
      const { result } = data;
      await storeTokens(result.access_token, result.refresh_token);
      
      // Success animation sequence
      animateSuccess();
      
      // Navigate after animations complete
      setTimeout(() => {
        router.push("/home");
      }, 2500);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      handleMessage('Usuario o contraseña incorrectos');
      
      // Shake animation for error
      shakeAnimation();
    }
  };
  
  const shakeAnimation = () => {
    Animated.sequence([
      Animated.timing(buttonAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
      Animated.timing(buttonAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  };
  
  const animateSuccess = () => {
    // Set success animation value to 1
    Animated.timing(successAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    // Circular reveal animation
    Animated.sequence([
      Animated.timing(circleSize, {
        toValue: 1,
        duration: 700,
        useNativeDriver: false,
        easing: Easing.bezier(0.165, 0.84, 0.44, 1),
      }),
      Animated.timing(checkmarkStroke, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
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

  // Button press animation handlers
  const handlePressIn = () => {
    Animated.spring(buttonAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonAnim, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Get screen dimensions
  const { width, height } = Dimensions.get('window');
  
  // Success animation interpolations
  const circleRadius = circleSize.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width * 2]
  });
  
  // Hide form when success animation is active
  const formTransform = successAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <LinearGradient
        colors={["#024059", "#036280", "#024C66"]}
        style={styles.background}
        start={[0, 0]}
        end={[1, 1]}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Success Animation Layer */}
        <Animated.View 
          style={[
            styles.successLayer,
            { opacity: successAnim }
          ]}
          pointerEvents="none"
        >
          <Animated.View style={[
            styles.successCircle,
            {
              width: circleRadius,
              height: circleRadius,
              borderRadius: circleRadius,
            }
          ]}>
            <Animated.View style={[
              styles.checkmarkContainer, 
              { opacity: checkmarkStroke }
            ]}>
              <Ionicons name="checkmark-circle" size={100} color="white" />
              <Animated.Text 
                style={[
                  styles.welcomeText, 
                  { opacity: fadeAnim }
                ]}
              >
                ¡Bienvenido a Owheels!
              </Animated.Text>
            </Animated.View>
          </Animated.View>
        </Animated.View>

        {/* Normal Login Form */}
        <Animated.View style={[
          styles.formContainer,
          { 
            opacity: formOpacity, 
            transform: [
              { translateY: formSlide },
              { scale: formTransform }
            ] 
          }
        ]}>
          <View style={styles.logoContainer}>
            <Animated.Image
              source={require("../assets/images/logo.png")}
              style={[
                styles.logo, 
                { transform: [{ scale: logoScale }] }
              ]}
              resizeMode="contain"
            />
          </View>

          <View style={styles.formContent}>
            <View style={[
              styles.inputContainer,
              usernameFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="person-outline" 
                size={24} 
                color={usernameFocus || username ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#93A9B1"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
                onFocus={() => setUsernameFocus(true)}
                onBlur={() => setUsernameFocus(false)}
              />
            </View>

            <View style={[
              styles.inputContainer,
              passwordFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="lock-closed-outline" 
                size={24} 
                color={passwordFocus || password ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#93A9B1"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            </View>

            {message ? (
              <MsgBox type={messageType}>{message}</MsgBox>
            ) : null}

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleLogin({ email: username, password: password })}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isLoading}
            >
              <Animated.View 
                style={[
                  styles.buttonContainer,
                  { transform: [{ scale: buttonAnim }] }
                ]}
              >
                <LinearGradient
                  colors={["#fc9414", "#f57c00"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.buttonGradient}
                >
                  {isLoading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.registerContainer}
              onPress={() => router.push("/register")}
            >
              <Text style={styles.registerText}>¿No tienes una cuenta? </Text>
              <Text style={styles.registerLink}>Registrate aquí</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignItems: "center",
  },
  logoContainer: {
    backgroundColor: "#fff",
    borderRadius: 100,
    padding: 20,
    marginBottom: 30,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  logo: {
    width: 150,
    height: 150,
    opacity: 0.9,
  },
  formContent: {
    width: '100%',
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 60,
    width: "100%",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputContainerFocused: {
    borderWidth: 2,
    borderColor: "#1B8CA6",
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    height: "100%",
    color: "#024059",
    fontSize: 16,
  },
  buttonContainer: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 200,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  registerText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 16,
  },
  registerLink: {
    color: "#FC9414",
    fontSize: 16,
    fontWeight: "bold",
  },
  successLayer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successCircle: {
    backgroundColor: '#11ac28', // Green color
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },
  checkmarkContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
});
