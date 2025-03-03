import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  Platform, 
  ScrollView, 
  Animated,
  Dimensions,
  Easing,
  Pressable,
  KeyboardAvoidingView
} from 'react-native';
import { useRouter } from 'expo-router';
import { MsgBox } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Role } from './enums/role.enum';
import axios from 'axios';
import { ConfigVariables } from './config/config';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [id, setId] = useState<string>('');
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  
  // Focus state for inputs
  const [idFocus, setIdFocus] = useState<boolean>(false);
  const [nameFocus, setNameFocus] = useState<boolean>(false);
  const [emailFocus, setEmailFocus] = useState<boolean>(false);
  const [phoneFocus, setPhoneFocus] = useState<boolean>(false);
  const [passwordFocus, setPasswordFocus] = useState<boolean>(false);
  const [confirmPasswordFocus, setConfirmPasswordFocus] = useState<boolean>(false);
  
  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(1)).current;
  
  // Input animations with staggered delay
  const inputAnims = Array(6).fill(0).map((_, i) => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    // Sequence of animations
    Animated.sequence([
      // 1. Header animation
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // 2. Form slide in and fade
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.out(Easing.back(1.5)),
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // 3. Staggered animation for inputs
      Animated.stagger(100, 
        inputAnims.map(anim => 
          Animated.spring(anim, {
            toValue: 1,
            tension: 40,
            friction: 7,
            useNativeDriver: true,
          })
        )
      )
    ]).start();
  }, []);

  // Función para validar que todos los campos estén completos
  const isFormValid = (): boolean => {
    if (!name || !email || !password || !confirmPassword || !phoneNumber) return false;
    if (phoneNumber && /\D/.test(phoneNumber)) return false;
    if (name && /\d/.test(name)) return false;
    if (password !== confirmPassword) return false;
    
    return true;
  };

  useEffect(() => {
    if (name && /\d/.test(name)) {
      setMessage("El nombre solo debe contener letras");
      setMessageType("error");
    } else if (name && message === "El nombre solo debe contener letras") {
      setMessage("");
      setMessageType("");
    }
  }, [name]);

  useEffect(() => {
    if (phoneNumber && /\D/.test(phoneNumber)) {
      setMessage("El teléfono solo debe contener números");
      setMessageType("error");
    } else if (phoneNumber && message === "El teléfono solo debe contener números") {
      setMessage("");
      setMessageType("");
    }
  }, [phoneNumber]);

  // Actualizar mensaje basado en el estado del formulario
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setMessageType("error");
    } else if (password && confirmPassword && message === "Las contraseñas no coinciden") {
      setMessage("");
      setMessageType("");
    }
  }, [password, confirmPassword]);

  // Button animation handlers
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

  // Función para manejar el registro
  const handleRegister = async (input: {
    "id": number,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "password": string,
    "birthDate": Date
  }) => {
    if (isFormValid()) {
      try {
        const birthDate = input.birthDate.toISOString();
        const role: Role = Role.USER;
        await axios.request({
          method: ConfigVariables.api.user.create.method,
          url: ConfigVariables.api.user.create.url,
          data: {
            id: input.id,
            name: input.name,
            email: input.email,
            phoneNumber: input.phoneNumber,
            password: input.password,
            birthDate: birthDate,
            role: role
          }
        });
        Alert.alert(
          "Registro exitoso",
          "Tu cuenta ha sido creada satisfactoriamente",
          [
            { 
              text: "Iniciar sesión", 
              onPress: () => router.push("..") 
            }
          ]
        );
      } catch (error) {
        setMessage("Error creando usuario");
        setMessageType("error");
        console.log(error);
        
        // Shake animation for error
        Animated.sequence([
          Animated.timing(buttonAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
          Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
          Animated.timing(buttonAnim, { toValue: 1.05, duration: 100, useNativeDriver: true }),
          Animated.timing(buttonAnim, { toValue: 0.95, duration: 100, useNativeDriver: true }),
          Animated.timing(buttonAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start();
      }
    } else {
      if (password && confirmPassword && password !== confirmPassword) {
        Alert.alert(
          "Error",
          "Las contraseñas no coinciden",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Error",
          "Por favor completa todos los campos requeridos",
          [{ text: "OK" }]
        );
      }
    }
  };

  const toggleDatePicker = () => {
    setShow(!show);
  };

  const onChange = ({ type }, selectedDate: any) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setBirthDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
        setBirthDate(currentDate);
      }
    } else {
      toggleDatePicker();
    }
  }

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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View 
          style={[
            styles.headerContainer,
            { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [-30, 0]
            }) }] }
          ]}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="person-add" size={40} color="white" />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a Owheels para comenzar a viajar</Text>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.formContainer,
            { 
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Animated.View style={{ 
            opacity: inputAnims[0], 
            transform: [{ translateY: inputAnims[0].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
            <View style={[
              styles.inputContainer,
              idFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="card-outline" 
                size={24} 
                color={idFocus || id ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, id && styles.inputFilled]}
                placeholder="Número de identificación"
                value={id}
                onChangeText={setId}
                keyboardType="numeric"
                onFocus={() => setIdFocus(true)}
                onBlur={() => setIdFocus(false)}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ 
            opacity: inputAnims[1], 
            transform: [{ translateY: inputAnims[1].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
            <View style={[
              styles.inputContainer,
              nameFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="person-outline" 
                size={24} 
                color={nameFocus || name ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, name && styles.inputFilled]}
                placeholder="Nombre completo"
                value={name}
                onChangeText={setName}
                onFocus={() => setNameFocus(true)}
                onBlur={() => setNameFocus(false)}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ 
            opacity: inputAnims[2], 
            transform: [{ translateY: inputAnims[2].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
            <View style={[
              styles.inputContainer,
              emailFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="mail-outline" 
                size={24} 
                color={emailFocus || email ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, email && styles.inputFilled]}
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ 
            opacity: inputAnims[3], 
            transform: [{ translateY: inputAnims[3].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
            <View style={[
              styles.inputContainer,
              phoneFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="call-outline" 
                size={24} 
                color={phoneFocus || phoneNumber ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, phoneNumber && styles.inputFilled]}
                placeholder="Número de celular"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="numeric"
                onFocus={() => setPhoneFocus(true)}
                onBlur={() => setPhoneFocus(false)}
              />
            </View>
          </Animated.View>

          <Animated.View style={{ 
            opacity: inputAnims[4], 
            transform: [{ translateY: inputAnims[4].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
            <View style={styles.inputContainer}>
              <Ionicons 
                name="calendar-outline" 
                size={24} 
                color="#1B8CA6" 
                style={styles.inputIcon} 
              />
              {show && (
                <DateTimePicker
                  mode='date'
                  display='spinner'
                  value={birthDate}
                  onChange={onChange}
                  maximumDate={new Date()}
                />
              )}
              {!show && (
                <Pressable 
                  onPress={toggleDatePicker}
                  style={styles.datePickerButton}
                >
                  <Text style={styles.dateText}>
                    {birthDate.toDateString()}
                  </Text>
                </Pressable>
              )}
            </View>
          </Animated.View>

          <Animated.View style={{ 
            opacity: inputAnims[5], 
            transform: [{ translateY: inputAnims[5].interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0]
            }) }] 
          }}>
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
                style={[styles.input, password && styles.inputFilled]}
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                onFocus={() => setPasswordFocus(true)}
                onBlur={() => setPasswordFocus(false)}
              />
            </View>

            <View style={[
              styles.inputContainer,
              confirmPasswordFocus && styles.inputContainerFocused
            ]}>
              <Ionicons 
                name="shield-checkmark-outline" 
                size={24} 
                color={confirmPasswordFocus || confirmPassword ? "#1B8CA6" : "#93A9B1"} 
                style={styles.inputIcon} 
              />
              <TextInput
                style={[styles.input, confirmPassword && styles.inputFilled]}
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                onFocus={() => setConfirmPasswordFocus(true)}
                onBlur={() => setConfirmPasswordFocus(false)}
              />
            </View>
          </Animated.View>

          {message ? (
            <MsgBox type={messageType}>{message}</MsgBox>
          ) : null}

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => {
                handleRegister({
                  id: parseInt(id),
                  name: name,
                  email: email,
                  phoneNumber: phoneNumber,
                  password: password,
                  birthDate: birthDate
                });
              }}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={!isFormValid()}
            >
              <Animated.View
                style={[
                  { transform: [{ scale: buttonAnim }] },
                  !isFormValid() && styles.buttonDisabled
                ]}
              >
                <LinearGradient
                  colors={["#fc9414", "#f57c00"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.button}
                >
                  <Text style={styles.buttonText}>Crear Cuenta</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Text style={styles.secondaryButtonText}>Ya tengo una cuenta</Text>
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
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(27, 140, 166, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FC9414',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
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
  inputFilled: {
    color: "#024059",
  },
  datePickerButton: {
    flex: 1,
    height: "100%",
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: "#024059",
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 10,
  },
  button: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryButtonText: {
    color: "#FC9414",
    fontSize: 16,
    fontWeight: '600',
  },
});
