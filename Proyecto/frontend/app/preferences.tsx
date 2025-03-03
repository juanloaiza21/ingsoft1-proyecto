import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
} from "react-native";

// Importar los componentes modales
import AppearanceModal from "../app/components/appearanceModal";
import NotificationsModal from "../app/components/notificationsModal";
import TravelPreferencesModal from "../app/components/travelPreferencesModal";

export default function Preferences() {
  const router = useRouter();
  const logoAnim = useRef(new Animated.Value(300)).current;

// Estados para controlar la visibilidad de los modales
const [appearanceModalVisible, setAppearanceModalVisible] = useState(false);
const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
const [travelPreferencesModalVisible, setTravelPreferencesModalVisible] = useState(false);

  useEffect(() => {
    // Animación de entrada del logo
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      {/* Barra superior con logo */}
      <View style={styles.topBar}>
        <Image
          source={require("../assets/images/Nombre (2).png")}
          style={styles.appNameImage}
          resizeMode="contain"
        />
        <Animated.Image
          source={require("../assets/images/icon-black.png")}
          style={[styles.animatedLogo, { transform: [{ translateX: logoAnim }] }]}
          resizeMode="contain"
        />
      </View>

      {/* Contenedor central */}
      <View style={styles.contentContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Preferencias</Text>
        </View>

        <View style={styles.buttonContainer}>
          <LinearGradient colors={["#FC9414", "#FC9414"]} style={styles.gradientButton}>
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => setTravelPreferencesModalVisible(true)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="car" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Preferencias de viaje</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={["#FC9414", "#FC9414"]} style={styles.gradientButton}>
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => setNotificationsModalVisible(true)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="notifications" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Notificaciones</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient colors={["#FC9414", "#FC9414"]} style={styles.gradientButton}>
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => setAppearanceModalVisible(true)}
            >
              <View style={styles.iconContainer}>
                <Ionicons name="color-palette" size={24} color="white" />
              </View>
              <Text style={styles.buttonText}>Apariencia</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
      {/* Modales */}
      <AppearanceModal 
        visible={appearanceModalVisible} 
        onClose={() => setAppearanceModalVisible(false)} 
      />
      <NotificationsModal 
        visible={notificationsModalVisible} 
        onClose={() => setNotificationsModalVisible(false)} 
      />
      <TravelPreferencesModal 
        visible={travelPreferencesModalVisible} 
        onClose={() => setTravelPreferencesModalVisible(false)} 
      />
    
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#024059",
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 0,
    backgroundColor: "#024059",
  },
  appNameImage: {
    width: 120,
    height: 40,
  },
  animatedLogo: {
    width: 60,
    height: 60,
  },
  contentContainer: {
    width: "90%",
    backgroundColor: "#1B8CA6",
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 90,
    borderColor: "black",
    borderWidth: 0.7,
  },
  headerContainer: {
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
    textTransform: "uppercase",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 22,
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
  },
  gradientButton: {
    borderRadius: 10,
    marginVertical: 10,
    width: "100%",
    overflow: "hidden",
  },
  optionButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  iconContainer: {
    borderRadius: 20,
    padding: 5,
    marginRight: 10,
    borderWidth: 0,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});