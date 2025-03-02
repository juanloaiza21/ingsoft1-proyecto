import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Trip } from './types/trip.types';
import { Driver } from "./types/driver.types";

import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "./types/user.types";

export default function Page() {
  const { theme } = useTheme(); //para cambiar el tema

  // State to store travel data
  const [travelData, setTravelData] = useState<{
    driver: Driver | null;
    travel: Trip | null;
    user: User | null;
  }>({
    driver: null,
    travel: null,
    user: null,
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Function to load travel data from AsyncStorage
  const loadTravelData = async () => {
    try {
      const data = await AsyncStorage.getItem('currentTravelData');
      if (data) {
        setTravelData(JSON.parse(data));
        console.log("Travel data loaded successfully");
      }
    } catch (error) {
      console.error("Failed to load travel data:", error);
    }
  };

  // Load travel data when component mounts
  useEffect(() => {
    loadTravelData();
  }, []);

  const router = useRouter(); // para cambiar de pantalla

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    Alert.alert(
      "Viaje Programado",
      "Tu viaje ha sido programado con éxito, se le notificará al conductor",
      [{ text: "OK" }]
    );
    setShowCancelConfirm(false);
  };

  const dismissCancel = () => {
    setShowCancelConfirm(false);
  };

  const renderDriverCard = () => {
    if (!travelData.driver) {
      return (
        <View style={styles.driverCard}>
          <View style={styles.driverIcon}>
            <Ionicons name="person-outline" size={40} color="gray" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Sin conductor asignado</Text>
            <Text style={styles.carInfo}>
              Aún no se ha asignado un conductor para este viaje
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#888" />
              <Text style={styles.rating}>Pendiente</Text>
            </View>
          </View>
        </View>
      );
    }
    else {
      return (
        <View style={styles.driverCard}>
          <View style={styles.driverIcon}>
            <Ionicons name="person" size={40} color="black" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{travelData.user?.name || 'Nombre no disponible'}</Text>
            <Text style={styles.carInfo}>
              Piloto de elite • {travelData.driver.runtNumber}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{travelData.driver.calification.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      <ScrollView showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Ionicons name="car" size={24} 
          color={theme === "dark" ? "#AAAAAA" : "#888888"}
           />
          <Text
            style={[styles.headerText, theme === "dark" && styles.headerText2]}
          >
            NUEVO VIAJE
          </Text>
        </View>

        {renderDriverCard()}

        <View style={styles.meetingPoint}>
          <Text style={styles.meetingPointTitle}>Punto de encuentro:</Text>
          <Text style={styles.meetingPointValue}>
            {travelData.travel?.origin || 'Punto no disponible'}
          </Text>
        </View>
        <View style={styles.meetingPoint}>
          <Text style={styles.meetingPointTitle}>Destino:</Text>
          <Text style={styles.meetingPointValue}>{travelData.travel?.destination}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/driverProfile")}
        >
          <Text style={styles.buttonText}>Ver perfil del conductor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/chat")}
        >
          <Text style={styles.buttonText}>Contactar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonGreen} onPress={handleCancel}>
          <Text style={styles.buttonText}>Programar viaje</Text>
        </TouchableOpacity>


        <View style={styles.tripInfoContainer}>

          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="#0088FF" />
            <Text style={styles.infoText}>
              Fecha y hora: {travelData.travel?.beginDate.toString() || 'Fecha no disponible'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={24} color="#0088FF" />
            <Text style={styles.infoText}>Costo total: ${travelData.travel?.price} COP</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="#0088FF" />
            <Text style={styles.infoText}>Distancia: 5.2 km</Text>
          </View>
        </View>
      </ScrollView>

      {showCancelConfirm && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirmar Viaje</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas pactar el viaje?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={dismissCancel}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={confirmCancel}
              >
                <Text style={styles.confirmButtonText}>Pactar viaje</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
  },
  headerText2: {
    fontSize: 22,
    fontWeight: "bold",
    marginLeft: 8,
    color: "white",
  },
  driverCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  driverIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#f0f0f0",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  driverInfo: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  carInfo: {
    color: "#666",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontWeight: "bold",
  },
  meetingPoint: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  meetingPointTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  meetingPointValue: {
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    backgroundColor: "#0088FF",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonGreen: {
    backgroundColor: "#11ac28",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  tripInfoContainer: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
    
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  infoText: {
    marginLeft: 12,
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 24,
    width: "80%",
  },
  modalContentRed: {
    backgroundColor: "red",
    borderRadius: 12,
    padding: 24,
    width: "80%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "bold",
  },
  confirmButton: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#11ac28", //verdee
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
