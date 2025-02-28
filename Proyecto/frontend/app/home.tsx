// app/home.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Link } from 'expo-router';

export default function Home(): JSX.Element {
  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Botón de Profile en la esquina izquierda */}
        <Link href="/profile" style={styles.link}>
          <Image 
            source={require('../assets/images/react-logo.png')} 
            style={styles.profileImage} 
          />
        </Link>
        {/* Logo central */}
        <Image 
          source={require('../assets/images/logo.png')} 
          style={styles.centerLogo} 
        />
        {/* Botón de Settings en la esquina derecha */}
        <Link href="/settings" style={styles.link}>
          <Image 
            source={require('../assets/images/icon.png')} 
            style={styles.settingsIcon} 
          />
        </Link>
      </View>

      {/* Botones principales */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.mainButton}>
          <Link href="/solicitudViaje" style={styles.linkButton}>
            <Text style={styles.buttonText}>Solicitud de Viaje</Text>
          </Link>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton}>
          <Link href="/historial" style={styles.linkButton}>
            <Text style={styles.buttonText}>Historial</Text>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
  },
  link: {
    // Para que el área táctil abarque la imagen completa
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25, // Hacemos la imagen redonda
  },
  settingsIcon: {
    width: 40,
    height: 40,
    tintColor: '#333', // Opcional: color para el ícono
  },
  centerLogo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  buttonContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#34C759',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  linkButton: {
    width: '100%',
    alignItems: 'center',
    textDecorationLine: 'none',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
