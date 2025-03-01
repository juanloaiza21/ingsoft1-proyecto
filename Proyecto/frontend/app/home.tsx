import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";

export default function Home(): JSX.Element {
  const router = useRouter(); //para navegar a otra pantalla
  const { theme } = useTheme(); //para cambiar el tema


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push("/settings")}>
          <Image
            source={require("../assets/images/settings-icon.png")}
            style={styles.settingsIcon}
          />
        </TouchableOpacity>
      </View>

      {/* Logo central */}
      <View style={styles.logoContainer}>
        <Image
          source={
            theme === "dark"
              ? require("../assets/images/icon-black.png") // Logo para modo oscuro
              : require("../assets/images/logo.png") // Logo para modo claro
          }
          style={styles.centerLogo}
        />
      </View>

          <View>
            <Text style={[styles.title, theme === "dark" && styles.title2]}>
              Bienvenido a Owlwheels
            </Text>
          </View>
      {/* Botones principales */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/solicitudViaje")}
        >
          <Text style={styles.buttonText}>Solicitar un Viaje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/publishTravel")}
        >
          <Text style={styles.buttonText}>Publicar un viaje</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/agreedTrips")}
        >
          <Text style={styles.buttonText}>Viajes programados</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.mainButton}
          onPress={() => router.push("/historial")}
        >
          <Text style={styles.buttonText}>Historial</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title:{
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: "center",
  },
  title2:{
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: "center",
    color: "white",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
  },
  topBar: {
    marginTop: 30,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: 15,
  },

  settingsIcon: {
    width: 50,
    height: 50,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 30, // Espacio entre la barra superior y el logo
    marginBottom: 10, // Espacio entre el logo y los botones
  },
  centerLogo: {
    width: 200,
    height: 200,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
    borderWidth: 2, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  linkButton: {
    width: "100%",
    alignItems: "center",
    textDecorationLine: "none",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
