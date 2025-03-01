import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";

export default function Page() {
  const { theme } = useTheme(); //para cambiar el tema

  const router = useRouter(); // para cambiar de pantalla
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

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

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
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

      <View style={styles.driverCard}>
        <View style={styles.driverIcon}>
          <Ionicons name="person" size={40} color="black" />
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
        <Text style={styles.meetingPointValue}>
          Corferias Universidad Nacional
        </Text>
      </View>
      <View style={styles.meetingPoint}>
        <Text style={styles.meetingPointTitle}>Destino:</Text>
        <Text style={styles.meetingPointValue}>Facatativá</Text>
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
          <Ionicons name="grid-outline" size={24} color="#0088FF" />
          <Text style={styles.infoText}>Asientos disponibles : 3</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="calendar-outline" size={24} color="#0088FF" />
          <Text style={styles.infoText}>
            Fecha y hora: 28/02/24 a las 16:45
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="time-outline" size={24} color="#0088FF" />
          <Text style={styles.infoText}>Tiempo estimado: 35 min</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="cash-outline" size={24} color="#0088FF" />
          <Text style={styles.infoText}>Costo total: $14.000</Text>
        </View>

        <View style={styles.infoItem}>
          <Ionicons name="location-outline" size={24} color="#0088FF" />
          <Text style={styles.infoText}>Distancia: 5.2 km</Text>
        </View>
      </View>

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
