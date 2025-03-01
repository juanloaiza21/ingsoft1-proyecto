// app/register.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function Register(): JSX.Element {
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<string>(''); // Valores: '' | 'conductor' | 'pasajero'
  const [licensePlate, setLicensePlate] = useState<string>('');

  // Función para validar que todos los campos estén completos
  const isFormValid = (): boolean => {
    if (!name || !email || !password || !role) {
      return false;
    }
    
    // Si es conductor, también debe tener placa
    if (role === 'conductor' && !licensePlate) {
      return false;
    }
    
    return true;
  };

  // Función para manejar el registro
  const handleRegister = () => {
    if (isFormValid()) {
      // Aquí iría la lógica para enviar los datos al servidor
      
      // Mostrar alerta de éxito
      Alert.alert(
        "Registro exitoso",
        "Registro completado satisfactoriamente",
        [
          { 
            text: "Aceptar", 
            onPress: () => router.push("/home") 
          }
        ]
      );
    } else {
      // Mostrar alerta de error si faltan campos
      Alert.alert(
        "Error",
        "Por favor completa todos los campos requeridos",
        [{ text: "OK" }]
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro de Usuario</Text>
     
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
      {/* Campo Contraseña */}
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {/* Selector de Rol */}
      <Text style={styles.label}>Selecciona un rol:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          style={styles.picker}
          prompt="Selecciona un rol"
        >
          <Picker.Item label="Seleccione un rol" value="" />
          <Picker.Item label="Conductor" value="conductor" />
          <Picker.Item label="Pasajero" value="pasajero" />
        </Picker>
      </View>
      {/* Campo de Placa solo si el rol es conductor */}
      {role === 'conductor' && (
        <TextInput
          style={styles.input}
          placeholder="Placa del carro"
          value={licensePlate}
          onChangeText={setLicensePlate}
        />
      )}
      {/* Botón de Registro */}
      <TouchableOpacity 
        style={[styles.button, !isFormValid() && styles.buttonDisabled]} 
        onPress={handleRegister}
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
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
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