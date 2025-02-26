import React, { useState } from "react";
import TravelPreferencesModal from "./components/travelPreferencesModal";
import AppearanceModal from "./components/appearanceModal";
import { useTheme } from "./context/themeContext";
import NotificationsModal from "./components/notificationsModal";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
} from "react-native";

export default function Preferences() {
  // estado pa controlar el modal de notificaciones
  const [notificationsModalVisible, setNotificationsModalVisible] =
    useState(false);

  const { theme } = useTheme(); //para cambiar el tema

  //estados para controlar el modal de apariencia
  const [modalVisible, setModalVisible] = useState(false);
  const [appTheme, setAppTheme] = useState("light");

  // const router = useRouter(); // Descomenta si deseas navegar a otra pantalla
  const [travelModalVisible, setTravelModalVisible] = useState(false);

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.title, theme === "dark" && styles.title2]}>
          Preferencias{"\n"}de usuario
          
        </Text> 
        <Image
          source={require("../assets/images/icon-preferences.png")}
          style={styles.image}
        />
      </View>

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setTravelModalVisible(true)}
      >
        <Text style={styles.optionText}>Preferencias de viaje</Text>
      </TouchableOpacity>

      {/* Modal de Preferencias de Viaje */}
      <TravelPreferencesModal
        visible={travelModalVisible}
        onClose={() => setTravelModalVisible(false)}
      />

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setNotificationsModalVisible(true)}
      >
        <Text style={styles.optionText}>Notificaciones</Text>
      </TouchableOpacity>

      <NotificationsModal
        visible={notificationsModalVisible}
        onClose={() => setNotificationsModalVisible(false)}
      />

      <TouchableOpacity
        style={styles.optionButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.optionText}>Apariencia</Text>
      </TouchableOpacity>

      <AppearanceModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Alinea los elementos en fila (horizontalmente)
    alignItems: "center", // Centra verticalmente el texto y la imagen
    justifyContent: "space-between", // Separa el título y la imagen
    width: "90%", // Ajusta el ancho para que no ocupe toda la pantalla
    marginBottom: 20, // Espaciado inferior
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
  },
  title: {
    fontSize: 18, // Un poco más grande
    fontWeight: "bold",
    color: "#333", // Color más elegante y menos básico que el negro puro
    marginRight: 0, // Espacio con la imagen
    textTransform: "uppercase", // Convierte el texto en mayúsculas
    letterSpacing: 1, // Espacia un poco las letras para un diseño más limpio
    textShadowColor: "rgba(0, 0, 0, 0.2)", // Sombra ligera
    textShadowOffset: { width: 2, height: 2 }, // Posición de la sombra
    textShadowRadius: 3, // Difuminado de la sombra
    marginBottom: 70,
    marginLeft: 15,
    marginTop: 65,
  },

  title2: {
    fontSize: 18, // Un poco más grande
    fontWeight: "bold",
    color: "white",
    marginRight: 0, // Espacio con la imagen
    textTransform: "uppercase", // Convierte el texto en mayúsculas
    letterSpacing: 1, // Espacia un poco las letras para un diseño más limpio
    marginBottom: 70,
    marginLeft: 15,
    marginTop: 65,
  },
  optionButton: {
    backgroundColor: "#007bff",
    padding: 20,
    borderRadius: 10,
    width: "60%",
    alignItems: "center",
    marginVertical: 25,
    borderWidth: 3, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  optionText: {
    color: "white",
    fontSize: 18,
    fontWeight: "500",
  },
  
  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
}}
);
