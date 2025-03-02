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

interface Trip {
  id: string;
  driverImage: string;
  duration: string;
  price: string;
}

// Función simulada para obtener el historial de viajes desde el backend
const fetchTrips = async (): Promise<Trip[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: "1",
          driverImage: "https://via.placeholder.com/100",
          duration: "1h 30m",
          price: "$20",
        },
        {
          id: "2",
          driverImage: "https://via.placeholder.com/100",
          duration: "2h 15m",
          price: "$30",
        },
        {
          id: "3",
          driverImage: "https://via.placeholder.com/100",
          duration: "45m",
          price: "$15",
        },
      ]);
    }, 1000);
  });
};

export default function Historial(): JSX.Element {

  const { theme } = useTheme(); //para cambiar el tema

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetchTrips().then((data) => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrip(null);
  };

  const handleDriverPress = () => {
    // Navegar a la página driverProfile.tsx
    router.push("/driverProfile");
    // Opcionalmente, cerrar el modal
    closeModal();
  };

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => handleTripPress(item)}
    >
      <Text style={styles.tripText}>Viaje {item.id}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
    >
      <Text style={[styles.title, theme === "dark" && styles.title2]}>
      Historial de Viajes</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripItem}
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
                  <Image
                    source={{ uri: selectedTrip.driverImage }}
                    style={styles.driverImage}
                  />
                </TouchableOpacity>
                <View style={styles.detailsContainer}>
                  <Text style={styles.detailText}>
                    Duración: {selectedTrip.duration}
                  </Text>
                  <Text style={styles.detailText}>
                    Precio: {selectedTrip.price}
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
