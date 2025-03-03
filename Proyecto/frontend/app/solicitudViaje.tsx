import React, { useState, useEffect, useRef } from "react";
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
  TextInput,
  Animated
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";


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

interface StarOption {
  id: string;
  name: string;
}

// Función simulada para obtener opciones de la estrella desde el backend
const fetchStarOptions = async (): Promise<StarOption[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 'a', name: 'Opción Favorita 1' },
        { id: 'b', name: 'Opción Favorita 2' },
        { id: 'c', name: 'Opción Favorita 3' },
      ]);
    }, 1000);
  });
};

export default function SolicitudViaje(): JSX.Element {

  const { theme } = useTheme(); //para cambiar el tema

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [loadingTravel, setLoadingTravel] = useState<boolean>(false);

  const [starOptions, setStarOptions] = useState<StarOption[]>([]);
  const [starDropdownVisible, setStarDropdownVisible] = useState<boolean>(false);
  const [loadingStar, setLoadingStar] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');

  // Función para obtener los tokens desde AsyncStorage
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

  
const fetchTravelOptions = async (): Promise<TravelOption[]> => {
  try {
    const petition = await axios.request(
      {
        method: ConfigVariables.api.trip.getAll.method,
        url: ConfigVariables.api.trip.getAll.url,
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    )
    const data: TravelOption[] = petition.data.result;
    return data;
  } catch (error) {
    console.error('Error al obtener opciones de viaje:', error);
    return [];
  }
};

  // Ejemplo de uso en useEffect
  useEffect(() => {
    const loadTokens = async () => {
      await getTokens();
      if (access_token && refresh_token) {
        console.log('Tokens recuperados correctamente');
      }
    };
    loadTokens();
  }, []);

  const router = useRouter();

  // Maneja la búsqueda al confirmar el texto
  const handleSearchSubmit = async () => {
    setLoadingTravel(true);
    const results = await fetchTravelOptions();
    setTravelOptions(results);
    setLoadingTravel(false);
  };

  // Alterna la visibilidad del dropdown de la estrella
  const toggleStarDropdown = async () => {
    if (!starDropdownVisible) {
      setLoadingStar(true);
      const options = await fetchStarOptions();
      setStarOptions(options);
      setLoadingStar(false);
      setStarDropdownVisible(true);
    } else {
      setStarDropdownVisible(false);
    }
  };
   // Función para manejar la acción al presionar una opción de viaje
   const handleTravelPress = async (item: TravelOption) => {
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

  const renderTravelOption = ({ item }: { item: TravelOption }) => (
    <View style={styles.travelOption}>
      <View style={styles.travelTextContainer}>
        <Text style={styles.travelTitle}>{`${item.origin} → ${item.destination}`}</Text>
        <Text style={styles.travelDescription}>{`Fecha: ${item.departureDate} • Precio: $${item.price}`}</Text>
      </View>
      <TouchableOpacity 
        style={styles.verViajeButton} 
        onPress={() => handleTravelPress(item)}
      >
        <Text style={styles.verViajeButtonText}>Ver viaje</Text>
      </TouchableOpacity>
    </View>
  );
  const logoAnim = useRef(new Animated.Value(300)).current;
  
  useEffect(() => {
    // Animate the logo from off-screen right (300) to its final position (0) with a bounce effect
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: App Name Image */}
        <Image
          source={require("../assets/images/Nombre (2).png")} // Replace with your app name image
          style={styles.appNameImage}
          resizeMode="contain"
        />
        {/* Right: Animated Logo */}
        <Animated.Image
          source={
            theme === "dark"
              ? require("../assets/images/icon-black.png")
              : require("../assets/images/icon-black.png")
          }
          style={[
            styles.animatedLogo,
            { transform: [{ translateX: logoAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>
      {/* Header con barra de búsqueda y botón de estrella */}
      <View style={styles.textnormalcontainer}>
        <Text style={styles.textnormal}>Solicita tu viaje   </Text>
        <Ionicons name="car-outline" size={40} color={theme === "dark" ? "#fff" : "#fff"} />
      </View>
      <View style={styles.headerContainer}>
        <TextInput
          style={[styles.title, theme === "dark" && styles.title2]}
          placeholder="Buscar viaje..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        />
      </View>

      {/* Lista de opciones de viaje */}
      <View style={styles.travelOptionsContainer}>
        {loadingTravel ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : travelOptions.length > 0 ? (
          <FlatList
            data={travelOptions}
            keyExtractor={(item) => item.id}
            renderItem={renderTravelOption}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noResultsText}>No hay opciones de viaje</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  appNameImage: {
    width: 120, // Adjust as needed
    height: 40, // Adjust as needed
    marginHorizontal: 20,
  },
topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 0,
    borderRadius: 20,
    marginHorizontal: -10,
    marginBottom: 10,
  },
animatedLogo: {
    width: 60, // Adjust as needed
    height: 60, // Adjust as needed
    marginHorizontal: 20,
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  textnormal: {fontSize: 24,
    fontWeight: "bold",
    marginBottom: 0,
    textAlign: "left",
    color: "white",
    textAlignVertical: "center",
    
  },
  textnormalcontainer: {marginVertical: 20,
    flexDirection: "row",
    alignContent: "flex-start",
    backgroundColor: "#1B8CA6",
    borderRadius: 20,
    marginBottom: 40,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  title: {
      backgroundColor: "white",
      height: 50,
      borderWidth: 1,
      borderRadius: 35,
      paddingHorizontal: 10,
      marginBottom: 15,
      justifyContent: "center",
      borderColor: "#fc9414",
  },
  title2: {
    color : "white",
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 45, // Espacio para el botón de estrella
    fontSize: 16,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 45, // Espacio para el botón de estrella
    fontSize: 16,
  },
  travelOptionsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  travelOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 0,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "white",
  },
  travelTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  travelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  travelDescription: {
    fontSize: 16,
    color: "#555",
  },
  verViajeButton: {
    backgroundColor: "#fc9414",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  verViajeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
