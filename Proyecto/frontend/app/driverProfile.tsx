import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
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
} from "react-native";

import { FontAwesome } from "@expo/vector-icons";

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
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { Driver } from "./types/driver.types";
import { Trip } from "./types/trip.types";
import { User } from "./types/user.types";
import { Calification } from "./types/calification-response.types";
import { ApiResponse } from "./types/api-response.type";

export default function DriverProfile() {
  const { theme } = useTheme(); //para cambiar el tema

  const router = useRouter(); //para navegar a otra pantalla

  const [modalVisible, setModalVisible] = useState(false);
  const [complaint, setComplaint] = useState("");
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

  const fetchCalifications = async (): Promise<void> => {
    try {
      const result: Calification[] = []
      const petition = await axios.request({
        method: ConfigVariables.api.calification.getAll.method,
        url: ConfigVariables.api.calification.getAll.url+ travelData.user?.id,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      const data: ApiResponse = petition.data;
      data.result.forEach((calification: Calification) => {
        result.push(calification);
      });
      // Store califications data in AsyncStorage
      try {
        await AsyncStorage.setItem('calificationsData', JSON.stringify(result));
        console.log('Califications data saved successfully');
      } catch (error) {
        console.error('Failed to save califications data:', error);
      }
      return;
    } catch (error) {
      console.error(error);
      return;  // Return empty array in case of error
    }
  };

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
  
    // Load travel data when component mounts
    useEffect(() => {
      loadTravelData();
    }, []);

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

  // Estado para controlar la visibilidad del modal de calificación
  const [modalVisibleRating, setModalVisibleRating] = useState(false);
  // Estado para almacenar la calificación seleccionada (0-5)
  const [rating, setRating] = useState(0);
  // Estado para almacenar el comentario opcional
  const [ratingComment, setRatingComment] = useState("");

  const handleReport = async () => {
    if (complaint.trim() === "") {
      Alert.alert("Error", "Por favor, escribe una queja antes de enviar.");
      return;
    }
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
    })
    await fetchCalifications();
    Alert.alert("Queja enviada", "Tu reporte ha sido registrado.", [
      { text: "Aceptar", onPress: () => setModalVisible(false) },
    ]);
    setComplaint(""); // Limpiar el campo después de enviar
  };

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
      })
      await fetchCalifications();
      console.log('Calificación enviada correctamente');
      Alert.alert(
        "Calificación enviada",
        `Calificaste al conductor con ${rating} estrellas.\nComentario: ${
          ratingComment || "Ninguno"
        }`,
        [{ text: "Aceptar", onPress: () => setModalVisibleRating(false) }]
      );
    } catch (error) {
      console.error("Error al enviar calificación:", error);
      Alert.alert("Error", "No se pudo enviar la calificación.");
      return;
    }
    setRating(0); // Reiniciar la calificación
    setRatingComment(""); // Limpiar el comentario
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      <Text style={[styles.title, theme === "dark" && styles.title2]}>
        Perfil del conductor
      </Text>
      <Image
        source={require("../assets/images/Daguilastrico.jpeg")}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {travelData.user?.name}{"\n"}Tel: {travelData.user?.phoneNumber?.replace(/^\+57/, '')}{"\n"}runtNumber: {travelData.driver?.runtNumber}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => {
            fetchCalifications();
            router.push("/calification");
          }}
        >
          <Text style={styles.buttonText}>Ver calificaciones</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setModalVisibleRating(true)}
        >
          <Text style={styles.buttonText}>Calificar conductor</Text>
        </TouchableOpacity>

        {/* Modal de Calificación */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleRating}
          onRequestClose={() => setModalVisibleRating(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Califica al conductor</Text>

              {/* Campo de texto para comentario opcional */}
              <TextInput
                style={styles.input}
                placeholder="Añade un comentario (opcional)..."
                multiline
                value={ratingComment}
                onChangeText={setRatingComment}
              />

              {/* Estrellas de calificación */}
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setRating(star)}>
                    <FontAwesome
                      name={star <= rating ? "star" : "star-o"}
                      size={40}
                      color={star <= rating ? "#FFD700" : "#d3d3d3"}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleRatingSubmit}
              >
                <Text style={styles.buttonText}>Enviar calificación</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisibleRating(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.optionButtonReport}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.buttonText}>Reportar conductor</Text>
        </TouchableOpacity>

        {/* Modal de Reporte */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escribe tu queja</Text>
              <TextInput
                style={styles.input}
                placeholder="Describe el problema..."
                multiline
                value={complaint}
                onChangeText={setComplaint}
              />
              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleReport}
              >
                <Text style={styles.buttonText}>Enviar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  title2: {
    fontSize: 26, // Un poco más grande
    fontWeight: "bold",
    color: "white", // Color más elegante y menos básico que el negro puro
    marginRight: 0, // Espacio con la imagen
    textTransform: "uppercase", // Convierte el texto en mayúsculas
    letterSpacing: 1, // Espacia un poco las letras para un diseño más limpio

    marginBottom: 22,
    marginLeft: 15,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: "cover", // Changed from "contain" to "cover" to fill the circle
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  optionButton: {
    backgroundColor: "#007bff",
    padding: 27,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 30,
  },
  optionButtonReport: {
    backgroundColor: "#c91905",
    padding: 27,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginVertical: 10,
    marginTop: 30,
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
});
