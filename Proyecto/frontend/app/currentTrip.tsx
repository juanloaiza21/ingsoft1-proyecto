import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "./context/themeContext";
import { ScrollView } from 'react-native';

export default function Page() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tripStarted, setTripStarted] = useState(false);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);

  // Extraer el tiempo estimado del texto
  const extractEstimatedTime = () => {
    // En un caso real, esto debería extraerse de los datos del viaje
    const timeText = "35 min"; // Extraído del componente actual
    const match = timeText.match(/\d+/);
    return match ? parseInt(match[0]) : 35; // Valor por defecto si no hay coincidencia
  };

  const estimatedTimeInMinutes = extractEstimatedTime();

  const startProgress = () => {
    if (!tripStarted) {
      setTripStarted(true);
      
      // Convertir minutos a milisegundos
      const totalDuration = estimatedTimeInMinutes * 60 * 1000;
      const updateInterval = 1000; // Actualizar cada segundo
      
      // Calcular cuánto debe aumentar el progreso cada segundo
      const incrementPerInterval = (updateInterval / totalDuration) * 100;
      
      // Iniciar el intervalo para actualizar el progreso
      intervalRef.current = setInterval(() => {
        setProgress(prevProgress => {
          const newProgress = prevProgress + incrementPerInterval;
          if (newProgress >= 100) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            return 100;
          }
          return newProgress;
        });
      }, updateInterval);
    }
  };

  // Limpiar el intervalo cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    Alert.alert("Viaje Cancelado", "Tu viaje ha sido cancelado con éxito, se le notificará al conductor", [{ text: "OK" }]);
    setShowCancelConfirm(false);
    
    // Detener el progreso si se cancela el viaje
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const dismissCancel = () => {
    setShowCancelConfirm(false);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}>
      <View style={styles.header}>
        <Ionicons name="car" size={24} color={theme === "dark" ? "#AAAAAA" : "white"} />
        <Text style={[styles.headerText, theme === "dark" && styles.headerText2]}>VIAJE ACTUAL</Text>
      </View>

      <View style={styles.driverCard}>
        <View style={styles.driverIcon}>
          <Ionicons name="person" size={40} color="white" />
        </View>
        <View style={styles.driverInfo}>
          <Text style={styles.driverName}>Juan Pérez</Text>
          <Text style={styles.carInfo}>Toyota Corolla • ABC-123</Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={styles.rating}>4.8</Text>
          </View>
        </View>
      </View>

      <View style={styles.meetingPoint}>
        <Text style={styles.meetingPointTitle}>Punto de encuentro:</Text>
        <Text style={styles.meetingPointValue}>Detrás del CYT</Text>
      </View>
      <View style={styles.meetingPoint2}>
        <Text style={styles.meetingPointTitle}>Destino:</Text>
        <Text style={styles.meetingPointValue}>Centro comercial Titán plaza</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push("/driverProfile")}>
        <Text style={styles.buttonText}>Ver perfil</Text>
      </TouchableOpacity>

      {/* Reemplazamos el botón "Contactar" por la barra de progreso */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Progreso del viaje</Text>
        <View style={styles.progressBarContainer}>
          <View style={[styles.progressBar, { width: `${progress}%` }]} />
        </View>
        {!tripStarted ? (
          <TouchableOpacity onPress={startProgress} style={styles.startButton}>
            <Text style={styles.startButtonText}>Iniciar viaje</Text>
          </TouchableOpacity>
        ) : (
          <Text style={styles.progressPercentText}>{Math.round(progress)}%</Text>
        )}
      </View>

      <TouchableOpacity style={styles.buttonRed} onPress={() => router.push('/finishedTrip')}>
        <Text style={styles.buttonText}>Finalizar Viaje</Text>
      </TouchableOpacity>

      <View style={styles.tripInfoContainer}>
        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={24} color="white" />
          <Text style={styles.infoText}>Fecha y hora: 28/02/24 a las 16:45</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={24} color="white" />
          <Text style={styles.infoText}>Tiempo estimado: {estimatedTimeInMinutes} min</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={24} color="white" />
          <Text style={styles.infoText}>Costo total: $14.000</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={24} color="white" />
          <Text style={styles.infoText}>Distancia: 5.2 km</Text>
        </View>
      </View>

      {showCancelConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Cancelar Viaje</Text>
            <Text style={styles.modalText}>¿Estás seguro que deseas cancelar el viaje?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelButton} onPress={dismissCancel}>
                <Text style={styles.cancelButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={confirmCancel}>
                <Text style={styles.confirmButtonText}>Sí, cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 16,
    paddingBottom: 80, // Añadir espacio para la barra de navegación
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 0,
    marginBottom: 5,
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
    color: "white",
  },
  headerText2: {
    color: "white",
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  driverCard: {
    backgroundColor: '#1B8CA6',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  driverIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInfo: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: 'bold',
    color:"white",
  },
  carInfo: {
    marginVertical: 4,
    color:"white",
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontWeight: 'bold',
    color:"white",
  },
  meetingPoint: {
    backgroundColor: '#1B8CA6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 3, // Reducir de 5 a 3
  },
  meetingPoint2: {
    backgroundColor: '#1B8CA6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 6, // Reducir de 10 a 6
  },
  meetingPointTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: "white",
  },
  meetingPointValue: {
    fontSize: 16,
    marginTop: 4,
    color: "white",
  },
  button: {
    backgroundColor: '#fc9414',
    borderRadius: 8,
    padding: 12, // Reducir de 16 a 12
    alignItems: 'center',
    marginBottom: 4, // Reducir de 6 a 4
  },
  buttonRed: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    padding: 12, // Reducir de 16 a 12
    alignItems: 'center',
    marginBottom: 6, // Reducir de 10 a 6
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tripInfoContainer: {
    backgroundColor: '#1B8CA6',
    borderRadius: 12,
    padding: 16,
    marginTop: 0,
    marginBottom: 20, // Añadir margen inferior para separación
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalContentRed: {
    backgroundColor: 'red',
    borderRadius: 12,
    padding: 24,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: 'bold',
  },
  confirmButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#0088FF',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  // Nuevos estilos para la barra de progreso
  progressContainer: {
    backgroundColor: '#1B8CA6',
    borderRadius: 8,
    padding: 12, // Reducir de 16 a 12
    alignItems: 'center',
    marginBottom: 4, // Reducir de 6 a 4
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  progressBarContainer: {
    width: '100%',
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4cd964', // Color verde similar a la imagen
  },
  startButton: {
    marginTop: 8,
    padding: 6,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  progressPercentText: {
    color: 'white',
    fontWeight: 'bold',
    marginTop: 8,
    fontSize: 16,
  },
});