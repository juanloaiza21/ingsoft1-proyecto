import { useTheme } from './context/themeContext';
import React, { useEffect, useRef, useState} from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ScrollView,
  Linking,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ConfigVariables } from './config/config';

export default function Settings() {
  const { theme } = useTheme();
  const [faqVisible, setFaqVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const router = useRouter();

  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;

  // Get tokens from AsyncStorage
  const getTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setAccess_token(accessToken ?? '');
      setRefresh_token(refreshToken ?? '');
    } catch (error) {
      console.error('Error al recuperar tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  };
  
  // Animation setup
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
  }, []);

  useEffect(() => {
    const loadTokens = async () => {
      await getTokens();
      if (access_token && refresh_token) {
        console.log('Tokens recuperados correctamente');
      }
    };
    loadTokens();
  }, []);

  const handleSupportPress = () => {
    const email = 'diegosolorzanoyt@gmail.com';
    const subject = encodeURIComponent('Solicitud de soporte técnico');
    const body = encodeURIComponent(
      'Hola, necesito ayuda con la aplicación. Aquí está mi problema:\n\n',
    );

    const mailtoURL = `mailto:${email}?subject=${subject}&body=${body}`;
    Linking.canOpenURL(mailtoURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailtoURL);
        } else {
          Alert.alert(
            'Error',
            'No se pudo abrir la aplicación de correo. Por favor, intenta manualmente.',
          );
        }
      })
      .catch((err) => console.error('Error al intentar abrir el correo:', err));
  };

  const handleLogOut = async () => {
    try {
      await axios.request({
        method: ConfigVariables.api.auth.logout.method,
        url: ConfigVariables.api.auth.logout.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      setLogoutVisible(true);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      router.push('/');
    }
  };

  // Animation for FAQ Modal
  const handleOpenFaq = () => {
    setFaqVisible(true);
    Animated.spring(modalScaleAnim, {
      toValue: 1,
      friction: 8,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleCloseFaq = () => {
    Animated.timing(modalScaleAnim, {
      toValue: 0.8,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setFaqVisible(false);
    });
  };

  // Animation for button press
  const buttonAnimValue = useRef(new Animated.Value(0)).current;

  const handlePressIn = () => {
    Animated.spring(buttonAnimValue, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonAnimValue, {
      toValue: 0,
      useNativeDriver: true,
    }).start();
  };

  // Create animated style for press effect
  const animatePress = {
    transform: [
      {
        scale: buttonAnimValue.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 0.95],
        }),
      },
    ],
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? '#2d2c24' : '#024059' },
      ]}
    >
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

      {/* Page Title */}
      <Animated.View 
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
          width: '100%',
          marginBottom: 20
        }}
      >
        <LinearGradient
          colors={['#1B8CA6', '#1B8CA6']}
          start={[0, 0]}
          end={[1, 1]}
          style={styles.pageTitleContainer}
        >
          <Text style={styles.pageTitle}>Ajustes</Text>
        </LinearGradient>
      </Animated.View>

      {/* Settings Options */}
      <Animated.View 
        style={[
          styles.contentContainer,
          { 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}
      >
        {/* Profile Button */}
        <Animated.View style={{ width: '100%', marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => router.push('/profile')}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#fc9414', '#fc9414']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="person" size={24} color="white" />
                </View>
                <Text style={styles.buttonText}>Mi perfil</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* FAQ Button */}
        <Animated.View style={{ width: '100%', marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleOpenFaq}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#fc9414', '#fc9414']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="help-circle" size={24} color="white" />
                </View>
                <Text style={styles.buttonText}>Preguntas frecuentes</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Support Button */}
        <Animated.View style={{ width: '100%', marginBottom: 10 }}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={handleSupportPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#fc9414', '#fc9414']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="build" size={24} color="white" />
                </View>
                <Text style={styles.buttonText}>Soporte técnico</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Logout Button */}
        <Animated.View style={{ width: '100%' }}>
          <TouchableOpacity
            style={styles.settingButton}
            onPress={() => handleLogOut()}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={['#fc9414', '#fc9414']}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.gradientButton}
            >
              <View style={styles.buttonContent}>
                <View style={styles.iconContainer}>
                  <Ionicons name="log-out" size={24} color="white" />
                </View>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>

      {/* FAQ Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={faqVisible}
        onRequestClose={handleCloseFaq}
      >
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.modalContent,
              { transform: [{ scale: modalScaleAnim }] }
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Preguntas Frecuentes</Text>
              <TouchableOpacity onPress={handleCloseFaq} style={styles.closeIcon}>
                <Ionicons name="close-circle" size={28} color="white" />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.scrollContainer}
              showsVerticalScrollIndicator={false}
            >
              {faqData.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                  <View style={styles.questionContainer}>
                    <Ionicons name="help-circle" size={20} color="#fc9414" style={styles.questionIcon} />
                    <Text style={styles.question}>{item.question}</Text>
                  </View>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCloseFaq}
            >
              <LinearGradient
                colors={['#fc9414', '#fc9414']}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.gradientCloseButton}
              >
                <View style={styles.closeButtonContent}>
                  <Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
                  <Text style={styles.closeButtonText}>Entendido</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const faqData = [
  {
    question: '¿Cómo puedo registrarme en la aplicación?',
    answer:
      'Debes ingresar tu correo institucional, crear una contraseña y completar tu perfil con información básica. También puedes verificar tu identidad para mayor seguridad.',
  },
  {
    question: '¿Cómo encuentro viajes disponibles?',
    answer:
      'Puedes buscar viajes según tu ubicación y destino. La app te mostrará opciones de conductores con horarios y rutas compatibles contigo.',
  },
  {
    question: '¿Cómo puedo publicar una ruta como conductor?',
    answer:
      "En la sección de 'Publicar Viaje', ingresa los detalles de tu ruta, como horario, puntos de salida y llegada, número de asientos disponibles y costo estimado del viaje.",
  },
  {
    question: '¿Cómo se realizan los pagos?',
    answer:
      'Los pagos pueden hacerse a través de la pasarela de pago integrada en la app o en efectivo, según el acuerdo entre el conductor y el pasajero.',
  },
  {
    question: '¿La app garantiza que el viaje se realice?',
    answer:
      'No, la plataforma facilita la conexión entre usuarios, pero no es responsable del cumplimiento de los acuerdos entre conductores y pasajeros.',
  },
  {
    question: '¿Es obligatorio calificar a los usuarios después de un viaje?',
    answer:
      'No es obligatorio, pero se recomienda dejar una calificación y comentario para ayudar a otros usuarios a conocer la reputación del conductor o pasajero.',
  },
  {
    question: '¿Qué medidas de seguridad tiene la app?',
    answer:
      'La app cuenta con verificación de identidad, historial de viajes y sistema de calificaciones. Además, puedes reportar cualquier incidente a soporte técnico.',
  },
  {
    question: '¿Cómo contacto con soporte técnico?',
    answer:
      "Si tienes problemas con la app, puedes comunicarte con el soporte técnico a través del botón 'Soporte Técnico' en la sección de ajustes.",
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    width: "100%",
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
  pageTitleContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
    paddingVertical: 15,
    marginBottom: 5,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    backgroundColor: "#1B8CA6",
  },
  settingButton: {
    width: '100%',
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  gradientButton: {
    padding: 16,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 15,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#024059",
    borderRadius: 16,
    padding: 20,
    width: "100%",
    maxWidth: 400,
    borderWidth: 2,
    borderColor: "#fc9414",
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  closeIcon: {
    padding: 5,
  },
  scrollContainer: {
    width: '100%',
    marginBottom: 20,
  },
  faqItem: {
    backgroundColor: "#1B8CA6",
    marginBottom: 12,
    borderRadius: 10,
    padding: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#fc9414",
  },
  questionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  questionIcon: {
    marginRight: 8,
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  answer: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    paddingLeft: 28,
  },
  closeButton: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradientCloseButton: {
    padding: 16,
    borderRadius: 12,
  },
  closeButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
