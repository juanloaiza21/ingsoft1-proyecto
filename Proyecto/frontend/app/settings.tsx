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
  Modal,
  TextInput,
  ScrollView,
  Linking,
} from "react-native";

export default function Settings() {

  const { theme } = useTheme();//para cambiar el tema

  const router =useRouter();//para navegar a otra pantalla
  const [faqVisible, setFaqVisible] = useState(false); //estado para controlas la visibilidad de las FAQ

  // función para abrir el correo de soporte
  const handleSupportPress = () => {
    const email = "diegosolorzanoyt@gmail.com"; // Reemplazar con el correo real de soporte
    const subject = encodeURIComponent("Solicitud de soporte técnico");
    const body = encodeURIComponent(
      "Hola, necesito ayuda con la aplicación. Aquí está mi problema:\n\n"
    );

    const mailtoURL = `mailto:${email}?subject=${subject}&body=${body}`;

    //manejar errores al abrir el correo
    Linking.canOpenURL(mailtoURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mailtoURL);
        } else {
          Alert.alert(
            "Error",
            "No se pudo abrir la aplicación de correo. Por favor, intenta manualmente."
          );
        }
      })
      .catch((err) => console.error("Error al intentar abrir el correo:", err));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
    >
      <View style={styles.headerContainer}>
        <Text
        style={[styles.title, theme === "dark" && styles.title2]}
        >Ajustes</Text>
        <Image
          source={require("../assets/images/settings-icon.png")}
          style={styles.image}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.optionButton}
        onPress={()=>router.push("/profile")}
        >
          <Text style={styles.buttonText}>Mi perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => setFaqVisible(true)}
        >
          <Text style={styles.buttonText}>Preguntas frecuentes</Text>
        </TouchableOpacity>

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
                style={styles.closeButton}
                onPress={() => setFaqVisible(false)}
              >
                <Text style={styles.buttonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={handleSupportPress}
        >
          <Text style={styles.buttonText}>Soporte técnico</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.optionButton}>
          <Text style={styles.buttonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const faqData = [
  {
    question: "¿Cómo puedo registrarme en la aplicación?",
    answer:
      "Debes ingresar tu correo institucional, crear una contraseña y completar tu perfil con información básica. También puedes verificar tu identidad para mayor seguridad.",
  },
  {
    question: "¿Cómo encuentro viajes disponibles?",
    answer:
      "Puedes buscar viajes según tu ubicación y destino. La app te mostrará opciones de conductores con horarios y rutas compatibles contigo.",
  },
  {
    question: "¿Cómo puedo publicar una ruta como conductor?",
    answer:
      "En la sección de 'Publicar Viaje', ingresa los detalles de tu ruta, como horario, puntos de salida y llegada, número de asientos disponibles y costo estimado del viaje.",
  },
  {
    question: "¿Cómo se realizan los pagos?",
    answer:
      "Los pagos pueden hacerse a través de la pasarela de pago integrada en la app o en efectivo, según el acuerdo entre el conductor y el pasajero.",
  },
  {
    question: "¿La app garantiza que el viaje se realice?",
    answer:
      "No, la plataforma facilita la conexión entre usuarios, pero no es responsable del cumplimiento de los acuerdos entre conductores y pasajeros.",
  },
  {
    question: "¿Es obligatorio calificar a los usuarios después de un viaje?",
    answer:
      "No es obligatorio, pero se recomienda dejar una calificación y comentario para ayudar a otros usuarios a conocer la reputación del conductor o pasajero.",
  },
  {
    question: "¿Qué medidas de seguridad tiene la app?",
    answer:
      "La app cuenta con verificación de identidad, historial de viajes y sistema de calificaciones. Además, puedes reportar cualquier incidente a soporte técnico.",
  },
  {
    question: "¿Cómo contacto con soporte técnico?",
    answer:
      "Si tienes problemas con la app, puedes comunicarte con el soporte técnico a través del botón 'Soporte Técnico' en la sección de ajustes.",
  },
];
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row", // Alinea los elementos en fila (horizontalmente)
    alignItems: "center", // Centra verticalmente el texto y la imagen
    justifyContent: "space-between", // Separa el título y la imagen
    width: "80%", // Ajusta el ancho para que no ocupe toda la pantalla
    marginBottom: 20, // Espaciado inferior
  },
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
    color: "white", // Color más elegante y menos básico que el negro puro
    marginRight: 0, // Espacio con la imagen
    textTransform: "uppercase", // Convierte el texto en mayúsculas
    letterSpacing: 1, // Espacia un poco las letras para un diseño más limpio

    marginBottom: 22,
    marginLeft: 15,
  },


  image: {
    width: 150,
    height: 150,
    marginBottom: 20,
    marginTop: 20,
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
    marginVertical: 10,
    marginTop: 30,
    borderWidth: 3, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  infoContainer: {
    backgroundColor: "#f0f0f0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  infoText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1da6c7",
    marginTop: 30,
    marginBottom: 30,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 60,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#c70039",
    padding: 10,
    borderRadius: 10,
    width: "80%",
    marginBottom: 10,
    alignItems: "center",
  },

  scrollContainer: {
    width: "100%",
  },
  faqItem: {
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#007bff",
    marginBottom: 5,
  },
  answer: {
    fontSize: 14,
    color: "#333",
  },
});
