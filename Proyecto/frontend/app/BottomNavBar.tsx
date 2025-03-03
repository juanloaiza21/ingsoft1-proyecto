// app/BottomNavBar.tsx
import React, { useEffect, useRef, useState } from "react";
import { View, TouchableOpacity, StyleSheet, Animated, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

export default function BottomNavBar() {
  const router = useRouter();
  const segments = useSegments();
  const [activeRoute, setActiveRoute] = useState("home");
  
  // Animation references
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  
  // Determine active route
  useEffect(() => {
    if (segments.some(segment => segment === "historial")) {
      setActiveRoute("historial");
    } else if (segments.some(segment => segment === "home")) {
      setActiveRoute("home");
    } else if (segments.some(segment => segment === "settings")) {
      setActiveRoute("settings");
    }
  }, [segments]);
  
  // Entry animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  // Hide the nav bar if we're at the root/register pages.
  if (segments[0] === undefined || segments.some(segment => segment === "register")) {
    return null;
  }

  // Navigation handlers with animation feedback
  const navigateTo = (route: 'historial' | 'home' | 'settings') => {
    // Only navigate if not already on that route
    if (activeRoute !== route) {
      // Use specific route paths for type safety
      if (route === 'historial') {
        router.push('/historial');
      } else if (route === 'home') {
        router.push('/home');
      } else if (route === 'settings') {
        router.push('/settings');
      }
    }
  };

  return (
    <Animated.View 
      style={[
        styles.navWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}
    >
      <LinearGradient
        colors={["#1B8CA6", "#0a6a80"]}
        start={[0, 0]}
        end={[1, 1]}
        style={styles.navContainer}
      >
        <TouchableOpacity 
          style={styles.navButton} 
          onPress={() => navigateTo("historial")}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeRoute === "historial" && styles.activeIconContainer
          ]}>
            <Ionicons 
              name={activeRoute === "historial" ? "time" : "time-outline"} 
              size={24} 
              color={activeRoute === "historial" ? "#fc9414" : "white"} 
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateTo("home")}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeRoute === "home" && styles.activeIconContainer
          ]}>
            <Ionicons 
              name={activeRoute === "home" ? "home" : "home-outline"} 
              size={28} 
              color={activeRoute === "home" ? "#fc9414" : "white"} 
            />
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.navButton}
          onPress={() => navigateTo("settings")}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeRoute === "settings" && styles.activeIconContainer
          ]}>
            <Ionicons 
              name={activeRoute === "settings" ? "settings" : "settings-outline"} 
              size={24} 
              color={activeRoute === "settings" ? "#fc9414" : "white"} 
            />
          </View>
        </TouchableOpacity>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  navWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 24,
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
  navButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
  },
  activeIconContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    transform: [{ scale: 1.1 }],
  }
});
