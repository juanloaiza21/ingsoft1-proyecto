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
import { Trip } from "./types/trip.types";
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

export default function AgreedTrips(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();
  
  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // State variables
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');

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
      return { accessToken, refreshToken };
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
      const { accessToken } = await getTokens();
      if (!accessToken) return trips;
      
      let user1Petition = await axios.request({
        method: ConfigVariables.api.auth.checkJWT.method,
        url: ConfigVariables.api.auth.checkJWT.url,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      
      let user:ApiResponse = user1Petition.data;
      
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
        if(trip.status !== 'COMPLETED' && trip.status !== 'CANCELLED')
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
          router.navigate('./newTrip');
        } catch (error) {
          console.error('Error saving travel data to AsyncStorage:', error);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchTrips().then((data) => {
      setTrips(data);
      setLoading(false);
    });
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    const newTrips = await fetchTrips();
    setTrips(newTrips);
    setRefreshing(false);
  };

  const handleTripPress = (trip: Trip) => {
    setSelectedTrip(trip);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedTrip(null);
  };

  // Animation for trip items
  const itemAnimations = useRef(new Animated.Value(0)).current;
  
  // Button press animation
  const buttonScaleAnim = (pressed) => {
    return Animated.spring(pressed, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    });
  };

  const getStatusColor = (status: string): readonly [string, string] => {
    switch(status) {
      case 'ACCEPTED': return ['#11ac28', '#0a8a1f'] as const; // Green
      case 'PENDING': return ['#ffab00', '#f57c00'] as const; // Amber
      default: return ['#1B8CA6', '#0a6a80'] as const; // Blue
    }
  };

  // Separate component for trip items to properly use hooks
  const TripItem = React.memo(({ item, index, onPress }: { item: Trip, index: number, onPress: (item: Trip) => void }) => {
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

    // Get item dimensions
    const screenWidth = Dimensions.get('window').width;
    
    return (
      <Animated.View 
        style={{
          opacity: itemFadeAnim,
          transform: [{ scale: itemScaleAnim }]
        }}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => onPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
        >
          <Animated.View 
            style={[
              styles.tripItem,
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
              colors={getStatusColor(item.status)}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.tripItemHeader}
            >
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Ionicons name="car-sport" size={24} color="white" style={{ marginRight: 10 }}/>
                  <Text style={[styles.tripText, { fontSize: 18 }]}>
                    Viaje: {item.id.split('-')[0]}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
              </View>
            </LinearGradient>

            <View style={styles.tripItemContent}>
              <View style={styles.tripDetail}>
                <Ionicons name="location" size={20} color="#fc9414" style={styles.icon}/>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Origen:</Text>
                  <Text style={styles.detailValue}>{item.origin}</Text>
                </View>
              </View>
              
              <View style={styles.tripDetail}>
                <Ionicons name="location" size={20} color="#fc9414" style={styles.icon}/>
                <View style={styles.detailTextContainer}>
                  <Text style={styles.detailLabel}>Destino:</Text>
                  <Text style={styles.detailValue}>{item.destination}</Text>
                </View>
              </View>
              
              <View style={styles.tripTimeInfo}>
                <View style={styles.tripDetailCompact}>
                  <Ionicons name="calendar" size={16} color="#1B8CA6" style={styles.iconSmall}/>
                  <Text style={styles.timeText}>
                    {new Date(item.beginDate).toLocaleDateString()}
                  </Text>
                </View>
                
                <View style={styles.tripDetailCompact}>
                  <Ionicons name="time" size={16} color="#1B8CA6" style={styles.iconSmall}/>
                  <Text style={styles.timeText}>
                    {new Date(item.beginDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </Text>
                </View>
              </View>
              
              <View style={styles.priceContainer}>
                <Ionicons name="pricetag" size={20} color="#11ac28" style={styles.icon}/>
                <Text style={styles.priceText}>
                  ${item.price.toFixed(2)} COP
                </Text>
              </View>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>
    );
  });

  const renderTripItem = ({ item, index }: { item: Trip, index: number }) => {
    return <TripItem item={item} index={index} onPress={handleDriverPress} />;
  };

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
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
          colors={["#fc9414", "#f57c00"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.titleGradient}
        >
          <Ionicons name="calendar-outline" size={28} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.title}>Viajes programados</Text>
        </LinearGradient>
      </Animated.View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#fc9414" />
          <Text style={styles.loadingText}>Cargando viajes...</Text>
        </View>
      ) : trips.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }}
          >
            <Ionicons name="calendar-outline" size={80} color="#1B8CA6" style={styles.emptyIcon} />
            <Text style={styles.emptyText}>No tienes viajes programados</Text>
            <TouchableOpacity
              style={styles.newTripButton}
              onPress={() => router.push("/solicitudViaje")}
            >
              <LinearGradient
                colors={["#1B8CA6", "#0a6a80"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientButton}
              >
                <Ionicons name="add-circle" size={20} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Programar un viaje</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(item) => item.id}
          renderItem={renderTripItem}
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#024059",
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
  titleContainer: {
    marginVertical: 16,
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingContainer: {
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  emptyIcon: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
  },
  newTripButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  tripItem: {
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
  tripItemHeader: {
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tripText: {
    fontWeight: "bold",
    color: "white",
  },
  tripItemContent: {
    padding: 16,
    backgroundColor: 'white',
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
    marginTop: 2,
  },
  iconSmall: {
    marginRight: 5,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: '400',
  },
  tripTimeInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  tripDetailCompact: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    fontSize: 14,
    color: '#333',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
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
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
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
