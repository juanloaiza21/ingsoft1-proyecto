import React, { useEffect, useRef, useState } from "react";
import { 
  Animated, 
  TouchableOpacity, 
  Image, 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Platform 
} from "react-native";
import { useRouter } from "expo-router";
import { useTheme } from "./context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// AnimatedButton Component with enhanced animation
const AnimatedButton = ({
  onPress,
  delay = 0,
  icon,
  title,
  colors,
  style,
}: {
  onPress: () => void;
  delay?: number;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  colors: readonly [string, string, ...string[]];
  style?: any;
}) => {
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  
  // Initial animation
  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ])
    ]).start();
  }, []);
  
  // Press animation handlers
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.95,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View 
      style={[
        { 
          opacity: fadeAnim,
          transform: [
            { scale: scaleAnim },
            { scale: buttonScale }
          ] 
        }, 
        style
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <LinearGradient
          colors={colors as readonly [string, string, ...string[]]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.buttonGradient}
        >
          <Ionicons name={icon} size={32} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

export default function Home(): JSX.Element {
  const router = useRouter();
  const { theme } = useTheme();
  const windowWidth = Dimensions.get('window').width;
  
  // Animation references
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Run animations on component mount
  useEffect(() => {
    // Animate the logo bouncing in
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
    
    // Animate the header content fading and sliding up
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" },
      ]}
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

      {/* Animated Header Card */}
      <Animated.View 
        style={[
          styles.headerCard,
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ]
          }
        ]}
      >
        <LinearGradient
          colors={["#1B8CA6", "#0a6a80"]}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.headerGradient}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerText}>
              ¿A dónde{"\n"}vamos gente?
            </Text>
            <Ionicons name="navigate-circle" size={60} color="rgba(255,255,255,0.3)" style={styles.headerIcon} />
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Main Options */}
      <View style={styles.optionsContainer}>
        <View style={styles.optionsRow}>
          <AnimatedButton 
            onPress={() => router.push("/solicitudViaje")} 
            delay={200}
            icon="car-sport"
            title="Solicitar un viaje"
            colors={["#fc9414", "#f57c00"]}
            style={styles.optionButton}
          />
          
          <AnimatedButton 
            onPress={() => router.push("/publishTravel")} 
            delay={400}
            icon="create"
            title="Publicar un viaje"
            colors={["#11ac28", "#0a8a1f"]}
            style={styles.optionButton}
          />
        </View>

        <AnimatedButton
          onPress={() => router.push("/agreedTrips")}
          delay={600}
          icon="calendar"
          title="Viajes programados"
          colors={["#1B8CA6", "#0a6a80"]}
          style={[styles.optionButton, styles.wideButton]}
        />

        <AnimatedButton 
          onPress={() => router.push("/currentTrip")} 
          delay={500} 
          icon="car-sport" 
          title="Viaje actual" 
          colors={["#fc9414", "#f57c00"]} 
          style={styles.optionButton} 
        />

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  headerCard: {
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  headerGradient: {
    borderRadius: 20,
    padding: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "white",
    lineHeight: 44,
    flex: 1,
  },
  headerIcon: {
    marginLeft: 10,
  },
  optionsContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  optionButton: {
    flex: 1,
    margin: 8,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 0,
      },
    }),
  },
  wideButton: {
    marginHorizontal: 8,
  },
  buttonGradient: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 130,
  },
  buttonIcon: {
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  }
});
