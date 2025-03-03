import React, { useEffect, useRef, useState } from "react";
import { Animated, TouchableOpacity, Image, View, Text, StyleSheet, Alert, Modal, TextInput } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome } from "@expo/vector-icons";

export default function UserProfile() {
  const { theme } = useTheme(); // para cambiar el tema
  
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
      `Calificaste al conductor con ${rating} estrellas.\nComentario: ${ratingComment || "Ninguno"}`,
      [{ text: "Aceptar", onPress: () => setModalVisibleRating(false) }]
    );
    setRating(0); // Reiniciar la calificación
    setRatingComment(""); // Limpiar el comentario
  };

  const logoAnim = useRef(new Animated.Value(300)).current;
  
  useEffect(() => {
    // Animate the logo from off-screen right (300) to its final position (0) with a bounce effect
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Image
          source={require("../assets/images/Nombre (2).png")}
          style={styles.appNameImage}
          resizeMode="contain"
        />
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
      <Image
        source={require("../assets/images/icon-profile.png")}
        style={styles.image}
      />
{/* User Name */}
<View style={styles.infoRow}>
        <FontAwesome name="user" size={24} color="black" style={styles.icon} />
        <Text style={styles.infoText}>Daguilastro Ordoñez</Text>
      </View>

      {/* Phone Number */}
      <View style={styles.infoRow}>
        <MaterialIcons name="phone" size={24} color="black" style={styles.icon} />
        <Text style={[styles.infoText]}>Tel: 316 312 6976</Text>
      </View>

      {/* Email */}
      <View style={styles.infoRow}>
        <MaterialIcons name="email" size={24} color="black" style={styles.icon} />
        <Text style={[styles.infoText]}>Correo: daguilastro@daguilastro.com</Text>
      </View>

      <View style={styles.buttonContainer}>
        {/* Row with two buttons */}
        <View style={styles.rowContainer}>
          <TouchableOpacity style={styles.optionButtonRow}>
            <View style={styles.buttonContent}>
              <Ionicons name="time-outline" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Calificaciones de usuario</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.optionButtonRow}
            onPress={() => setModalVisibleRating(true)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="star" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Calificar usuario</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Modal de Calificación */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleRating}
          onRequestClose={() => setModalVisibleRating(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Califica al usuario</Text>
              <TextInput
                style={styles.input}
                placeholder="Añade un comentario (opcional)..."
                multiline
                value={ratingComment}
                onChangeText={setRatingComment}
              />
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

                {/* Single button centered below */}
                <View style={styles.singleButtonContainer}>
          <TouchableOpacity
            style={styles.optionButtonReport}
            onPress={() => setModalVisible(true)}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="alert-circle-outline" size={24} color="white" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Reportar usuario</Text>
            </View>
          </TouchableOpacity>
        </View>


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
    backgroundColor: "black",
    paddingTop: 0,
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
    paddingVertical: -15,
    borderRadius: 20,
    marginHorizontal: -10,
    marginVertical: 5,
    width: "100%",
  },
  animatedLogo: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 20,
    resizeMode: "contain",
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
    color: "white",
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    textAlign: "center",
  },
  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginVertical: 35,
    alignItems: "center",
  },
  optionButtonRow: {
    backgroundColor: "#fc9414",
    padding: 27,
    borderRadius: 10,
    width: "45%",
    alignItems: "center",
    textAlign: "center",
  },
  singleButtonContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: "#1B8CA6",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  icon: {
    marginRight: 10,
    color: "white",
  },
  optionButtonReport: {
    backgroundColor: "#c91905",
    padding: 27,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 10,
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