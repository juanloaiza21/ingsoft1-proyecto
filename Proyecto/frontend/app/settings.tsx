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

export default function Settings() {
  const { theme } = useTheme();
  const router = useRouter();
  const [faqVisible, setFaqVisible] = useState(false);
  const [logoutVisible, setLogoutVisible] = useState(false);

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

  return (

    <View
      style={[
        styles.container,
        { backgroundColor: theme === 'dark' ? '#A67665' : '#024059' },
      ]}
    >

<View style={styles.topBar}>
        {/* Left: App Name Image */}
        <Image
          source={require("../assets/images/Nombre (2).png")} // Replace with your app name image
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
      {/* Nuevo contenedor para el título y los botones */}
      <View style={styles.contentContainer}>
        {/* Header ORIGINAL: título sin cambios */}
        <View style={styles.headerContainer2}>
          <Text style={[styles.title, theme === 'dark' && styles.title2]}>
            Ajustes
          </Text>
        </View>
        {/* Botones de opciones ocupando el 100% del ancho del contenedor */}
        <View style={styles.buttonContainer}>
          <LinearGradient
            colors={['#fc9414', "#fc9414"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => router.push('/profile')}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="person"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
              <Text style={styles.buttonText}>  Mi perfil</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#fc9414', "#fc9414"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => setFaqVisible(true)}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="help"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
              <Text style={styles.buttonText}>  Preguntas frecuentes</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#fc9414', "#fc9414"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={handleSupportPress}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="build"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
              <Text style={styles.buttonText}>  Soporte</Text>
            </TouchableOpacity>
          </LinearGradient>

          <LinearGradient
            colors={['#fc9414', "#fc9414"]}


            start={[0, 0]}
            end={[1, 1]}
            style={styles.gradientButton}
          >
            <TouchableOpacity
              style={styles.optionButtonContent}
              onPress={() => setLogoutVisible(true)}
            >
              <View style={styles.iconContainer}>
                <Ionicons
                  name="close"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
              <Text style={styles.buttonText}>  Cerrar sesión</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      {/* Modal de Preguntas Frecuentes */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={faqVisible}
        onRequestClose={() => setFaqVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Preguntas Frecuentes</Text>
            <ScrollView style={styles.scrollContainer}>
              {faqData.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                  <Text style={styles.question}>{item.question}</Text>
                  <Text style={styles.answer}>{item.answer}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.closeButton1}
              onPress={() => setFaqVisible(false)}
            >
              <Text style={styles.buttonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de Cierre de Sesión */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={logoutVisible}
        onRequestClose={() => setLogoutVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent1}>
            <Text style={styles.modalTitle}>
              ¿Estás seguro de que deseas cerrar la sesión?
            </Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setLogoutVisible(false)}
            >
              <Text style={styles.buttonText}>No, volver</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={() => {
                router.push('/');
                setLogoutVisible(false);
                Alert.alert(
                  'Sesión cerrada',
                  'Has cerrado sesión exitosamente.',
                );
              }}
            >
              <Text style={styles.buttonText}>Sí, salir</Text>
            </TouchableOpacity>
          </View>
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
    alignItems: 'center',
    flex: 1,
    paddingHorizontal:20,
  },
  contentContainer: {
    width: '90%',
    backgroundColor: "#1B8CA6",
    borderRadius: 40,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop:90, 
    borderColor: "black",
    borderWidth:0.7,
  },
  // Header ORIGINAL sin cambios
  headerContainer2: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    marginTop: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 22,
  },
  title2: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 22,
  },
  // Contenedor de botones
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  gradientButton: {
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    overflow: 'hidden',
  },
  optionButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 5,
    
  },
  iconContainer: {
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    borderWidth: 0
  },
  buttonText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  // Estilos para los modales 
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: "#024059",
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 30,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalContent1: {
    backgroundColor: '#F2C572',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  closeButton1: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    width: '80%',
    marginBottom: 10,
    alignItems: 'center',
  },
  closeButton: {
    backgroundColor: '#1B8CA6',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    marginBottom: 10,
    alignItems: 'center',
  },
  logoutButton: {
    backgroundColor: '#fc9414',
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  scrollContainer: {
    width: '100%',
  },
  faqItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  question: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#007bff',
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: '#333',
  },


  appNameImage: {
    width: 120, // Adjust as needed
    height: 40, // Adjust as needed
    marginHorizontal: 0,
  },
topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: -15,
    backgroundColor: "#024059",
    borderRadius: 20,
    marginHorizontal: -10,
    marginVertical: 5,
    width: "100%",
  },
animatedLogo: {
    width: 60, // Adjust as needed
    height: 60, // Adjust as needed
    marginHorizontal: 0,
  },


});
