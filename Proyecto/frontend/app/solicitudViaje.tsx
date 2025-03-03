import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./context/themeContext";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
  Animated,
  RefreshControl,
  Dimensions,
  Platform
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";
import { LinearGradient } from "expo-linear-gradient";

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
  const { theme } = useTheme();
  const router = useRouter();
  
  // State variables
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [loadingTravel, setLoadingTravel] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [starOptions, setStarOptions] = useState<StarOption[]>([]);
  const [starDropdownVisible, setStarDropdownVisible] = useState<boolean>(false);
  const [loadingStar, setLoadingStar] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');

  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const searchBarAnim = useRef(new Animated.Value(0)).current;

  // Animation setup
  useEffect(() => {
    // Animate logo sliding in
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
    
    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Scale content up
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();

    // Animate search bar
    Animated.timing(searchBarAnim, {
      toValue: 1,
      duration: 600,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Función para obtener los tokens desde AsyncStorage
  const getTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setAccess_token(accessToken ?? '');
      setRefresh_token(refreshToken ?? '');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error al recuperar tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  };

  const fetchTravelOptions = async (): Promise<TravelOption[]> => {
    try {
      const { accessToken } = await getTokens();
      if (!accessToken) return [];
      
      const petition = await axios.request({
        method: ConfigVariables.api.trip.getAll.method,
        url: ConfigVariables.api.trip.getAll.url,
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
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
    };
    loadTokens();
  }, []);

  // Maneja la búsqueda al confirmar el texto
  const handleSearchSubmit = async () => {
    setLoadingTravel(true);
    const results = await fetchTravelOptions();
    setTravelOptions(results);
    setLoadingTravel(false);
  };

  // RefreshControl handler
  const onRefresh = async () => {
    setRefreshing(true);
    const results = await fetchTravelOptions();
    setTravelOptions(results);
    setRefreshing(false);
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
      else {
        const petition = await axios.request({
          method: ConfigVariables.api.driver.getOne.method,
          url: `${ConfigVariables.api.driver.getOne.url}${item.driverId}`,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
        const driver: ApiResponse = petition.data;
        
        const calf = await axios.request({
          method: ConfigVariables.api.calification.getProm.method,
          url: `${ConfigVariables.api.calification.getProm.url}${driver.result.id}`,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
        });
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
      console.error(error);
    }
  };

  // Separate component for trip items to properly use hooks
  const TravelOptionItem = React.memo(({ item, index, onPress }: { item: TravelOption, index: number, onPress: (item: TravelOption) => void }) => {
    const buttonAnim = useRef(new Animated.Value(0)).current;
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemScaleAnim = useRef(new Animated.Value(0.9)).current;
    
    const handlePressIn = () => {
      Animated.spring(buttonAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(buttonAnim, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };
    
    // Calculate animation delay based on index
    const animDelay = index * 100;
    
    // Create animation for item entrance
    useEffect(() => {
      Animated.sequence([
        Animated.delay(animDelay),
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(itemScaleAnim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }, []);
    
    return (
      <Animated.View 
        style={{
          opacity: itemFadeAnim,
          transform: [{ scale: itemScaleAnim }]
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View 
            style={[
              styles.travelOption,
              {
                transform: [{ 
                  scale: buttonAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 0.97]
                  })
                }]
              }
            ]}
          >
            <LinearGradient
              colors={["#1B8CA6", "#0a6a80"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.travelOptionHeader}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="map" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.travelTitle}>{`${item.origin} → ${item.destination}`}</Text>
              </View>
            </LinearGradient>

            <View style={styles.travelContent}>
              <View style={styles.travelDetail}>
                <Ionicons name="calendar" size={18} color="#1B8CA6" style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  Fecha: {new Date(item.departureDate).toLocaleDateString()}
                </Text>
              </View>
              
              <View style={styles.travelDetail}>
                <Ionicons name="time" size={18} color="#1B8CA6" style={styles.detailIcon} />
                <Text style={styles.detailText}>
                  Hora: {new Date(item.departureDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </Text>
              </View>
              
              <View style={styles.priceContainer}>
                <Ionicons name="pricetag" size={18} color="#11ac28" style={styles.detailIcon} />
                <Text style={styles.priceText}>
                  ${item.price.toFixed(2)} COP
                </Text>
              </View>
              
              <TouchableOpacity 
                style={styles.verViajeButtonContainer}
                onPress={() => onPress(item)}
              >
                <LinearGradient
                  colors={["#fc9414", "#f57c00"]}
                  start={[0, 0]}
                  end={[1, 0]}
                  style={styles.verViajeButton}
                >
                  <Ionicons name="eye" size={18} color="white" style={styles.buttonIcon} />
                  <Text style={styles.verViajeButtonText}>Ver viaje</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: App Name Image */}
        <Image
          source={require("../assets/images/Nombre (2).png")}
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

      {/* Header con barra de búsqueda y título */}
      <Animated.View 
        style={[
          styles.titleContainer, 
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        <LinearGradient
          colors={["#1B8CA6", "#0a6a80"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.titleGradient}
        >
          <Ionicons name="car-outline" size={28} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.textnormal}>Solicita tu viaje</Text>
        </LinearGradient>
      </Animated.View>

      {/* Search Bar */}
      <Animated.View 
        style={[
          styles.searchContainer,
          {
            opacity: searchBarAnim,
            transform: [
              { 
                translateY: searchBarAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0]
                })
              }
            ]
          }
        ]}
      >
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#777" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar viaje..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearchSubmit}
            returnKeyType="search"
            placeholderTextColor="#888888"
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={handleSearchSubmit}
          >
            <LinearGradient
              colors={["#fc9414", "#f57c00"]}
              start={[0, 0]}
              end={[1, 0]}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>Buscar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Lista de opciones de viaje */}
      <View style={styles.travelOptionsContainer}>
        {loadingTravel ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#fc9414" />
            <Text style={styles.loadingText}>Buscando viajes disponibles...</Text>
          </View>
        ) : travelOptions.length > 0 ? (
          <FlatList
            data={travelOptions}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <TravelOptionItem 
                item={item} 
                index={index} 
                onPress={handleTravelPress} 
              />
            )}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#fc9414"]}
                tintColor={theme === "dark" ? "#fc9414" : "#fc9414"}
              />
            }
          />
        ) : (
          <Animated.View 
            style={[
              styles.emptyContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Ionicons name="car-sport" size={80} color="#1B8CA6" style={styles.emptyIcon} />
            <Text style={styles.noResultsText}>No hay opciones de viaje disponibles</Text>
            <Text style={styles.noResultsSubText}>
              Realiza una búsqueda o arrastra hacia abajo para actualizar
            </Text>
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={onRefresh}
            >
              <LinearGradient
                colors={["#1B8CA6", "#0a6a80"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.refreshButtonGradient}
              >
                <Ionicons name="refresh" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.refreshButtonText}>Actualizar</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#024059',
  },
  appNameImage: {
    width: 120,
    height: 40,
    marginHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  animatedLogo: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  titleContainer: {
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  textnormal: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "#fc9414",
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  searchButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  travelOptionsContainer: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  noResultsText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noResultsSubText: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginBottom: 30,
  },
  refreshButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  refreshButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  travelOption: {
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'white',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  travelOptionHeader: {
    padding: 12,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  travelContent: {
    padding: 16,
  },
  travelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  travelDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#444',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#11ac28',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#11ac28',
  },
  verViajeButtonContainer: {
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 5,
  },
  verViajeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  verViajeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
