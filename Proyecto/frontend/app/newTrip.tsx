import React, { useState, useEffect, useRef } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, 
  AppState, Linking, Animated, Image, ActivityIndicator 
} from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Trip } from './types/trip.types';
import { Driver } from "./types/driver.types";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from "./types/user.types";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { ApiResponse } from "./types/api-response.type";
import { CheckoutResponse } from "./types/chackout.types";
import * as WebBrowser from 'expo-web-browser';
import { LinearGradient } from "expo-linear-gradient";

export default function Page() {
  const { theme } = useTheme();
  const router = useRouter();
  
  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // State variables
  const [travelData, setTravelData] = useState<{
    driver: Driver | null;
    travel: Trip | null;
    user: User | null;
  }>({
    driver: null,
    travel: null,
    user: null,
  });
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [paymentReference, setPaymentReference] = useState<string>('');
  const [urlPayment, setUrlPayment] = useState<string | null>(null);
  const [collectorId, setCollectorId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

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

  // Load travel data from AsyncStorage
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

  useEffect(() => {
    loadTravelData();
  }, []);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = async (): Promise<{link: string, collector: string}> => {
    setLoading(true);
    try {
      let user1Petition = await axios.request({
        method: ConfigVariables.api.auth.checkJWT.method,
        url: ConfigVariables.api.auth.checkJWT.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      let user:ApiResponse = user1Petition.data;
      user1Petition = await axios.request({
        method: ConfigVariables.api.user.getOne.method,
        url: `${ConfigVariables.api.user.getOne.url}${user.result.userId}`,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      user = user1Petition.data;
      const petition = await axios.request({
        method: ConfigVariables.api.payment.generate.method,
        url: ConfigVariables.api.payment.generate.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data:{
          method: "credit_card",
          email: user.result.email,
          tripId: travelData.travel?.id,
          value: travelData.travel?.price,
        }
      });
      const result: ApiResponse = petition.data;
      const payment: CheckoutResponse = result.result;
      const collector = await axios.request({
        method: ConfigVariables.api.payment.getPref.method,
        url: ConfigVariables.api.payment.getPref.url+payment.billId,
      });
      setPaymentReference(payment.billId);
      setCollectorId(collector.data.result.collectorId);
      console.log(payment.billId);
      console.log(collector.data.result);
      return {link: payment.paylink, collector: payment.externalId};
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Ocurrió un error al programar el viaje, por favor intenta de nuevo",
        [{ text: "OK" }]
      );
      return{link: '', collector: ''};
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (paymentReference:string) => {
    try {
      setLoading(true);
      console.log(ConfigVariables.api.payment.getPayment.url+paymentReference); 
      const validation = await axios.request({
        method: ConfigVariables.api.payment.getBill.method,
        url: ConfigVariables.api.payment.getBill.url+paymentReference,
      });
      const data: ApiResponse = validation.data;
      if (data.result.status === 'ACCEPTED') {
        await axios.request({
          method: ConfigVariables.api.trip.userJoinTrip.method,
          url: ConfigVariables.api.trip.userJoinTrip.url,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
          data:{
            tripId: travelData.travel?.id,
          }
        })
        console.log('vinculado al viaje '+travelData.travel?.id);
        Alert.alert(
          "Pago exitoso",
          "Tu pago ha sido procesado con éxito, se le notificará al conductor",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Pago fallido",
          "Tu pago no ha sido procesado con éxito, por favor intenta de nuevo",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log(error);
      Alert.alert(
        "Error",
        "Ocurrió un error al programar el viaje, por favor intenta de nuevo",
        [{ text: "OK" }]
      );
    } finally{
      setLoading(false);
      setShowCancelConfirm(false);
    }
  };

  const dismissCancel = () => {
    setShowCancelConfirm(false);
  };

  const renderDriverCard = () => {
    if (!travelData.driver) {
      return (
        <Animated.View style={[styles.driverCard, {opacity: fadeAnim, transform: [{scale: scaleAnim}]}]}>
          <View style={styles.driverIcon}>
            <Ionicons name="person-outline" size={40} color="gray" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>Sin conductor asignado</Text>
            <Text style={styles.carInfo}>
              Aún no se ha asignado un conductor para este viaje
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#888" />
              <Text style={styles.rating}>Pendiente</Text>
            </View>
          </View>
        </Animated.View>
      );
    }
    else {
      return (
        <Animated.View style={[styles.driverCard, {opacity: fadeAnim, transform: [{scale: scaleAnim}]}]}>
          <View style={styles.driverIcon}>
            <Ionicons name="person" size={40} color="white" />
          </View>
          <View style={styles.driverInfo}>
            <Text style={styles.driverName}>{travelData.user?.name || 'Nombre no disponible'}</Text>
            <Text style={styles.carInfo}>
              Piloto de elite • {travelData.driver.runtNumber}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={20} color="#FFD700" />
              <Text style={styles.rating}>{travelData.driver.calification.toFixed(1)}</Text>
            </View>
          </View>
        </Animated.View>
      );
    }
  };

  // Animation for button press
  const animatePress = (value) => {
    return {
      transform: [
        {
          scale: value.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0.95],
          }),
        },
      ],
    };
  };

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

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 20 }}>
        <Animated.View style={{opacity: fadeAnim}}>
          <Text style={styles.pageTitle}>
            Nuevo viaje
          </Text>
        </Animated.View>

        {renderDriverCard()}

        <Animated.View style={{opacity: fadeAnim, transform: [{scale: scaleAnim}]}}>
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.meetingPoint}
          >
            <Ionicons name="location" size={24} color="white" style={styles.pointIcon} />
            <View>
              <Text style={styles.meetingPointTitle}>Punto de encuentro:</Text>
              <Text style={styles.meetingPointValue}>
                {travelData.travel?.origin || 'Punto no disponible'}
              </Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{opacity: fadeAnim, transform: [{scale: scaleAnim}], marginTop: 15}}>
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.meetingPoint}
          >
            <Ionicons name="flag" size={24} color="white" style={styles.pointIcon} />
            <View>
              <Text style={styles.meetingPointTitle}>Destino:</Text>
              <Text style={styles.meetingPointValue}>{travelData.travel?.destination}</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        <Animated.View style={{marginTop: 20, opacity: fadeAnim}}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/driverProfile")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={["#1B8CA6", "#0a6a80"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <Ionicons name="person" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Ver perfil del conductor</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL(`tel:${travelData.user?.phoneNumber}`)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={["#1B8CA6", "#0a6a80"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <Ionicons name="call" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Contactar</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.buttonGreen} 
            onPress={handleCancel}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={["#11ac28", "#0a8a1f"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <Ionicons name="checkmark-circle" size={20} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Programar viaje</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View style={[styles.tripInfoContainer, {opacity: fadeAnim, transform: [{scale: scaleAnim}]}]}>
          <Text style={styles.infoHeader}>Información del viaje</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={24} color="white" />
            <Text style={styles.infoText}>
              Fecha y hora: {travelData.travel?.beginDate.toString() || 'Fecha no disponible'}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={24} color="white" />
            <Text style={styles.infoText}>Costo total: ${travelData.travel?.price} COP</Text>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="location-outline" size={24} color="white" />
            <Text style={styles.infoText}>Distancia: 5.2 km</Text>
          </View>
        </Animated.View>
      </ScrollView>

      {showCancelConfirm && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent, 
              {transform: [{scale: scaleAnim}]}
            ]}
          >
            <Text style={styles.modalTitle}>Confirmar Viaje</Text>
            <Text style={styles.modalText}>
              ¿Estás seguro de que deseas pactar el viaje?
            </Text>
            
            {loading ? (
              <ActivityIndicator size="large" color="#fc9414" style={{marginVertical: 20}} />
            ) : (
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={dismissCancel}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={async () => {
                    const data = !urlPayment ? await confirmCancel() : {link: urlPayment, collector: collectorId};
                    const {link, collector} = data;
                    if (link) {
                      setUrlPayment(link);
                      setCollectorId(collectorId);
                      // Open the payment link in browser
                      await WebBrowser.openBrowserAsync(link);
                      
                      // Set up AppState listener to detect when browser is closed
                      const handleAppStateChange = (nextAppState: string) => {
                        if (nextAppState === 'active') {
                          // Browser was closed, process the payment
                          if (collector) {
                            handlePayment(collector);
                          }
                          // Clean up the subscription
                          subscription.remove();
                        }
                      };
                      
                      // Add the AppState change listener
                      const subscription = AppState.addEventListener('change', handleAppStateChange);
                    }
                  }}
                >
                  <Text style={styles.confirmButtonText}>Pactar viaje</Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        </View>
      )}
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
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 20,
    backgroundColor: "#1B8CA6",
    padding: 15,
    borderRadius: 10,
  },
  driverCard: {
    backgroundColor: "#1B8CA6",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  driverIcon: {
    width: 60,
    height: 60,
    backgroundColor: "#fc9414",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  driverInfo: {
    marginLeft: 16,
    flex: 1,
  },
  driverName: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  carInfo: {
    color: "white",
    marginVertical: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    color: "white",
    marginLeft: 4,
    fontWeight: "bold",
  },
  meetingPoint: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  pointIcon: {
    marginRight: 10,
  },
  meetingPointTitle: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  meetingPointValue: {
    color: "white",
    fontSize: 16,
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  buttonGreen: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
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
  tripInfoContainer: {
    backgroundColor: "#1B8CA6",
    borderRadius: 12,
    padding: 16,
    marginTop: 15,
  },
  infoHeader: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 8,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    color: "white",
    marginLeft: 12,
    fontSize: 16,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#024059",
    borderRadius: 16,
    padding: 24,
    width: "85%",
    borderWidth: 2,
    borderColor: "#fc9414",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "white",
    textAlign: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
    color: "white",
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#c91905",
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    fontWeight: "bold",
    color: "white",
  },
  confirmButton: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: "#11ac28",
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});
