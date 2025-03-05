import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Platform, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from "./context/themeContext";

export default function FinishedTrip() {
  const { theme } = useTheme();
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const logoAnim = useRef(new Animated.Value(300)).current;

  useEffect(() => {
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
      }),
      Animated.spring(logoAnim, {
        toValue: 0,
        friction: 4,
        tension: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Component to animate list items
  const AnimatedCard = ({ delay, children, style }) => {
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemScaleAnim = useRef(new Animated.Value(0.9)).current;
    
    useEffect(() => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(itemFadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.spring(itemScaleAnim, {
            toValue: 1,
            friction: 8,
            useNativeDriver: true,
          })
        ])
      ]).start();
    }, []);
    
    return (
      <Animated.View 
        style={[
          style,
          {
            opacity: itemFadeAnim,
            transform: [{ scale: itemScaleAnim }]
          }
        ]}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <View style={[
      styles.container, 
      { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
    ]}>
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

      <View style={styles.content}>
        <Animated.View 
          style={[
            styles.titleContainer, 
            { 
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <LinearGradient
            colors={["#11ac28", "#0a8a1f"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="checkmark-circle" size={32} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>VIAJE FINALIZADO</Text>
          </LinearGradient>
        </Animated.View>

        <AnimatedCard delay={200} style={styles.cardContainer}>
          <LinearGradient
            colors={["#1B8CA6", "#0a6a80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.tripInfoCard}
          >
            <Text style={styles.sectionTitle}>Detalles del viaje</Text>
            
            <View style={styles.tripDetailGrid}>
              <View style={styles.infoItem}>
                <Ionicons name="calendar-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View style={{marginLeft: 12, flex: 1}}>
                  <Text style={styles.infoLabel}>Fecha y hora</Text>
                  <Text style={styles.infoText}>28/02/24 a las 16:45</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="time-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View style={{marginLeft: 12, flex: 1}}>
                  <Text style={styles.infoLabel}>Duración del viaje</Text>
                  <Text style={styles.infoText}>35 min ⏳</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="cash-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View style={{marginLeft: 12, flex: 1}}>
                  <Text style={styles.infoLabel}>Costo total</Text>
                  <Text style={styles.infoText}>$14.000 COP 💰</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location-outline" size={24} color="rgba(255,255,255,0.9)" />
                <View style={{marginLeft: 12, flex: 1}}>
                  <Text style={styles.infoLabel}>Distancia</Text>
                  <Text style={styles.infoText}>5.2 km 🌍</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </AnimatedCard>

        <AnimatedCard delay={300} style={styles.cardContainer}>
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.summaryCard}
          >
            <View style={styles.summaryContent}>
              <View style={styles.starsContainer}>
          {[...Array(5)].map((_, index) => {
            const starAnim = useRef(new Animated.Value(0)).current;
            
            useEffect(() => {
              Animated.sequence([
                Animated.delay(300 + index * 150),
                Animated.spring(starAnim, {
            toValue: 1,
            friction: 3,
            tension: 40,
            useNativeDriver: true,
                })
              ]).start();
            }, []);
            
            return (
              <Animated.View 
                key={index}
                style={{
            opacity: starAnim,
            transform: [
              { scale: starAnim },
              { rotate: starAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              })}
            ]
                }}
              >
                <Ionicons name="star" size={32} color="white" style={{marginHorizontal: 4}} />
              </Animated.View>
            );
          })}
              </View>
              <Text style={styles.summaryText}>
          ¡Gracias por usar nuestro servicio! 🙌
              </Text>
            </View>
          </LinearGradient>
        </AnimatedCard>

        <AnimatedCard delay={400} style={[styles.buttonContainer, { marginTop: 0, alignSelf: 'center', width: '80%', marginBottom: 30 }]}>
          <TouchableOpacity 
            onPress={() => router.push("/home")}
            style={styles.homeButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#9c27b0", "#7b1fa2"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.buttonGradient}
            >
              <Ionicons name="home" size={24} color="white" style={{marginRight: 10}} />
              <Text style={styles.buttonText}>Volver al inicio</Text>
            </LinearGradient>
          </TouchableOpacity>
        </AnimatedCard>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#024059',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  appNameImage: {
    width: 120,
    height: 40,
  },
  animatedLogo: {
    width: 60,
    height: 60,
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  titleContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  cardContainer: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
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
  tripInfoCard: {
    padding: 16,
    borderRadius: 12,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 16,
  },
  tripDetailGrid: {
    flexDirection: 'column',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  infoText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 12,
  },
  summaryContent: {
    alignItems: 'center',
    padding: 10,
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center',
    marginTop: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  homeButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
