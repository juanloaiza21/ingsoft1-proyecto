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
} from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function Profile() {

  const { theme } = useTheme(); //para cambiar el tema
  const router = useRouter(); //para navegar a otra pantalla

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  let openImageAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(pickerResult);
    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  let delImageAsync = async () => {
    setSelectedImage(null);
  };
  return (
    <View 
    style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
    >
      <Text style={[styles.title, theme === "dark" && styles.title2]}
      
      >Configuración del perfil </Text>
      <Image
        source={
          selectedImage
            ? { uri: selectedImage }
            : require("../assets/images/icon-profile.png")
        }
        style={styles.image}
      />
      <TouchableOpacity onPress={delImageAsync} style={styles.button}>
        <Text style={styles.buttonText}>Eliminar foto</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openImageAsync} style={styles.optionButton}>
          <Text style={styles.buttonText}>Actualizar foto de perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.buttonText}>Actualizar usuario</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push("/preferences")}
        >
          <Text style={styles.buttonText}>Preferencias de usuario</Text>
        </TouchableOpacity>
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
    fontSize: 26, // Un poco más grande
    fontWeight: "bold",
    color: "#333", // Color más elegante y menos básico que el negro puro
    marginRight: 0, // Espacio con la imagen
    textTransform: "uppercase", // Convierte el texto en mayúsculas
    letterSpacing: 1, // Espacia un poco las letras para un diseño más limpio
    textShadowColor: "rgba(0, 0, 0, 0.2)", // Sombra ligera
    textShadowOffset: { width: 2, height: 2 }, // Posición de la sombra
    textShadowRadius: 3, // Difuminado de la sombra
    marginBottom: 22,
    marginLeft: 15,
  },

  title2: {
    fontSize: 26, // Un poco más grande
    fontWeight: "bold",
    color: "white", 
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
  button: {
    backgroundColor: "#007bff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
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
    marginVertical: 30,
    borderWidth: 3, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
});
