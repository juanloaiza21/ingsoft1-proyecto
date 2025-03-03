import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  ScrollView,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/themeContext";

interface TravelPreferencesModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function TravelPreferencesModal({
  visible,
  onClose,
}: TravelPreferencesModalProps) {
  const { theme } = useTheme();
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

  const isDark = theme === "dark";
  const bgColor = isDark ? "#2d2c24" : "#ffffff";
  const textColor = isDark ? "#ffffff" : "#333333";

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={[styles.modalContent, { backgroundColor: bgColor }]}>
          {/* Header with gradient */}
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.modalHeader}
          >
            <Ionicons name="car-sport" size={24} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.modalTitle}>Preferencias de Viaje</Text>
          </LinearGradient>

          {/* Sección: Solicitudes de viajes */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              <Ionicons name="navigate-outline" size={18} color={textColor} style={{ marginRight: 5 }} />
              Solicitudes de viajes
            </Text>
            <View style={styles.requestButtonsContainer}>
              <TouchableOpacity
                onPress={() => setTravelRequestMode("automatic")}
              >
                <LinearGradient
                  colors={travelRequestMode === "automatic" ? ["#1B8CA6", "#0a6a80"] : ["#e0e0e0", "#d0d0d0"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={[styles.requestButton, travelRequestMode === "automatic" && styles.requestButtonSelected]}
                >
                  <Ionicons name="flash-outline" size={18} color="white" style={{ marginRight: 5 }} />
                  <Text style={styles.requestButtonTextSelected}>Automática</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setTravelRequestMode("manual")}
              >
                <LinearGradient
                  colors={travelRequestMode === "manual" ? ["#1B8CA6", "#0a6a80"] : ["#e0e0e0", "#d0d0d0"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={[styles.requestButton, travelRequestMode === "manual" && styles.requestButtonSelected]}
                >
                  <Ionicons name="hand-left-outline" size={18} color={travelRequestMode === "manual" ? "white" : "#666"} style={{ marginRight: 5 }} />
                  <Text style={travelRequestMode === "manual" ? styles.requestButtonTextSelected : { color: "#666" }}>Manual</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* Sección: Rutas favoritas */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textColor }]}>
              <Ionicons name="star-outline" size={18} color={textColor} style={{ marginRight: 5 }} />
              Rutas favoritas
            </Text>
            <View style={styles.addRouteContainer}>
              <TextInput
                style={[styles.routeInput, { borderColor: isDark ? "#555" : "#ccc", color: textColor }]}
                placeholder="Ingresa una ruta favorita"
                placeholderTextColor={isDark ? "#aaa" : "#999"}
                value={routeInput}
                onChangeText={setRouteInput}
              />
              <TouchableOpacity onPress={handleAddRoute}>
                <LinearGradient
                  colors={["#1B8CA6", "#0a6a80"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.addButton}
                >
                  <Ionicons name="add" size={20} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* Lista de rutas favoritas */}
            <ScrollView style={styles.routesList}>
              {favoriteRoutes.length === 0 ? (
                <Text style={{ color: isDark ? "#aaa" : "#999", textAlign: "center", marginTop: 10 }}>
                  No hay rutas favoritas guardadas
                </Text>
              ) : (
                favoriteRoutes.map((route, index) => (
                  <View key={index} style={[styles.routeItem, { borderBottomColor: isDark ? "#444" : "#eee" }]}>
                    <View style={styles.routeItemContent}>
                      <Ionicons name="location-outline" size={18} color={isDark ? "#fc9414" : "#f57c00"} style={{ marginRight: 8 }} />
                      <Text style={[styles.routeText, { color: textColor }]}>{route}</Text>
                    </View>
                    <TouchableOpacity onPress={() => handleRemoveRoute(index)} style={styles.deleteButton}>
                      <Ionicons name="trash-outline" size={20} color="#ff4d4d" />
                    </TouchableOpacity>
                  </View>
                ))
              )}
            </ScrollView>
          </View>

          {/* Botones inferiores */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose}>
              <LinearGradient
                colors={["#fc9414", "#f57c00"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.saveButton}
              >
                <Text style={styles.saveButtonText}>Guardar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modalContent: {
    borderRadius: 16,
    width: "90%",
    maxHeight: "80%",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    display: "flex",
  },
  requestButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  requestButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    minWidth: 140,
    justifyContent: "center",
  },
  requestButtonSelected: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  requestButtonTextSelected: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  addRouteContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  routeInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginRight: 10,
    fontSize: 15,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  routesList: {
    maxHeight: 180,
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  routeItemContent: {
    flexDirection: "row",
    alignItems: "center", 
    flex: 1,
  },
  routeText: {
    fontSize: 15,
    flex: 1,
  },
  deleteButton: {
    padding: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
  },
  cancelButtonText: {
    fontSize: 15,
    color: "#777",
    fontWeight: "600",
  },
  saveButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 100,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  saveButtonText: {
    fontSize: 15,
    color: "white",
    fontWeight: "bold",
  }
});
