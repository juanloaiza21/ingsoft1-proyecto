// app/register.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { MsgBox } from './styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Role } from './enums/role.enum';
import axios from 'axios';
import { ConfigVariables } from './config/config';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>(''); // New state for password confirmation
  const [id, setId] = useState<string>('');
  const [message, setMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);

  // Función para validar que todos los campos estén completos
  // Función para validar que todos los campos estén completos
  const isFormValid = (): boolean => {
    if (!name || !email || !password || !confirmPassword || !phoneNumber) return false;
    if (phoneNumber && /\D/.test(phoneNumber)) return false
    if (name && /\d/.test(name)) return false;
    if (password !== confirmPassword) return false;
    
    return true;
  };

  useEffect(() => {
    if (name && /\d/.test(name)) {
      setMessage("El nombre solo debe contener letras");
      setMessageType("error");
    }
  });

  useEffect(() =>{
    if (phoneNumber && /\D/.test(phoneNumber)) {
      setMessage("El teléfono solo debe contener números");
      setMessageType("error");
    } else if (phoneNumber && message === "El teléfono solo debe contener números") {
      setMessage("");
      setMessageType("");
    }
  })

  // Actualizar mensaje basado en el estado del formulario
  useEffect(() => {
    if (password && confirmPassword && password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden");
      setMessageType("error");
    } else {
      setMessage("");
      setMessageType("");
    }
  }, [password, confirmPassword]);
  // Función para manejar el registro
  const handleRegister = async (input: {	"id": number,
    "name": string,
    "email": string,
    "phoneNumber": string,
    "password": string,
    "birthDate": Date}) => {
    if (isFormValid()) {
      // Aquí iría la lógica para enviar los datos al servidor
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
          "Registro completado satisfactoriamente",
          [
            { 
              text: "Aceptar", 
              onPress: () => router.push("..") 
            }
          ]
        );
      } catch (error) {
        setMessage("Error creando usuario");
        setMessageType("error");
        console.log(error);
      }
      // Mostrar alerta de éxito
    } else {
      // Verificar si el problema es que las contraseñas no coinciden
      if (password && confirmPassword && password !== confirmPassword) {
        Alert.alert(
          "Error",
          "Las contraseñas no coinciden",
          [{ text: "OK" }]
        );
      } else {
        // Mostrar alerta de error si faltan campos
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

  const onChange = ( {type}, selectedDate: any) => {
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
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Registro de Usuario</Text>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, id && styles.labelFilled]}>Número de identificación</Text>
          <TextInput
            style={[styles.input, id && styles.inputFilled]}
            placeholder="Ingresa tu número de ID"
            value={id}
            onChangeText={setId}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, name && styles.labelFilled]}>Nombre</Text>
          <TextInput
            style={[styles.input, name && styles.inputFilled]}
            placeholder="Ingresa tu nombre completo"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, email && styles.labelFilled]}>Correo electrónico</Text>
          <TextInput
            style={[styles.input, email && styles.inputFilled]}
            placeholder="ejemplo@correo.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={[styles.label, phoneNumber && styles.labelFilled]}>Celular</Text>
          <TextInput
            style={[styles.input, phoneNumber && styles.inputFilled]}
            placeholder="Ingresa tu número de celular"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="numeric"
          />
        </View>

        {/* Campo de Fecha de Nacimiento con animación */}
        <View style={styles.inputContainer}>
          <Text style={[styles.label /* isBirthDateSelected */ && styles.labelFilled]}>Fecha de Nacimiento</Text>
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
                  <Pressable onPress={toggleDatePicker}>
                  <TextInput
                    style={styles.input}
                    placeholder="Fecha de Nacimiento"
                    value={birthDate.toDateString()}
                    onChangeText={setBirthDate}
                    editable={false}
                  /> 
                </Pressable>
        )}
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

        <View style={styles.inputContainer}>
          <Text style={[styles.label, confirmPassword && styles.labelFilled]}>Confirmar Contraseña</Text>
          <TextInput
            style={[styles.input, confirmPassword && styles.inputFilled]}
            placeholder="Confirma tu contraseña"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
        </View>
        <MsgBox type={messageType}>{message}</MsgBox>
      <TouchableOpacity 
        style={[styles.button, !isFormValid() && styles.buttonDisabled]} 
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
        disabled={!isFormValid()}
      >
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.secondaryButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, backgroundColor: '#024059' },
  container: { flex: 1, padding: 24, backgroundColor: '#024059' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#F2C572' },
  inputContainer: { marginBottom: 20 },
  label: { marginBottom: 8, fontSize: 16, fontWeight: '600', color: '#F2C572', paddingLeft: 4 },
  labelFilled: { color: '#1B8CA6' }, // Color cuando se llena el campo
  input: {
    height: 54,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F2C572',
    borderRadius: 30,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#0D0D0D',
  },
  inputFilled: { backgroundColor: '#F2C572' }, // Color cuando el campo está lleno
  datePickerButton: {
    height: 54,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#F2C572',
    borderRadius: 30,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  dateText: { fontSize: 16, color: '#0D0D0D' },
  button: {
    backgroundColor: '#F2A74B',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonDisabled: { backgroundColor: '#BFBFBF', opacity: 0.8 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#F2C572',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 16,
  },
  secondaryButtonText: {
    color: '#F2C572',
    fontSize: 18,
    fontWeight: '600',
  },
});
