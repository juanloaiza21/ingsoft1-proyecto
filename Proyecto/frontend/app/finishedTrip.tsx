import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Platform, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function FinishedTrip() {
  const fadeAnim = useRef(new Animated.Value(0)).current;  // Animación de opacidad
  const slideAnim = useRef(new Animated.Value(50)).current; // Animación de deslizamiento
  const logoAnim = useRef(new Animated.Value(300)).current; // Animación para el logo

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(logoAnim, {
        toValue: 0,
        friction: 3,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: App Name Image */}
        <Image
          source={require("../assets/images/Nombre (2).png")}
          style={styles.appNameImage}
          resizeMode="contain"
        />
        {/* Right: Animated Logo */}
        <Animated.Image
          source={require("../assets/images/icon-black.png")}
          style={[styles.animatedLogo, { transform: [{ translateX: logoAnim }] }]}
          resizeMode="contain"
        />
      </View>

      <Animated.Text
        style={[styles.headerText, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        Viaje Finalizado 🎉
      </Animated.Text>

      <View style={styles.tripInfoContainer}>
        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={30} color="white" />
            <Text style={styles.infoText}>Fecha y hora: 28/02/24 a las 16:45 </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={30} color="white" />
            <Text style={styles.infoText}>Duracion del viaje: 35 min ⏳</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={30} color="white" />
            <Text style={styles.infoText}>Costo total: $14.000 💰</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={30} color="white" />
            <Text style={styles.infoText}>Distancia: 5.2 km 🌍</Text>
          </View>
        </Animated.View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>¡Gracias por usar nuestro servicio! 🙌</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1B8CA6',
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 10,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  appNameImage: {
    width: 120,
    height: 40,
    marginHorizontal: 20,
  },
  animatedLogo: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  tripInfoContainer: {
    backgroundColor: '#024059',
    borderRadius: 12,
    padding: 16,  // Padding adicional para evitar que el texto toque los bordes
    marginTop: 20,
    width: '100%',
    overflow: 'hidden',  // Evita que el contenido sobresalga de las esquinas redondeadas
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,  // Espacio entre los íconos y texto
  },
  infoText: {
    marginLeft: 16,  // Evitar que el texto quede pegado al ícono
    fontSize: 18,
    color: 'white',
    fontWeight: '500',
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 18,
    color: 'white',
    fontStyle: 'italic',
  },
});
