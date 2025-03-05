import React, { useEffect, useRef, useState } from "react";
import { 
  Animated, 
  TouchableOpacity, 
  Image, 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Platform,
  Modal 
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Trip } from "./types/trip.types";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";

// AnimatedButton Component with enhanced animation
const AnimatedButton = ({
  onPress,
  delay = 0,
  icon,
  title,
  colors,
  style,
}: {
  onPress: () => void;
  delay?: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  colors: readonly [string, string, ...string[]];
  style?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Initial animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);
  
  // Press animation handlers
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        { 
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: buttonScale }
          ] 
        }, 
        style
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors as readonly [string, string, ...string[]]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.buttonGradient}
        >
          <Ionicons name={icon} size={32} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Home() {
  const router = useRouter();
  const { theme } = useTheme();
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [noTripsModalVisible, setNoTripsModalVisible] = useState<boolean>(false);

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
        if(trip.status === 'ONGOING')
        trips.push(trip);
      });
    } catch (error) {
      console.error("Error fetching trips", error);
    } finally {
      return trips;
    }
  };

  const handleViajeActual = async () => {
    const trips = await fetchTrips();
    if (trips.length > 0) {
      router.push("/currentTrip");
    } else {
      setNoTripsModalVisible(true);
    }
  };

  // Animation references
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Run animations on component mount
  useEffect(() => {
    // Animate the logo bouncing in
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
    
    // Animate the header content fading and sliding up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

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

      {/* Animated Header Card */}
      <Animated.View 
        style={[
          styles.headerCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={["#1B8CA6", "#0a6a80"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              ¿A dónde{"\n"}vamos gente?
            </Text>
            <Ionicons name="navigate-circle" size={60} color="rgba(255,255,255,0.3)" style={styles.headerIcon} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Options */}
      <View style={styles.optionsContainer}>
        {/* First row - two main actions with enhanced styling */}
        <View style={styles.optionsRow}>
          <AnimatedButton 
        onPress={() => router.push("/solicitudViaje")} 
        delay={200}
        icon="car-sport"
        title="Solicitar viaje"
        colors={["#fc9414", "#f57c00"]}
        style={styles.optionButton}
          />
          
          <AnimatedButton 
        onPress={() => router.push("/publishTravel")} 
        delay={300}
        icon="create"
        title="Publicar viaje"
        colors={["#11ac28", "#0a8a1f"]}
        style={styles.optionButton}
          />
        </View>

        {/* Second row - remaining actions with consistent styling */}
        <View style={styles.optionsRow}>
          <AnimatedButton
        onPress={() => router.push("/agreedTrips")}
        delay={400}
        icon="calendar"
        title="Viajes programados"
        colors={["#1B8CA6", "#0a6a80"]}
        style={styles.optionButton}
          />

          <AnimatedButton 
        onPress={() => handleViajeActual()} 
        delay={500} 
        icon="navigate-circle" 
        title="Viaje actual" 
        colors={["#9c27b0", "#7b1fa2"]} 
        style={styles.optionButton} 
          />
        </View>
        {/* Modal for no current trips */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={noTripsModalVisible}
          onRequestClose={() => setNoTripsModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={["#1B8CA6", "#0a6a80"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.modalGradient}
              >
                <Ionicons name="alert-circle" size={48} color="white" style={styles.modalIcon} />
                <Text style={styles.modalTitle}>No hay viajes en curso</Text>
                <Text style={styles.modalText}>Actualmente no tienes ningún viaje activo.</Text>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => setNoTripsModalVisible(false)}
                >
                  <Text style={styles.modalButtonText}>Entendido</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Modal>


        {/* Footer promotional card with subtle animation */}
        <Animated.View 
          style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 20,
        marginTop: -15 // Added negative margin to move it up
          }}
        >
          <LinearGradient
        colors={["rgba(27,140,166,0.8)", "rgba(10,106,128,0.9)"]}
        start={[0, 0]}
        end={[1, 1]}
        style={{
          padding: 15,
          borderRadius: 16,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
          >
        <View style={{ flex: 1 }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            ¡Viaja seguro con Owheels!
          </Text>
          <Text style={{ color: 'white', opacity: 0.9, marginTop: 4, fontSize: 12 }}>
            Los mejores viajes al mejor precio
          </Text>
        </View>
        <Ionicons name="shield-checkmark" size={28} color="white" />
          </LinearGradient>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  headerCard: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerGradient: {
    borderRadius: 20,
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    lineHeight: 44,
    flex: 1,
  },
  headerIcon: {
    marginLeft: 10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  wideButton: {
    marginHorizontal: 8,
  },
  buttonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  buttonIcon: {
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalGradient: {
    padding: 20,
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButton: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  modalButtonText: {
    color: '#1B8CA6',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
