import React, { useState, useEffect } from "react";
import { useTheme } from "./context/themeContext";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Trip } from "./types/trip.types";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";
import AsyncStorage from "@react-native-async-storage/async-storage";

enum TripStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

// Asegúrate de que el tipo de 'status' en la interfaz sea 'TripStatus'
interface Trip {
  id: string;
  origin: string;
  destination: string;
  departureDate: string;
  beginDate: string;
  endDate: string;
  status: TripStatus;  // Esto debería ser de tipo TripStatus
  driverId: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export default function Historial(): JSX.Element {
  const { theme } = useTheme(); //para cambiar el tema
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  
  // Cambio: inicialización con valores mock
  const [access_token, setAccess_token] = useState<string>('mocked_access_token');
  const [refresh_token, setRefresh_token] = useState<string>('mocked_refresh_token');
  
  const router = useRouter();

  // ORIGINAL: Código original para obtener tokens
  const getTokensOriginal = async () => {
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

  // MOCK: Nueva función para mockear tokens
  const getTokensMock = async () => {
    try {
      // Mocking the tokens instead of getting from AsyncStorage
      const mockedAccessToken = 'mocked_access_token';
      const mockedRefreshToken = 'mocked_refresh_token';
      
      // Store mocked tokens in AsyncStorage for consistency
      await AsyncStorage.setItem('accessToken', mockedAccessToken);
      await AsyncStorage.setItem('refreshToken', mockedRefreshToken);
      
      setAccess_token(mockedAccessToken);
      setRefresh_token(mockedRefreshToken);
      
      return { accessToken: mockedAccessToken, refreshToken: mockedRefreshToken };
    } catch (error) {
      console.error('Error al mockear tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  };

  // Cambio: Usar la función mock en lugar de la original
  useEffect(() => {
    const loadTokens = async () => {
      // await getTokensOriginal(); // Comentado: función original
      await getTokensMock(); // Agregado: función mock
      console.log('Tokens mockeados correctamente:', access_token, refresh_token);
    };
    loadTokens();
  }, []);

  // ORIGINAL: Implementación original de fetchTrips (que ya incluía datos mock)
  const fetchTripsOriginal = async (): Promise<Trip[]> => {
    const trips: Trip[] = [
      {
        id: "1",
        origin: "Ciudad A",
        destination: "Ciudad B",
        departureDate: "2025-03-01T10:00:00",
        beginDate: "2025-03-01T12:00:00",
        endDate: "2025-03-01T14:00:00",
        status: TripStatus.COMPLETED,
        driverId: "driver1",
        price: 100,
        createdAt: "2025-02-01T08:00:00",
        updatedAt: "2025-02-28T08:00:00",
      },
      {
        id: "2",
        origin: "Ciudad C",
        destination: "Ciudad D",
        departureDate: "2025-03-05T10:00:00",
        beginDate: "2025-03-05T12:00:00",
        endDate: "2025-03-05T14:00:00",
        status: TripStatus.COMPLETED,
        driverId: "driver2",
        price: 150,
        createdAt: "2025-02-02T08:00:00",
        updatedAt: "2025-02-27T08:00:00",
      },
    ];
    
    /*
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      console.log('Access token:', accessToken);
      let user1Petition = await axios.request({
        method: ConfigVariables.api.auth.checkJWT.method,
        url: ConfigVariables.api.auth.checkJWT.url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      let user:ApiResponse = user1Petition.data;
      console.log('User:', user);
      const petition = await axios.request({
        method: ConfigVariables.api.historical.tripsUser.method,
        url: ConfigVariables.api.historical.tripsUser.url+user.result.userId,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      const data: ApiResponse = petition.data;
      const tripsData: Trip[] = data.result;
      tripsData.forEach((trip) => {
        if(trip.status === 'COMPLETED')
        trips.push(trip);
      });
    } catch (error) {
      console.error("Error fetching trips", error);
    } finally {
      return trips;
    }
    */
    return trips;
  };

  // MOCK: Implementación mejorada de fetchTrips con más datos y un retraso
  const fetchTripsMock = async (): Promise<Trip[]> => {
    const mockedTrips: Trip[] = [
      {
        id: "1",
        origin: "Ciudad A",
        destination: "Ciudad B",
        departureDate: "2025-03-01T10:00:00",
        beginDate: "2025-03-01T12:00:00",
        endDate: "2025-03-01T14:00:00",
        status: TripStatus.COMPLETED,
        driverId: "driver1",
        price: 100,
        createdAt: "2025-02-01T08:00:00",
        updatedAt: "2025-02-28T08:00:00",
      },
      {
        id: "2",
        origin: "Ciudad C",
        destination: "Ciudad D",
        departureDate: "2025-03-05T10:00:00",
        beginDate: "2025-03-05T12:00:00",
        endDate: "2025-03-05T14:00:00",
        status: TripStatus.COMPLETED,
        driverId: "driver2",
        price: 150,
        createdAt: "2025-02-02T08:00:00",
        updatedAt: "2025-02-27T08:00:00",
      },
      {
        id: "3",
        origin: "Ciudad E",
        destination: "Ciudad F",
        departureDate: "2025-03-10T09:00:00",
        beginDate: "2025-03-10T11:00:00",
        endDate: "2025-03-10T13:00:00",
        status: TripStatus.COMPLETED,
        driverId: "driver3",
        price: 120,
        createdAt: "2025-02-05T10:00:00",
        updatedAt: "2025-02-25T14:00:00",
      }
    ];
    
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return mockedTrips;
  };
  
  // MOCK: Implementación mock de handleDriverPress
  const handleDriverPressMock = async (item: Trip) => {
    try {
      if (!item.driverId) {
        await AsyncStorage.setItem('currentTravelData', JSON.stringify({ travel: item, driver: null }));
        router.navigate('./newTrip');
      } else {
        // Mock the driver data instead of making API calls
        const mockedDriver = {
          id: item.driverId,
          name: `Driver ${item.driverId}`,
          calification: 4.5,
          vehicleModel: "Toyota Corolla",
          licensePlate: "ABC-123",
          phone: "+1234567890"
        };
        
        const mockedUser = {
          id: item.driverId,
          name: `User for ${item.driverId}`,
          email: `user_${item.driverId}@example.com`,
          phone: "+1234567890"
        };

        // Save mocked travel and driver data to AsyncStorage
        await AsyncStorage.setItem('currentTravelData', JSON.stringify({ 
          travel: item, 
          driver: mockedDriver,
          user: mockedUser
        }));
        console.log('Mocked travel data saved to AsyncStorage');
        router.navigate('./newTrip');
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // Cambio: Usar la implementación mock en lugar de la original
  const handleDriverPress = handleDriverPressMock;

  useEffect(() => {
    setLoading(true);
    // fetchTripsOriginal().then((data) => { // Comentado: función original
    fetchTripsMock().then((data) => { // Agregado: función mock
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

  // MOCK: Implementación mejorada de renderTripItem
  const renderTripItemMock = ({ item }: { item: Trip }) => {
    // Format dates for better readability
    const formatDate = (date: string | Date) => {
          const dateObj = typeof date === 'string' ? new Date(date) : date;
          return dateObj.toLocaleDateString() + ' ' + dateObj.toLocaleTimeString();
        };

    return (
      <TouchableOpacity
        style={[styles.tripItem, { backgroundColor: theme === "dark" ? "#4d4c44" : "#F2A74B" }]}
        onPress={() => handleDriverPress(item)}
      >
        <Text style={styles.tripText}>Viaje: {item.id}</Text>
        <Text style={styles.tripDetails}>Origen: {item.origin}</Text>
        <Text style={styles.tripDetails}>Destino: {item.destination}</Text>
        <Text style={styles.tripDetails}>Fecha de inicio: {formatDate(item.beginDate)}</Text>
        <Text style={styles.tripDetails}>Fecha de fin: {formatDate(item.endDate)}</Text>
        <Text style={styles.tripDetails}>Precio: ${item.price}</Text>
        <Text style={styles.tripStatus}>Estado: {item.status}</Text>
      </TouchableOpacity>
    );
  };

  // Cambio: Usar la implementación mock en lugar de la original
  const renderTripItem = renderTripItemMock;

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}>
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
        {selectedTrip && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, { backgroundColor: theme === "dark" ? "#4d4c44" : "#F2A74B" }]}>
              <Text style={styles.modalTitle}>Detalles del Viaje</Text>
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>ID: {selectedTrip.id}</Text>
                <Text style={styles.detailText}>Origen: {selectedTrip.origin}</Text>
                <Text style={styles.detailText}>Destino: {selectedTrip.destination}</Text>
                <Text style={styles.detailText}>Fecha: {new Date(selectedTrip.departureDate).toLocaleDateString()}</Text>
                <Text style={styles.detailText}>Precio: ${selectedTrip.price}</Text>
                <Text style={styles.detailText}>Estado: {selectedTrip.status}</Text>
              </View>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={closeModal}
              >
                <Text style={styles.closeButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#024059",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#F2A74B",
  },
  title2: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#F2A74B",
  },
  listContainer: {
    paddingBottom: 20,
  },
  tripItem: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#F2A74B",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#F2A74B",
  },
  tripText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  // Nuevos estilos añadidos
  tripDetails: {
    fontSize: 14,
    color: "white",
    marginVertical: 2,
  },
  tripStatus: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#F2A74B",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 15,
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
    width: "100%",
  },
  detailText: {
    fontSize: 16,
    marginVertical: 5,
    color: "white",
  },
  closeButton: {
    backgroundColor: "#024059",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
