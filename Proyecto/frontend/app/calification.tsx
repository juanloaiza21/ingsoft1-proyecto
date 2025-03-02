// app/historial.tsx
import React, { useState, useEffect } from "react";
import { useTheme } from "./context/themeContext";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  Button,
} from "react-native";
import { useRouter } from "expo-router";
import type { Calification } from "./types/calification-response";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { Driver } from "./types/driver.types";
import { Trip } from "./types/trip.types";
import { User } from "./types/user.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "./types/api-response.type";

export default function Calification(): JSX.Element {

  const { theme } = useTheme(); //para cambiar el tema

  const [calification, setCalification] = useState<Calification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedCalification] = useState<Calification | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [travelData, setTravelData] = useState<{
    driver: Driver | null;    travel: Trip | null;
    user: User | null;
  }>({
    driver: null,
    travel: null,
    user: null,
  });
  const router = useRouter();

  const getTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setAccess_token(accessToken ?? '');
      setRefresh_token(refreshToken ?? '');
    } catch (error) {
      console.error('Error al recuperar tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  };
  useEffect(() => {
    const loadTokens = async () => {
      await getTokens();
      if (access_token && refresh_token) {
        console.log('Tokens recuperados correctamente');
      }
    };
    loadTokens();
  }, []);

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


    // Función simulada para obtener el historial de viajes desde el backend
  const fetchCalifications = async (): Promise<Calification[]> => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem('calificationsData');
      if (storedData) {
        const parsedData: Calification[] = JSON.parse(storedData);
        setCalification(parsedData);
        return parsedData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching califications:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCalifications = async () => {
      await fetchCalifications();
      if (calification) {
        console.log("Califications loaded successfully");
      }
    };
    loadCalifications();
  }, []);



  const handleTripPress = (calification: Calification) => {
    setSelectedCalification(calification);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCalification(null);
  };

  const handleDriverPress = () => {
    // Navegar a la página driverProfile.tsx
    router.push("/driverProfile");
    // Opcionalmente, cerrar el modal
    closeModal();
  };

  const renderCalificationItem = ({ item }: { item: Calification }): JSX.Element => {
    // Generate star representation based on score
    const stars = "⭐".repeat(Math.min(Math.max(1, item.score), 5));
    
    return (
      <TouchableOpacity
        style={[styles.tripItem, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
        onPress={() => handleTripPress(item)}
      >
        <Text style={[styles.tripText, theme === "dark" && { color: "white" }]}>
          Puntaje: {item.score} {stars}
        </Text>
        <Text style={[styles.tripText, theme === "dark" && { color: "white" }]}>
          Comentario: {item.comment}
        </Text>
        <Text style={[{ fontSize: 14 }, theme === "dark" && { color: "#cccccc" }]}>
          {item.createdAt}
        </Text>
      </TouchableOpacity>
    );
  }

  return (

    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
    >

      <Text style={[styles.title, theme === "dark" && styles.title2]}>
      Calificaciones y comentarios</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={calification}
          keyExtractor={(item) => item.id}
          renderItem={renderCalificationItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal de detalles del viaje */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTrip && (
              <>
                <TouchableOpacity
                  onPress={handleDriverPress}
                  style={styles.driverImageContainer}
                >
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                  Calificación: {selectedTrip.score}
                  </Text>
                  <Text style={styles.detailText}>
                  Comentario: {selectedTrip.comment}
                  </Text>
                  <Text style={styles.detailText}>
                  Fecha: {selectedTrip.createdAt}
                  </Text>
                </View>

                <View style={{ marginBottom: 15 }}>
                <Button
                  title="Ver perfil del Conductor del viaje"
                  onPress={() => {
                    closeModal();
                    router.push("/driverProfile");
                  }}
                />
                </View>
                <Button title="Cerrar" onPress={closeModal} color = "#c91905"/>
          
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white"
  },
  listContainer: {
    paddingBottom: 20,
  },
  tripItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  tripText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  driverImageContainer: {
    marginBottom: 15,
  },
  driverImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  detailsContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
