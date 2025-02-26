import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";

interface TravelPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TravelPreferencesModal({
  visible,
  onClose,
}: TravelPreferencesModalProps) {
  const [travelRequestMode, setTravelRequestMode] = useState("automatic");
  const [routeInput, setRouteInput] = useState("");
  const [favoriteRoutes, setFavoriteRoutes] = useState<string[]>([]);

  const handleAddRoute = () => {
    if (routeInput.trim() !== "") {
      setFavoriteRoutes([...favoriteRoutes, routeInput.trim()]);
      setRouteInput("");
    }
  };

  const handleRemoveRoute = (index: number) => {
    const updatedRoutes = favoriteRoutes.filter((_, i) => i !== index);
    setFavoriteRoutes(updatedRoutes);
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Preferencias de Viaje</Text>

          {/* Sección: Solicitudes de viajes */}
          <Text style={styles.sectionTitle}>Solicitudes de viajes

          </Text>
          <View style={styles.requestButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.requestButton,
                travelRequestMode === "automatic" && styles.requestButtonSelected,
              ]}
              onPress={() => setTravelRequestMode("automatic")}
            >
              <Text
                style={[
                  styles.requestButtonText,
                  travelRequestMode === "automatic" && styles.requestButtonTextSelected,
                ]}
              >
                Automática
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.requestButton,
                travelRequestMode === "manual" && styles.requestButtonSelected,
              ]}
              onPress={() => setTravelRequestMode("manual")}
            >
              <Text
                style={[
                  styles.requestButtonText,
                  travelRequestMode === "manual" && styles.requestButtonTextSelected,
                ]}
              >
                Manual
              </Text>
            </TouchableOpacity>
          </View>

          {/* Sección: Rutas favoritas */}
          <Text style={styles.sectionTitle}>Rutas favoritas</Text>
          <View style={styles.addRouteContainer}>
            <TextInput
              style={styles.routeInput}
              placeholder="Ingresa una ruta favorita"
              value={routeInput}
              onChangeText={setRouteInput}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddRoute}>
              <Text style={styles.addButtonText}>Agregar</Text>
            </TouchableOpacity>
          </View>

          {/* Lista de rutas favoritas con botón de eliminar */}
          <ScrollView style={styles.routesList}>
            {favoriteRoutes.map((route, index) => (
              <View key={index} style={styles.routeItem}>
                <Text style={styles.routeText}>{route}</Text>
                <TouchableOpacity onPress={() => handleRemoveRoute(index)} style={styles.deleteButton}>
                  <Text style={styles.deleteButtonText}>❌</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          {/* Botón para cerrar el modal */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.buttonText}>Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// Estilos
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#333",
  },
  requestButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  requestButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  requestButtonSelected: {
    backgroundColor: "#11ac28",
    borderWidth: 1, // Grosor del borde
    borderColor: "black", // Color del borde negro

  },
  requestButtonText: {
    fontSize: 16,
    color: "#333",
  },
  requestButtonTextSelected: {
    color: "white",
  },
  addRouteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  routeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#11ac28",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1, // Grosor del borde
    borderColor: "black", // Color del borde negro

  },
  addButtonText: {
    color: "white",
    fontSize: 16,
  },
  routesList: {
    maxHeight: 150,
    marginBottom: 20,
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
  },
  routeText: {
    fontSize: 16,
    color: "#333",
  },
  deleteButton: {
    padding: 5,
    marginLeft: 10,
  },
  deleteButtonText: {
    fontSize: 18,
    color: "red",
  },
  closeButton: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
