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
  Animated,
  Dimensions
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";
import { Trip } from "./types/trip.types";
import { LinearGradient } from "expo-linear-gradient";

export default function Historial(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();
  
  // State variables
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');

  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  
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
  }, []);

  // Get tokens from AsyncStorage
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

  // Fetch trips from API
  const fetchTrips = async (): Promise<Trip[]> => {
    const trips: Trip[] = [];
    setLoading(true);
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
      });
      
      const data: ApiResponse = petition.data;
      const tripsData: Trip[] = data.result;
      
      tripsData.forEach((trip) => {
        if(trip.status === 'COMPLETED')
        trips.push(trip);
      });
    } catch (error) {
      console.error("Error fetching trips", error);
    } finally {
      setLoading(false);
      return trips;
    }
  };
  
  useEffect(() => {
    fetchTrips().then((data) => {
      setTrips(data);
    });
  }, []);

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

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalVisible(true);
    
    // Animate modal scale
    Animated.spring(modalScaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const closeModal = () => {
    // Animate modal scale down
    Animated.timing(modalScaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setModalVisible(false);
      setSelectedTrip(null);
    });
  };

  // Animation for button press
  const buttonAnimValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(buttonAnimValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnimValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Create animated style for press effect
  const animatePress = {
    transform: [
      {
        scale: buttonAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
    ],
  };

  const renderTripItem = ({ item, index }: { item: Trip, index: number }) => (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{
          translateY: fadeAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [50, 0]
          })
        }],
      }}
    >
      <TouchableOpacity
        style={styles.tripItem}
        onPress={() => handleDriverPress(item)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={["#1B8CA6", "#0a6a80"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.tripItemGradient}
        >
          <View style={styles.tripHeader}>
            <Ionicons name="car-sport" size={24} color="white" style={{ marginRight: 10 }}/>
            <Text style={styles.tripTitle}>Viaje: {item.id.split('-').slice(2,3).join('-')}</Text>
          </View>
          
          <View style={styles.tripInfoContainer}>
            <View style={styles.infoRow}>
              <Ionicons name="calendar" size={20} color="#fc9414" style={styles.infoIcon}/>
              <Text style={styles.infoText}>
                Inicio: {new Date(item.beginDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="time" size={20} color="#fc9414" style={styles.infoIcon}/>
              <Text style={styles.infoText}>
                Fin: {new Date(item.endDate).toLocaleDateString()}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons name="pricetag" size={20} color="#fc9414" style={styles.infoIcon}/>
              <Text style={styles.infoText}>
                Precio: ${item.price.toFixed(2)}
              </Text>
            </View>
            
            <View style={styles.infoRow}>
              <Ionicons
                name={
                  item.status === "COMPLETED"
                    ? "checkmark-circle"
                    : item.status === "CANCELLED"
                    ? "close-circle"
                    : "alert-circle"
                }
                size={20}
                color={item.status === "COMPLETED" ? "#11ac28" : "#c91905"}
                style={styles.infoIcon}
              />
              <Text style={styles.infoText}>Estado: {item.status}</Text>
            </View>
          </View>
          
          {/* View details button */}
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => handleTripPress(item)}
          >
            <Text style={styles.detailsButtonText}>Ver detalles</Text>
            <Ionicons name="chevron-forward" size={18} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" },
      ]}
    >
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

      {/* Page Title */}
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          marginBottom: 20
        }}
      >
        <LinearGradient
          colors={["#1B8CA6", "#0a6a80"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.pageTitleContainer}
        >
          <Text style={styles.pageTitle}>
            Historial de Viajes
          </Text>
          <Ionicons name="time" size={24} color="white" />
        </LinearGradient>
      </Animated.View>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fc9414" />
        </View>
      ) : trips.length === 0 ? (
        <Animated.View 
          style={[
            styles.emptyContainer, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Ionicons name="car-sport" size={60} color="#fc9414" style={styles.emptyIcon} />
          <Text style={styles.emptyText}>No hay viajes completados en tu historial</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Modal de detalles del viaje */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              { transform: [{ scale: modalScaleAnim }] }
            ]}
          >
            {selectedTrip && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalles del Viaje</Text>
                  <TouchableOpacity onPress={closeModal} style={styles.closeIcon}>
                    <Ionicons name="close-circle" size={28} color="white" />
                  </TouchableOpacity>
                </View>
                
                <View style={styles.modalInfoCard}>
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="location" size={24} color="#fc9414" style={styles.modalIcon} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Origen</Text>
                      <Text style={styles.modalInfoValue}>{selectedTrip.origin}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="flag" size={24} color="#fc9414" style={styles.modalIcon} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Destino</Text>
                      <Text style={styles.modalInfoValue}>{selectedTrip.destination}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="calendar" size={24} color="#fc9414" style={styles.modalIcon} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Fecha de inicio</Text>
                      <Text style={styles.modalInfoValue}>
                        {new Date(selectedTrip.beginDate).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="time" size={24} color="#fc9414" style={styles.modalIcon} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Fecha de finalización</Text>
                      <Text style={styles.modalInfoValue}>
                        {new Date(selectedTrip.endDate).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.modalInfoRow}>
                    <Ionicons name="pricetag" size={24} color="#fc9414" style={styles.modalIcon} />
                    <View style={styles.modalInfoContent}>
                      <Text style={styles.modalInfoLabel}>Precio</Text>
                      <Text style={styles.modalInfoValue}>
                        ${selectedTrip.price.toFixed(2)} COP
                      </Text>
                    </View>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => {
                    closeModal();
                    router.push("/driverProfile");
                  }}
                >
                  <LinearGradient
                    colors={["#fc9414", "#f57c00"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradientButton}
                  >
                    <Ionicons name="person" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Ver perfil del conductor</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </>
            )}
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
    paddingVertical: 5,
  },
  appNameImage: {
    width: 120,
    height: 40,
    marginHorizontal: 20,
  },
  animatedLogo: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  pageTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyIcon: {
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "white",
    textAlign: "center",
    lineHeight: 26,
  },
  listContainer: {
    paddingBottom: 20,
  },
  tripItem: {
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  tripItemGradient: {
    padding: 16,
  },
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  tripInfoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoIcon: {
    width: 24,
    alignItems: "center",
    marginRight: 10,
  },
  infoText: {
    color: "white",
    fontSize: 16,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fc9414",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#024059",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#fc9414",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeIcon: {
    padding: 5,
  },
  modalInfoCard: {
    backgroundColor: "#1B8CA6",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalInfoRow: {
    flexDirection: "row",
    marginBottom: 16,
    alignItems: "flex-start",
  },
  modalIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  modalInfoContent: {
    flex: 1,
  },
  modalInfoLabel: {
    color: "rgba(255, 255, 255, 0.7)",
    fontSize: 14,
    marginBottom: 4,
  },
  modalInfoValue: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  viewProfileButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
