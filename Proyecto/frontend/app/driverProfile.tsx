import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  TextInput,
  Animated,
  ScrollView,
  Platform,
  Dimensions
} from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { Driver } from "./types/driver.types";
import { Trip } from "./types/trip.types";
import { User } from "./types/user.types";
import { Calification } from "./types/calification-response.types";
import { ApiResponse } from "./types/api-response.type";
import { LinearGradient } from "expo-linear-gradient";

export default function DriverProfile() {
  const { theme } = useTheme();
  const router = useRouter();

  // States
  const [modalVisible, setModalVisible] = useState(false);
  const [complaint, setComplaint] = useState("");
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [modalVisibleRating, setModalVisibleRating] = useState(false);
  const [rating, setRating] = useState(0);
  const [ratingComment, setRatingComment] = useState("");
  const [travelData, setTravelData] = useState<{
    driver: Driver | null;
    travel: Trip | null;
    user: User | null;
  }>({
    driver: null,
    travel: null,
    user: null,
  });

  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const profileImageAnim = useRef(new Animated.Value(0.5)).current;
  const profileFadeAnim = useRef(new Animated.Value(0)).current;
  const buttonRowAnim = useRef(new Animated.Value(-50)).current;
  const reportButtonAnim = useRef(new Animated.Value(50)).current;
  
  // Button animation refs
  const viewRatingButtonAnim = useRef(new Animated.Value(1)).current;
  const rateButtonAnim = useRef(new Animated.Value(1)).current;
  const reportButtonScaleAnim = useRef(new Animated.Value(1)).current;

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
  
  // Fetch califications
  const fetchCalifications = async (): Promise<void> => {
    try {
      if (!travelData.user?.id) return;
      
      const petition = await axios.request({
        method: ConfigVariables.api.calification.getAll.method,
        url: ConfigVariables.api.calification.getAll.url + travelData.user.id,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      
      const data: ApiResponse = petition.data;
      const result: Calification[] = data.result;
      
      // Store califications data in AsyncStorage
      try {
        await AsyncStorage.setItem('calificationsData', JSON.stringify(result));
        console.log('Califications data saved successfully');
      } catch (error) {
        console.error('Failed to save califications data:', error);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to load travel data from AsyncStorage
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

  // Start animations
  useEffect(() => {
    // Animate logo sliding in
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
    
    // Fade in content with sequence
    Animated.sequence([
      Animated.delay(300), // Wait for logo animation
      Animated.parallel([
        // Fade in profile content
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        // Scale content up
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        // Profile image grows and fades in
        Animated.timing(profileFadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(profileImageAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        // Buttons slide in from sides
        Animated.spring(buttonRowAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(reportButtonAnim, {
          toValue: 0,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      ])
    ]).start();
    
    // Load tokens and travel data
    const loadTokens = async () => {
      await getTokens();
      await loadTravelData();
    };
    loadTokens();
  }, []);
  
  // Button animation handlers
  const handlePressIn = (animRef) => {
    Animated.spring(animRef, {
      toValue: 0.95,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = (animRef) => {
    Animated.spring(animRef, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Handle report submission
  const handleReport = async () => {
    if (complaint.trim() === "") {
      Alert.alert("Error", "Por favor, escribe una queja antes de enviar.");
      return;
    }
    
    try {
      await axios.request({
        method: ConfigVariables.api.calification.create.method,
        url: ConfigVariables.api.calification.create.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          score: 1,
          comment: complaint,
          userCalificatedId: travelData.driver?.id,
        },
      });
      
      await fetchCalifications();
      
      Alert.alert("Queja enviada", "Tu reporte ha sido registrado.", [
        { text: "Aceptar", onPress: () => setModalVisible(false) },
      ]);
      setComplaint(""); // Clear field after sending
    } catch (error) {
      console.error("Error al enviar reporte:", error);
      Alert.alert("Error", "No se pudo enviar el reporte.");
    }
  };

  // Handle rating submission
  const handleRatingSubmit = async () => {
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona al menos 1 estrella.");
      return;
    }
    
    try {
      await axios.request({
        method: ConfigVariables.api.calification.create.method,
        url: ConfigVariables.api.calification.create.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          score: rating,
          comment: ratingComment,
          userCalificatedId: travelData.driver?.id,
        },
      });
      
      await fetchCalifications();
      
      const ratingMessage = `Has calificado al conductor con ${rating} ${rating === 1 ? 'estrella' : 'estrellas'}.`;
      const commentMessage = ratingComment ? `\nComentario: ${ratingComment}` : '';
      
      Alert.alert(
        "Calificación enviada",
        ratingMessage + commentMessage,
        [{ text: "Aceptar", onPress: () => setModalVisibleRating(false) }]
      );
      
      // Reset state
      setRating(0);
      setRatingComment("");
    } catch (error) {
      console.error("Error al enviar calificación:", error);
      Alert.alert("Error", "No se pudo enviar la calificación.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
      ]}
      showsVerticalScrollIndicator={false}
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

      {/* Title */}
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
          style={styles.titleGradient}
        >
          <Ionicons name="person-circle" size={28} color="white" style={{ marginRight: 10 }} />
          <Text style={styles.title}>Perfil del Conductor</Text>
        </LinearGradient>
      </Animated.View>

      {/* Profile Card */}
      <Animated.View 
        style={[
          styles.profileCard,
          { 
            opacity: profileFadeAnim,
            transform: [{ scale: profileImageAnim }]
          }
        ]}
      >
        {/* Profile Image */}
        <Image
          source={require("../assets/images/Daguilastrico.jpeg")}
          style={styles.profileImage}
        />
        
        {/* User Info */}
        <View style={styles.profileInfo}>
          {/* User Name */}
          <View style={styles.infoRow}>
            <FontAwesome name="user" size={24} color="#fc9414" style={styles.infoIcon} />
            <Text style={styles.infoText}>{travelData.user?.name}</Text>
          </View>

          {/* Phone Number */}
          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={24} color="#fc9414" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Tel: {travelData.user?.phoneNumber?.replace(/^\+57/, '')}
            </Text>
          </View>

          {/* Runt Number */}
          <View style={styles.infoRow}>
            <MaterialIcons name="sim-card" size={24} color="#fc9414" style={styles.infoIcon} />
            <Text style={styles.infoText}>
              Runt: {travelData.driver?.runtNumber}
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Actions Section */}
      <View style={styles.actionsContainer}>
        {/* Row with two action buttons */}
        <Animated.View
          style={[
        styles.rowContainer,
        { transform: [{ translateX: buttonRowAnim }], justifyContent: 'center' }
          ]}
        >
          {/* View Ratings Button */}
          <Animated.View
        style={{ 
          transform: [{ scale: viewRatingButtonAnim }],
          marginHorizontal: 8
        }}
          >
        <TouchableOpacity
          onPressIn={() => handlePressIn(viewRatingButtonAnim)}
          onPressOut={() => handlePressOut(viewRatingButtonAnim)}
          onPress={async () => {
            await fetchCalifications();
            router.push("/calification");
          }}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1B8CA6", "#0a6a80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={[styles.actionButton, { width: Dimensions.get('window').width * 0.4 }]}
          >
            <View style={styles.buttonContent}>
          <Ionicons name="star-half-outline" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Ver calificaciones</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
          </Animated.View>

          {/* Rate Driver Button */}
          <Animated.View
        style={{ 
          transform: [{ scale: rateButtonAnim }],
          marginHorizontal: 8
        }}
          >
        <TouchableOpacity
          onPressIn={() => handlePressIn(rateButtonAnim)}
          onPressOut={() => handlePressOut(rateButtonAnim)}
          onPress={() => setModalVisibleRating(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={[styles.actionButton, { width: Dimensions.get('window').width * 0.4 }]}
          >
            <View style={styles.buttonContent}>
          <Ionicons name="star" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Calificar conductor</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </View>

        {/* Report Driver Button */}
        <Animated.View
          style={[
            styles.reportButtonContainer,
            { transform: [
                { translateY: reportButtonAnim },
                { scale: reportButtonScaleAnim }
              ] 
            }
          ]}
        >
          <TouchableOpacity
            onPressIn={() => handlePressIn(reportButtonScaleAnim)}
            onPressOut={() => handlePressOut(reportButtonScaleAnim)}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#e53935", "#c62828"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.reportButton}
            >
              <View style={styles.buttonContent}>
                <Ionicons name="alert-circle" size={24} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Reportar conductor</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
    
      {/* Rating Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisibleRating}
        onRequestClose={() => setModalVisibleRating(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={styles.modalContent}
          >
            <LinearGradient
              colors={["#fc9414", "#f57c00"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.modalHeader}
            >
              <Ionicons name="star" size={24} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.modalTitle}>Califica al Conductor</Text>
            </LinearGradient>

            {/* Stars Rating */}
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity 
                  key={star} 
                  onPress={() => setRating(star)}
                  style={styles.starButton}
                >
                  <FontAwesome
                    name={star <= rating ? "star" : "star-o"}
                    size={40}
                    color={star <= rating ? "#FFD700" : "#aaaaaa"}
                  />
                </TouchableOpacity>
              ))}
            </View>
            
            <Text style={styles.ratingLabel}>
              {rating > 0 
                ? `Calificación: ${rating} ${rating === 1 ? 'estrella' : 'estrellas'}`
                : "Selecciona una calificación"}
            </Text>

            {/* Comment Field */}
            <TextInput
              style={styles.commentInput}
              placeholder="Añade un comentario (opcional)..."
              placeholderTextColor="#888888"
              multiline
              numberOfLines={4}
              value={ratingComment}
              onChangeText={setRatingComment}
            />

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisibleRating(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton, rating === 0 && styles.disabledButton]}
                onPress={handleRatingSubmit}
                disabled={rating === 0}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

      {/* Report Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Animated.View 
            style={styles.modalContent}
          >
            <LinearGradient
              colors={["#e53935", "#c62828"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.modalHeader}
            >
              <Ionicons name="alert-circle" size={24} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.modalTitle}>Reportar Conductor</Text>
            </LinearGradient>

            <Text style={styles.modalDescription}>
              Por favor describa el problema o motivo de su reporte.
              Su informe será revisado por nuestro equipo.
            </Text>

            {/* Complaint Input */}
            <TextInput
              style={styles.complainInput}
              placeholder="Describe el problema detalladamente..."
              placeholderTextColor="#888888"
              multiline
              numberOfLines={6}
              value={complaint}
              onChangeText={setComplaint}
            />

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton, 
                  styles.reportSubmitButton,
                  complaint.trim() === "" && styles.disabledButton
                ]}
                onPress={handleReport}
                disabled={complaint.trim() === ""}
              >
                <Text style={styles.modalButtonText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 40,
    backgroundColor: "#024059",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fc9414',
  },
  profileInfo: {
    width: '100%',
    marginTop: 20,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
  actionsContainer: {
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  actionButton: {
    padding: 16,
    borderRadius: 12,
    minWidth: Dimensions.get('window').width * 0.43,
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
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  reportButtonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  reportButton: {
    padding: 16,
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  modalDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 15,
  },
  commentInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    color: '#333',
  },
  complainInput: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 10,
    minHeight: 150,
    textAlignVertical: 'top',
    color: '#333',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 16,
  },
  modalButton: {
    flex: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9e9e9e',
    marginRight: 8,
  },
  submitButton: {
    backgroundColor: '#fc9414',
    marginLeft: 8,
  },
  reportSubmitButton: {
    backgroundColor: '#e53935',
    marginLeft: 8,
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 16,
  },
  starButton: {
    paddingHorizontal: 6,
  },
  ratingLabel: {
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    fontWeight: '500'
  }
});