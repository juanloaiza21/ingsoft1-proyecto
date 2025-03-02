// app/register.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Button, Pressable, Platform } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
      <TextInput
        style={styles.input}
        placeholder="Numero de identificacion"
        value={id}
        onChangeText={setId}
      />
      {/* Campo Nombre */}
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        value={name}
        onChangeText={setName}
      />
      {/* Campo Correo */}
      <TextInput
        style={styles.input}
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Celular"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {/* BirthDate */}
      <View>
        <Text style = {styles.soft}>
          Fecha de Nacimiento
        </Text>
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
      {/* Campo Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Campo Confirmar Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
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
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: 'bold'
  },
  soft: {
    marginBottom: 5,
    fontSize: 16,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 20,
    borderRadius: 5,
    marginBottom: 15,
    overflow: 'hidden'
  },
  picker: {
    height: 50,
    width: '100%'
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});