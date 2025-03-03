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
import { Trip } from "./types/trip.types";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";
import AsyncStorage from "@react-native-async-storage/async-storage";


interface TravelOption {
  "id": string,
  "origin": string,
  "destination": string,
  "departureDate": string,
  "beginDate": string,
  "endDate": string,
  "status": string,
  "driverId": string,
  "price": number,
  "createdAt": string,
  "updatedAt": string,
}


export default function Historial(): JSX.Element {

  const { theme } = useTheme(); //para cambiar el tema
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
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

  

  const fetchTrips = async (): Promise<Trip[]> => {
    const trips: Trip[] = [];
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
  };
  
  const handleDriverPress = async (item: Trip) => {
    try {
      if (!item.driverId) {
        try {
          await AsyncStorage.setItem('currentTravelData', JSON.stringify({ 
            travel: item, 
            driver: null
          }));
          router.navigate('./newTrip');
        } catch (error) {
          console.error('Error saving travel data to AsyncStorage:', error);
        }
      }
      else{
        const petition = await axios.request({
          method: ConfigVariables.api.driver.getOne.method,
          url: `${ConfigVariables.api.driver.getOne.url}${item.driverId}`,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        })
        const driver: ApiResponse = petition.data;
        const calf = await axios.request({
          method: ConfigVariables.api.calification.getProm.method,
          url: `${ConfigVariables.api.calification.getProm.url}${driver.result.id}`,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        })
        const calification: ApiResponse = calf.data;
        driver.result.calification = calification.result;
        const petitionUser = await axios.request({
          method: ConfigVariables.api.user.getOne.method,
          url: `${ConfigVariables.api.user.getOne.url}${driver.result.id}`,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });

        const user: ApiResponse = petitionUser.data;

        // Save travel and driver data to AsyncStorage
        try {
          await AsyncStorage.setItem('currentTravelData', JSON.stringify({ 
            travel: item, 
            driver: driver.result,
            user: user.result
          }));
          console.log('Travel data saved to AsyncStorage');
          router.navigate('./newTrip');
        } catch (error) {
          console.error('Error saving travel data to AsyncStorage:', error);
        }
      }
    } catch (error) {
      console.error( error);
    }
  };

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

  const renderTripItem = ({ item }: { item: Trip }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => handleDriverPress(item)}
    >
      <Text style={styles.tripText}>Viaje: {item.id}</Text>
      <Text>Fecha de inicio: {item.beginDate.toString()}</Text>
      <Text>Fecha de fin: {item.endDate.toString()}</Text>
      <Text>Precio: {item.price}</Text>
      <Text>Estado: {item.status}</Text>
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
