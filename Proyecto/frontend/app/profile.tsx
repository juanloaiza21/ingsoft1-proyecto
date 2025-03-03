import { useRouter } from "expo-router";
import React, { useState,useEffect, useRef } from "react";
import { useTheme } from "./context/themeContext";
import { Ionicons } from "@expo/vector-icons";

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
  Animated,
} from "react-native";

import * as ImagePicker from "expo-image-picker";

export default function Profile() {

  const logoAnim = useRef(new Animated.Value(300)).current;//barra arriba
  const { theme } = useTheme(); //para cambiar el tema
  const router = useRouter(); //para navegar a otra pantalla

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Verificar si las contraseñas nuevas coinciden
  const passwordsMatch = newPassword === confirmPassword;
  // Solo verificar si se ha ingresado algo en ambos campos
  const shouldShowPasswordError = newPassword !== "" && confirmPassword !== "" && !passwordsMatch;
  
  // Verificar si todos los campos obligatorios están completos y las validaciones pasan
  const canSaveChanges = name !== "" && phone !== "" && email !== "" && 
                          (currentPassword === "" || // Si no hay contraseña actual, no verificar coincidencia
                           (currentPassword !== "" && newPassword !== "" && 
                            confirmPassword !== "" && passwordsMatch));

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

  const handleSaveChanges = () => {
    // Aquí iría la lógica para guardar los cambios en la base de datos o API
    Alert.alert("Cambios guardados", "Tus datos han sido actualizados correctamente");
    setModalVisible(false);
    // Resetear los campos del formulario
    resetForm();
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
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
      style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}
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
      <Text style={[styles.title, theme === "dark" && styles.title2]}>
        Configuración del perfil
      </Text>
      <Image
        source={
          selectedImage
            ? { uri: selectedImage }
            : require("../assets/images/icon-profile.png")
        }
        style={styles.image}
      />
      <TouchableOpacity onPress={delImageAsync} style={styles.button}>
        <Text style={styles.buttonText1}>Eliminar foto</Text>
      </TouchableOpacity>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={openImageAsync} style={styles.optionButton}>

        <View style={styles.iconContainer}>
                <Ionicons
                  name="camera"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
          <Text style={styles.buttonText}>Actualizar foto de perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.optionButton}
          onPress={() => setModalVisible(true)}
        >
           <View style={styles.iconContainer}>
                <Ionicons
                  name="create"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
          <Text style={styles.buttonText}>Actualizar datos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => router.push("/preferences")}
        >
           <View style={styles.iconContainer}>
                <Ionicons
                  name="color-palette"
                  size={24}
                  color={theme === 'dark' ? '#AAAAAA' : 'white'}
                />
              </View>
          <Text style={styles.buttonText}>Preferencias de usuario</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para actualizar datos de usuario */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Actualizar datos de usuario</Text>
            
            <ScrollView style={styles.formContainer}>
              {/* Nombre */}
              <Text style={styles.inputLabel}>Nombre completo</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={name}
                onChangeText={setName}
              />
              
              {/* Teléfono */}
              <Text style={styles.inputLabel}>Teléfono</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
              
              {/* Correo */}
              <Text style={styles.inputLabel}>Correo electrónico</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              
              {/* Sección de contraseña */}
              <Text style={styles.sectionTitle}>Cambiar contraseña (opcional)</Text>
              
              {/* Contraseña actual */}
              <Text style={styles.inputLabel}>Contraseña actual</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={true}
              />
              
              {/* Contraseña nueva */}
              <Text style={styles.inputLabel}>Contraseña nueva</Text>
              <TextInput
                style={styles.input}
                placeholder=""
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={true}
              />
              
              {/* Confirmar contraseña */}
              <Text style={styles.inputLabel}>Confirmar contraseña</Text>
              <TextInput
                style={[
                  styles.input,
                  shouldShowPasswordError && styles.inputError
                ]}
                placeholder=""
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={true}
              />
              
              {/* Mensaje de error si las contraseñas no coinciden */}
              {shouldShowPasswordError && (
                <Text style={styles.errorText}>
                  Las contraseñas no coinciden
                </Text>
              )}
              
              {/* Botones */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton, 
                    styles.saveButton,
                    !canSaveChanges && styles.disabledButton
                  ]}
                  onPress={handleSaveChanges}
                  disabled={!canSaveChanges}
                >
                  <Text style={styles.modalButtonText}>Guardar cambios</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",//#333
    marginTop: 40,
    textTransform: "uppercase",
    letterSpacing: 1,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
    marginBottom: 30,
    marginLeft: 15,
  },
  title2: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white", 
    marginRight: 0,
    textTransform: "uppercase",
    letterSpacing: 1,
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
    backgroundColor: " #900C3F",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonText1: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonContainer: {
    width: '75%',
    backgroundColor: "#1B8CA6",
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 10,
    marginTop:10, 
    borderColor: "black",
    borderWidth:0.7,
    
  },
  optionButton: {
    backgroundColor: "#fc9414",
    padding: 8,
    borderRadius: 10,
    width: "100%",
    marginVertical: 10,
    borderColor: "black",
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  // Estilos para el Modal
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "black",
  },
  formContainer: {
    width: "100%",
    maxHeight: "90%",
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "red",
    borderWidth: 2,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "black",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 30,
  },
  modalButton: {
    flex: 1,
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f44336",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  disabledButton: {
    backgroundColor: "#A5D6A7", // Verde más claro
    opacity: 0.7,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 7,
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

  iconContainer: {
    borderRadius: 20,
    padding: 10,
    marginRight: 10,
    borderWidth: 0
  },


});