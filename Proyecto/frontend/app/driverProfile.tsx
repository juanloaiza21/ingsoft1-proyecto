import { useRouter } from "expo-router";
import React, { useState } from "react";
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

export default function DriverProfile() {
  const { theme } = useTheme(); //para cambiar el tema

  const [modalVisible, setModalVisible] = useState(false);
  const [complaint, setComplaint] = useState("");

  // Estado para controlar la visibilidad del modal de calificación
  const [modalVisibleRating, setModalVisibleRating] = useState(false);
  // Estado para almacenar la calificación seleccionada (0-5)
  const [rating, setRating] = useState(0);
  // Estado para almacenar el comentario opcional
  const [ratingComment, setRatingComment] = useState("");

  const handleReport = () => {
    if (complaint.trim() === "") {
      Alert.alert("Error", "Por favor, escribe una queja antes de enviar.");
      return;
    }

    Alert.alert("Queja enviada", "Tu reporte ha sido registrado.", [
      { text: "Aceptar", onPress: () => setModalVisible(false) },
    ]);
    setComplaint(""); // Limpiar el campo después de enviar
  };

  const handleRatingSubmit = () => {
    if (rating === 0) {
      Alert.alert("Error", "Por favor selecciona al menos 1 estrella.");
      return;
    }
    Alert.alert(
      "Calificación enviada",
      `Calificaste al conductor con ${rating} estrellas.\nComentario: ${
        ratingComment || "Ninguno"
      }`,
      [{ text: "Aceptar", onPress: () => setModalVisibleRating(false) }]
    );
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
        source={require("../assets/images/icon-profile.png")}
        style={styles.image}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Daguilastro Ramirez{"\n"}Tel: 316 312 6976{"\n"}Placa: DAG 123
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.buttonText}>Ver historial de viajes</Text>
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
    resizeMode: "contain",
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
