import React, { useState, useEffect } from 'react'; 
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Pressable, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import { ConfigVariables } from './config/config';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [id, setId] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [birthDate, setBirthDate] = useState<Date | null>(null);
  const [show, setShow] = useState(false);
  const [isBirthDateSelected, setIsBirthDateSelected] = useState(false); // Nuevo estado para animación

  const toggleDatePicker = () => setShow(!show);

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      setBirthDate(selectedDate);
      setIsBirthDateSelected(true); // Se ha seleccionado una fecha
      if (Platform.OS === 'android') {
        toggleDatePicker();
      }
    } else {
      toggleDatePicker();
    }
  };

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
          <Text style={[styles.label, isBirthDateSelected && styles.labelFilled]}>Fecha de Nacimiento</Text>
          {show && (
            <DateTimePicker
              mode='date'
              display='spinner'
              value={birthDate || new Date()}
              onChange={onChange}
              maximumDate={new Date()}
            />
          )}
          {!show && (
            <Pressable onPress={toggleDatePicker}>
              <View style={[styles.datePickerButton, isBirthDateSelected && styles.inputFilled]}>
                <Text style={styles.dateText}>
                  {birthDate ? birthDate.toDateString() : "Selecciona tu fecha"}
                </Text>
              </View>
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

        <TouchableOpacity
          style={[styles.button, (!name || !email || !password || !confirmPassword || !phoneNumber || !birthDate) && styles.buttonDisabled]}
          disabled={!name || !email || !password || !confirmPassword || !phoneNumber || !birthDate}
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
