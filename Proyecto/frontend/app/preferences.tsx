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
  ScrollView,
  Dimensions,
  Platform,
} from "react-native";

// Import modal components
import AppearanceModal from "../app/components/appearanceModal";
import NotificationsModal from "../app/components/notificationsModal";
import TravelPreferencesModal from "../app/components/travelPreferencesModal";
import { useTheme } from "./context/themeContext";

export default function Preferences() {
  const router = useRouter();
  const { theme } = useTheme();
  
  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  
  // Button animation refs - one for each button
  const button1Anim = useRef(new Animated.Value(0)).current;
  const button2Anim = useRef(new Animated.Value(0)).current;
  const button3Anim = useRef(new Animated.Value(0)).current;
  
  // Modal visibility states
  const [appearanceModalVisible, setAppearanceModalVisible] = useState(false);
  const [notificationsModalVisible, setNotificationsModalVisible] = useState(false);
  const [travelPreferencesModalVisible, setTravelPreferencesModalVisible] = useState(false);

  useEffect(() => {
    // Animate logo sliding in
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
    
    // Fade in content
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
    
    // Scale content up
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 6,
      tension: 40,
      useNativeDriver: true,
    }).start();
    
    // Staggered animation for buttons
    Animated.stagger(150, [
      Animated.spring(button1Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(button2Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(button3Anim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Function to handle button press animation
  const handlePressIn = (animRef) => {
    Animated.spring(animRef, {
      toValue: 0.95,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (animRef) => {
    Animated.spring(animRef, {
      toValue: 1,
      friction: 5,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View 
      style={[
        styles.container, 
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
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

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View 
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            width: '100%',
          }}
        >
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="settings-outline" size={28} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Preferencias</Text>
          </LinearGradient>
          
          <View style={styles.buttonContainer}>
            {/* Travel Preferences Button */}
            <Animated.View 
              style={{
                opacity: button1Anim,
                transform: [{ scale: button1Anim }],
                width: '100%',
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => handlePressIn(button1Anim)}
                onPressOut={() => handlePressOut(button1Anim)}
                onPress={() => setTravelPreferencesModalVisible(true)}
              >
                <Animated.View style={{ transform: [{ scale: button1Anim }] }}>
                  <LinearGradient
                    colors={["#1B8CA6", "#0a6a80"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradientButton}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name="car-sport" size={24} color="white" />
                    </View>
                    <Text style={styles.buttonText}>Preferencias de viaje</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            {/* Notifications Button */}
            <Animated.View 
              style={{
                opacity: button2Anim,
                transform: [{ scale: button2Anim }],
                width: '100%',
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => handlePressIn(button2Anim)}
                onPressOut={() => handlePressOut(button2Anim)}
                onPress={() => setNotificationsModalVisible(true)}
              >
                <Animated.View style={{ transform: [{ scale: button2Anim }] }}>
                  <LinearGradient
                    colors={["#1B8CA6", "#0a6a80"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradientButton}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name="notifications" size={24} color="white" />
                    </View>
                    <Text style={styles.buttonText}>Notificaciones</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>

            {/* Appearance Button */}
            <Animated.View 
              style={{
                opacity: button3Anim,
                transform: [{ scale: button3Anim }],
                width: '100%',
                marginTop: 16,
              }}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                onPressIn={() => handlePressIn(button3Anim)}
                onPressOut={() => handlePressOut(button3Anim)}
                onPress={() => setAppearanceModalVisible(true)}
              >
                <Animated.View style={{ transform: [{ scale: button3Anim }] }}>
                  <LinearGradient
                    colors={["#1B8CA6", "#0a6a80"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.gradientButton}
                  >
                    <View style={styles.iconContainer}>
                      <Ionicons name="color-palette" size={24} color="white" />
                    </View>
                    <Text style={styles.buttonText}>Apariencia</Text>
                    <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
                  </LinearGradient>
                </Animated.View>
              </TouchableOpacity>
            </Animated.View>
          </View>
          
          {/* Bottom informational card */}
          <Animated.View 
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              marginTop: 30,
            }}
          >
            <LinearGradient
              colors={["rgba(252, 148, 20, 0.8)", "rgba(245, 124, 0, 0.8)"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.infoCard}
            >
              <Ionicons name="information-circle" size={24} color="white" style={{ marginRight: 10 }} />
              <Text style={styles.infoText}>
                Personaliza tu experiencia configurando tus preferencias
              </Text>
            </LinearGradient>
          </Animated.View>
        </Animated.View>
      </ScrollView>

      {/* Modals */}
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
    padding: 16,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 30,
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
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    flex: 1,
  },
  arrowIcon: {
    opacity: 0.7,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    width: '100%',
  },
  infoText: {
    color: 'white',
    fontSize: 16,
    flex: 1,
    lineHeight: 22,
  },
});