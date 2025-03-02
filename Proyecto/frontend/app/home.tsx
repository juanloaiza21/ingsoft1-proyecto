import React, { useEffect, useRef } from "react";
import { Animated, TouchableOpacity, Image, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// AnimatedButton Component
const AnimatedButton = ({
  onPress,
  delay = 0,
  style,
  children,
}: {
  onPress: () => void;
  delay?: number;
  style?: any;
  children: React.ReactNode;
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 500,
      delay,
      useNativeDriver: true,
    }).start();
  }, [scaleAnim, delay]);

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <LinearGradient
        colors={["#112acf", "#9ca9ff"]} // Gradient colors; adjust as needed
        start={[0, 0]}
        end={[1, 1]}
        style={styles.gradientContainer}
      >
        <TouchableOpacity onPress={onPress} style={styles.mainButton}>
          {children}
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
};

export default function Home(): JSX.Element {
  const router = useRouter(); // for navigation
  const { theme } = useTheme(); // for theme changes

  // Animated value for the logo's horizontal position (starts off-screen to the right)
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

  const AnimatedText = () => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
  
    useEffect(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000, // 2 seconds fade-in
        useNativeDriver: true,
      }).start();
    }, [fadeAnim]);
  
    return (
      <Animated.Text style={[styles.animatedHeader, { opacity: fadeAnim }]}>
        A dónde{"\n"}vas hoy?
      </Animated.Text>
    );
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        {/* Left: App Name Image */}
        <Image
          source={require("../assets/images/Nombre.png")} // Replace with your app name image
          style={styles.appNameImage}
          resizeMode="contain"
        />
        {/* Right: Animated Logo */}
        <Animated.Image
          source={
            theme === "dark"
              ? require("../assets/images/icon-black.png")
              : require("../assets/images/logo.png")
          }
          style={[
            styles.animatedLogo,
            { transform: [{ translateX: logoAnim }] },
          ]}
          resizeMode="contain"
        />
      </View>
      {/* Animated Text below the Top Bar */}
      <AnimatedText/>
       {/* Animated Buttons */}
       <View style={styles.buttonContainer}>
        <View style={styles.row}>
          <AnimatedButton onPress={() => router.push("/solicitudViaje")} delay={0}>
            <Text style={styles.buttonText}>Solicitar un Viaje</Text>
          </AnimatedButton>
          <AnimatedButton onPress={() => router.push("/publishTravel")} delay={300}>
            <Text style={styles.buttonText}>Publicar un viaje</Text>
          </AnimatedButton>
        </View>
        <AnimatedButton
          onPress={() => router.push("/agreedTrips")}
          delay={600}
          style={{ alignSelf: "center", marginTop: 20 }}
        >
          <Text style={styles.buttonText}>Viajes programados</Text>
        </AnimatedButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    borderRadius: 10,
    marginBottom: 20,
    width: 150,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: -15,
  },
  appNameImage: {
    width: 120, // Adjust as needed
    height: 40, // Adjust as needed
  },
  animatedLogo: {
    width: 60, // Adjust as needed
    height: 60, // Adjust as needed
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    paddingVertical: 20,
  },
  title2: {
    color: "white",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
  },
  mainButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    width: 150,
    height: 150,
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
  },
  animatedHeader: {
    fontSize: 50,
    fontWeight: "bold",
    textAlign: "left",
    alignItems: "center",
    marginVertical: 50,
    color: "#333",
  },
});
