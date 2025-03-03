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
} from "react-native";
import { useRouter } from "expo-router";
import type { Calification } from "./types/calification-response.types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import { Driver } from "./types/driver.types";
import { Trip } from "./types/trip.types";
import { User } from "./types/user.types";

export default function Calification(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  const [calification, setCalification] = useState<Calification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedTrip, setSelectedCalification] = useState<Calification | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [travelData, setTravelData] = useState<{
    driver: Driver | null;
    travel: Trip | null;
    user: User | null;
  }>({
    driver: null,
    travel: null,
    user: null,
  });

  // Animation for the logo
  const logoAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
    // Animate the logo from off-screen right to its final position
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
  }, []);

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

  const fetchCalifications = async (): Promise<Calification[]> => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem('calificationsData');
      if (storedData) {
        const parsedData: Calification[] = JSON.parse(storedData);
        setCalification(parsedData);
        return parsedData;
      }
      return [];
    } catch (error) {
      console.error('Error fetching califications:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadCalifications = async () => {
      await fetchCalifications();
      if (calification) {
        console.log("Califications loaded successfully");
      }
    };
    loadCalifications();
  }, []);

  const handleTripPress = (calification: Calification) => {
    setSelectedCalification(calification);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedCalification(null);
  };

  const handleDriverPress = () => {
    router.push("/driverProfile");
    closeModal();
  };

  const renderCalificationItem = ({ item }: { item: Calification }): JSX.Element => {
    return (
      <TouchableOpacity
        style={styles.tripItem}
        onPress={() => handleTripPress(item)}
      >
        <View style={styles.ratingContainer}>
          <Text style={styles.scoreText}>
            {item.score}
          </Text>
          <View style={styles.starsContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <FontAwesome
                key={star}
                name={star <= item.score ? "star" : "star-o"}
                size={16}
                color={star <= item.score ? "#FFD700" : "#d3d3d3"}
                style={styles.starIcon}
              />
            ))}
          </View>
        </View>
        <Text style={styles.commentText}>
          {item.comment}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}>
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

      <Text style={styles.pageTitle}>
        Calificaciones y comentarios
      </Text>

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#fc9414" />
        </View>
      ) : (
        <FlatList
          data={calification}
          keyExtractor={(item) => item.id}
          renderItem={renderCalificationItem}
          contentContainerStyle={styles.listContainer}
        />
      )}

      {/* Modal de detalles */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTrip && (
              <>
                <Text style={styles.modalTitle}>Detalles de Calificación</Text>
                <View style={styles.modalRatingContainer}>
                  <Text style={styles.modalRatingText}>
                    Calificación: {selectedTrip.score}
                  </Text>
                  <View style={styles.modalStarsContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FontAwesome
                        key={star}
                        name={star <= selectedTrip.score ? "star" : "star-o"}
                        size={24}
                        color={star <= selectedTrip.score ? "#FFD700" : "#d3d3d3"}
                        style={styles.modalStarIcon}
                      />
                    ))}
                  </View>
                </View>

                <View style={styles.commentContainer}>
                  <Text style={styles.modalLabel}>Comentario:</Text>
                  <Text style={styles.modalCommentText}>{selectedTrip.comment}</Text>
                </View>

                <View style={styles.dateContainer}>
                  <Text style={styles.modalLabel}>Fecha:</Text>
                  <Text style={styles.modalDateText}>
                    {new Date(selectedTrip.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <TouchableOpacity
                  style={styles.viewProfileButton}
                  onPress={() => {
                    closeModal();
                    router.push("/driverProfile");
                  }}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="person" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Ver perfil del conductor</Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <View style={styles.buttonContent}>
                    <Ionicons name="close-circle" size={20} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Cerrar</Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fc9414",
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
    marginHorizontal: 10,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  tripItem: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#1B8CA6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starIcon: {
    marginHorizontal: 2,
  },
  commentText: {
    fontSize: 16,
    color: "white",
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: "#f0f0f0",
    textAlign: "right",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#024059",
    borderRadius: 15,
    padding: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 15,
  },
  modalRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "#1B8CA6",
    padding: 10,
    borderRadius: 10,
  },
  modalRatingText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginRight: 10,
  },
  modalStarsContainer: {
    flexDirection: "row",
  },
  modalStarIcon: {
    marginHorizontal: 3,
  },
  commentContainer: {
    backgroundColor: "#1B8CA6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  dateContainer: {
    backgroundColor: "#1B8CA6",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 5,
  },
  modalCommentText: {
    fontSize: 16,
    color: "white",
  },
  modalDateText: {
    fontSize: 16,
    color: "white",
  },
  viewProfileButton: {
    backgroundColor: "#fc9414",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#c91905",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonIcon: {
    marginRight: 8,
  },
});
