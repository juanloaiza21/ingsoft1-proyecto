import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert, 
  Image, 
  Dimensions,
  Platform,
  Animated
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from "./context/themeContext";
import { ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function CurrentTrip() {
  const { theme } = useTheme();
  const router = useRouter();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [progress, setProgress] = useState(0);
  const [tripStarted, setTripStarted] = useState(false);
  const intervalRef = useRef<null | NodeJS.Timeout>(null);
  
  // Animation references
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Run animations on component mount
  useEffect(() => {
    // Animate the logo sliding in
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

  // Extraer el tiempo estimado
  const estimatedTimeInMinutes = 35; // Using static value for now

  const startProgress = () => {
    // Clear any existing interval first to prevent multiple intervals running simultaneously
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setTripStarted(true);
    setProgress(0); // Reset progress to 0
    
    // Calculate how much to increment per second
    const incrementPerSecond = 100 / (estimatedTimeInMinutes * 60);
    
    // Update progress every second
    intervalRef.current = setInterval(() => {
      setProgress(prevProgress => {
        const newProgress = prevProgress + incrementPerSecond;
        // If we've reached 100%, clear the interval
        if (newProgress >= 100) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 100;
        }
        return newProgress;
      });
    }, 1000); // Update every 1 second
  };

  // Limpiar el intervalo cuando se desmonte el componente
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const handleCancel = () => {
    setShowCancelConfirm(true);
  };

  const confirmCancel = () => {
    Alert.alert("Viaje Cancelado", "Tu viaje ha sido cancelado con éxito, se le notificará al conductor", [{ text: "OK" }]);
    setShowCancelConfirm(false);
    
    // Detener el progreso si se cancela el viaje
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const dismissCancel = () => {
    setShowCancelConfirm(false);
  };

  // Create a component to animate list items
  const AnimatedCard = ({ delay, children, style }) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemScaleAnim = useRef(new Animated.Value(0.9)).current;
    
    useEffect(() => {
      Animated.sequence([
        Animated.delay(delay),
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
        style={[
          style,
          {
            opacity: itemFadeAnim,
            transform: [{ scale: itemScaleAnim }]
          }
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
    ]}>
      {/* Top Bar - Similar to home.tsx */}
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

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
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
            colors={["#9c27b0", "#7b1fa2"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="navigate-circle" size={28} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>VIAJE ACTUAL</Text>
          </LinearGradient>
        </Animated.View>
        
        {/* Driver Card */}
        <AnimatedCard delay={100} style={styles.cardContainer}>
          <LinearGradient
            colors={["#1B8CA6", "#0a6a80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.driverCard}
          >
            <View style={styles.driverHeader}>
              <View style={styles.driverIconContainer}>
                <Ionicons name="person" size={40} color="white" />
              </View>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>Juan Pérez</Text>
                <View style={styles.carInfoContainer}>
                  <Ionicons name="car-sport" size={16} color="rgba(255,255,255,0.8)" style={{marginRight: 6}} />
                  <Text style={styles.carInfo}>Toyota Corolla • ABC-123</Text>
                </View>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>4.8</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
            
            <TouchableOpacity 
              style={styles.profileButton} 
              onPress={() => router.push("/driverProfile")}
            >
              <Ionicons name="person-circle-outline" size={16} color="white" style={{marginRight: 6}} />
              <Text style={styles.profileButtonText}>Ver perfil</Text>
            </TouchableOpacity>
        </AnimatedCard>
        
        {/* Trip Route Info */}
        <AnimatedCard delay={200} style={styles.cardContainer}>
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.routeCard}
          >
            <View style={styles.routePoint}>
              <View style={styles.routeIconContainer}>
                <View style={styles.routePointDot} />
                <View style={styles.routeLine} />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Origen</Text>
                <Text style={styles.routeValue}>Detrás del CYT</Text>
              </View>
            </View>
            
            <View style={styles.routePoint}>
              <View style={styles.routeIconContainer}>
                <View style={styles.routePointSquare} />
              </View>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>Destino</Text>
                <Text style={styles.routeValue}>Centro comercial Titán plaza</Text>
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>
        
        {/* Progress Card */}
        <AnimatedCard delay={300} style={styles.cardContainer}>
          <LinearGradient
            colors={["#11ac28", "#0a8a1f"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.progressContainer}
          >
            <Text style={styles.progressTitle}>Progreso del viaje</Text>
            
            <View style={styles.progressBarContainer}>
              <Animated.View 
          style={[
            styles.progressBar, 
            { width: `${progress}%` }
          ]} 
              />
            </View>
            
            <View style={styles.progressDetailsContainer}>
              {!tripStarted ? (
          <TouchableOpacity 
            onPress={startProgress} 
            style={styles.startButton}
          >
            <Ionicons name="play-circle" size={20} color="white" style={{marginRight: 8}} />
            <Text style={styles.startButtonText}>Iniciar viaje</Text>
          </TouchableOpacity>
              ) : (
          <View style={styles.progressStats}>
            <Text style={styles.progressPercentText}>{Math.round(progress)}% completado</Text>
            <Text style={styles.progressEstimate}>
              Tiempo restante: ~{Math.ceil(estimatedTimeInMinutes * (1 - progress/100))} min
            </Text>
          </View>
              )}
            </View>
          </LinearGradient>
        </AnimatedCard>
        
        {/* Trip Details Card */}
        <AnimatedCard delay={400} style={styles.cardContainer}>
          <LinearGradient
            colors={["#1B8CA6", "#0a6a80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.tripInfoContainer}
          >
            <Text style={styles.sectionTitle}>Detalles del viaje</Text>
            
            <View style={styles.tripDetailGrid}>
              <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={24} color="rgba(255,255,255,0.9)" />
              <View style={{marginLeft: 12, flex: 1}}>
                <Text style={styles.infoLabel}>Fecha y hora</Text>
                <Text style={styles.infoText}>28/02/24 a las 16:45</Text>
              </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View>
                  <Text style={styles.infoLabel}>Tiempo estimado</Text>
                  <Text style={styles.infoText}>{estimatedTimeInMinutes} min</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View>
                  <Text style={styles.infoLabel}>Costo total</Text>
                  <Text style={styles.infoText}>$14.000 COP</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View>
                  <Text style={styles.infoLabel}>Distancia</Text>
                  <Text style={styles.infoText}>5.2 km</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>
        
        {/* Action Buttons */}
          <AnimatedCard delay={500} style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.finishButton} 
              onPress={() => router.push('/finishedTrip')}
            >
              <LinearGradient
                colors={["#11ac28", "#0a8a1f"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientButton}
              >
                <Ionicons name="checkmark-circle" size={24} color="white" style={{marginRight: 8}} />
                <Text style={styles.buttonText}>Finalizar Viaje</Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={handleCancel}
            >
              <LinearGradient
                colors={["#e53935", "#c62828"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientButton}
              >
                <Ionicons name="close-circle" size={24} color="white" style={{marginRight: 8}} />
                <Text style={styles.buttonText}>Cancelar Viaje</Text>
              </LinearGradient>
            </TouchableOpacity>
          </AnimatedCard>
      </ScrollView>

      {/* Cancel Confirmation Modal */}
      {showCancelConfirm && (
        <View style={styles.modalOverlay}>
          <Animated.View 
            style={[
              styles.modalContent,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Ionicons name="warning" size={32} color="#e53935" style={styles.modalIcon} />
            <Text style={styles.modalTitle}>Cancelar Viaje</Text>
            <Text style={styles.modalText}>¿Estás seguro que deseas cancelar el viaje actual?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalCancelButton} onPress={dismissCancel}>
                <Text style={styles.modalCancelButtonText}>No, continuar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirmButton} onPress={confirmCancel}>
                <Text style={styles.modalConfirmButtonText}>Sí, cancelar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#024059',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  appNameImage: {
    width: 120,
    height: 40,
  },
  animatedLogo: {
    width: 60,
    height: 60,
  },
  titleContainer: {
    marginBottom: 16,
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
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
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
  driverCard: {
    padding: 16,
    borderRadius: 12,
  },
  driverHeader: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  driverIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverInfo: {
    marginLeft: 16,
    flex: 1,
    justifyContent: 'center',
  },
  driverName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  carInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  carInfo: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  rating: {
    marginLeft: 6,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  profileButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  routeCard: {
    padding: 16,
    borderRadius: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  routeIconContainer: {
    width: 24,
    alignItems: 'center',
  },
  routePointDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  routeLine: {
    width: 2,
    height: 30,
    backgroundColor: 'white',
    marginTop: 4,
    marginBottom: 4,
  },
  routePointSquare: {
    width: 12,
    height: 12,
    backgroundColor: 'white',
    borderRadius: 2,
  },
  routeInfo: {
    marginLeft: 12,
    flex: 1,
  },
  routeLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  routeValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  progressContainer: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  progressTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  progressBarContainer: {
    width: '100%',
    height: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 8,
  },
  progressDetailsContainer: {
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  startButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  progressStats: {
    alignItems: 'center',
  },
  progressPercentText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressEstimate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  tripInfoContainer: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  tripDetailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  infoItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginLeft: 8,
  },
  infoText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginLeft: 8,
  },
  actionButtonsContainer: {
    marginTop: 8,
  },
  finishButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  cancelButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: '80%',
    alignItems: 'center',
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
  },
  modalCancelButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  modalCancelButtonText: {
    fontWeight: 'bold',
    color: '#666',
  },
  modalConfirmButton: {
    flex: 1,
    backgroundColor: '#e53935',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
  },
  modalConfirmButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});