import { useRouter } from "expo-router";
import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "./context/themeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from "expo-linear-gradient";

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
  Platform,
  Pressable,
  Dimensions
} from "react-native";

import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ApiResponse } from "./types/api-response.type";

export default function Profile() {
  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const modalScaleAnim = useRef(new Animated.Value(0.8)).current;
  const modalOpacityAnim = useRef(new Animated.Value(0)).current;

  const { theme } = useTheme();
  const router = useRouter();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  
  // Estados para los campos del formulario
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [runt, setRunt] = useState("");
  const [birthDate, setBirthDate] = useState<Date>(new Date());
  const [show, setShow] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');

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

  // Función para obtener los tokens desde AsyncStorage
  const getTokens = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('accessToken');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      setAccess_token(accessToken ?? '');
      setRefresh_token(refreshToken ?? '');
      return { accessToken, refreshToken };
    } catch (error) {
      console.error('Error al recuperar tokens:', error);
      return { accessToken: null, refreshToken: null };
    }
  };

  useEffect(() => {
    const loadTokens = async () => {
      await getTokens();
    };
    loadTokens();
  }, []);

  useEffect(() => {
    if (modalVisible) {
      // Animate modal appearance
      Animated.parallel([
        Animated.spring(modalScaleAnim, {
          toValue: 1,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(modalOpacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // Reset animations when modal closes
      modalScaleAnim.setValue(0.8);
      modalOpacityAnim.setValue(0);
    }
  }, [modalVisible]);

  // Verificar si las contraseñas nuevas coinciden
  const passwordsMatch = newPassword === confirmPassword;
  // Solo verificar si se ha ingresado algo en ambos campos
  const shouldShowPasswordError = newPassword !== "" && confirmPassword !== "" && !passwordsMatch;
  
  // Verificar si todos los campos obligatorios están completos y las validaciones pasan
  const canSaveChanges = passwordsMatch;

  // Button press animation
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

  const buttonAnimStyle = {
    transform: [{
      scale: buttonAnimValue.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0.95]
      })
    }]
  };

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

    if (!pickerResult.canceled && pickerResult.assets.length > 0) {
      setSelectedImage(pickerResult.assets[0].uri);
    }
  };

  let delImageAsync = async () => {
    setSelectedImage(null);
  };

  const toggleDatePicker = () => {
    setShow(!show);
  };
    
  const onChange = ({ type }, selectedDate: any) => {
    if (type == "set") {
      const currentDate = selectedDate;
      setBirthDate(currentDate);
      if (Platform.OS === 'android') {
        toggleDatePicker();
        setBirthDate(currentDate);
      }
    } else {
      toggleDatePicker();
    }
  }

  const handleSaveChanges = async () => {
    try {
      const body: { [key: string]: any } = {};
      if (name !== "") {
        body.name = name;
      }
      if (phone !== "") {
        body.phoneNumber = phone;
      }
      if (newPassword !== "") {
        body.password = newPassword;
      }
      
      if (runt !== "") {
        body.runtNumber = runt;
        body.licenseExpirationDate = birthDate;
        try {
          await axios.request({
            method: ConfigVariables.api.driver.create.method,
            url: ConfigVariables.api.driver.create.url,
            headers: {
              'Authorization': `Bearer ${access_token}`,
            },
            data: {
              runtNumber: body.runtNumber,
              licenseExpirationDate: body.licenseExpirationDate,
            }
          });
        } catch (driverError) {
          console.error("Error creating driver profile:", driverError);
          Alert.alert("Error", "No se pudo registrar la información del conductor.");
          throw driverError;
        }
      }
      try {
        let user1Petition = await axios.request({
          method: ConfigVariables.api.auth.checkJWT.method,
          url: ConfigVariables.api.auth.checkJWT.url,
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });
        let user:ApiResponse = user1Petition.data;
        console.log(ConfigVariables.api.user.update.url+user.result.userId);
        await axios.request({
          method: ConfigVariables.api.user.update.method,
          url: ConfigVariables.api.user.update.url+user.result.userId,
          headers: {
            'Authorization': `Bearer ${access_token}`,
          },
          data: body,
        });
        
        Alert.alert("Éxito", "Información actualizada correctamente.");
        setModalVisible(false);
        resetForm();
      } catch (updateError) {
        console.error("Error updating user profile:", updateError);
        Alert.alert("Error", "No se pudo actualizar la información del usuario.");
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      Alert.alert("Error", "Ocurrió un problema al guardar los cambios.");
    }
  };

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  return (
    <View 
      style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }]}
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
        showsVerticalScrollIndicator={false} 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Animated.View 
          style={[
            styles.titleContainer, 
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <LinearGradient
            colors={["#1B8CA6", "#0a6a80"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="person-circle-outline" size={28} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Mi Perfil</Text>
          </LinearGradient>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.profileImageContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <View style={styles.profilePhotoSection}>
            <Image
              source={
                selectedImage
                  ? { uri: selectedImage }
                  : require("../assets/images/Daguilastrico.jpeg")
              }
              style={styles.profileImage}
            />
            
            <View style={styles.photoButtonsContainer}>
              <TouchableOpacity 
                onPress={openImageAsync}
                style={styles.photoButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <LinearGradient
                  colors={["#1B8CA6", "#0a6a80"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.photoButtonGradient}
                >
                  <Ionicons name="camera" size={18} color="white" />
                  <Text style={styles.photoButtonText}>Actualizar</Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <TouchableOpacity 
                onPress={delImageAsync}
                style={styles.photoButton}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
              >
                <LinearGradient
                  colors={["#c91905", "#a31504"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.photoButtonGradient}
                >
                  <Ionicons name="trash" size={18} color="white" />
                  <Text style={styles.photoButtonText}>Eliminar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.optionsContainer,
            { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }
          ]}
        >
          <Text style={styles.sectionTitle}>Opciones de perfil</Text>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => setModalVisible(true)}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={["#fc9414", "#f57c00"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.optionButtonGradient}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="create" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>Actualizar datos</Text>
              <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.optionButton}
            onPress={() => router.push("/preferences")}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
            <LinearGradient
              colors={["#fc9414", "#f57c00"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.optionButtonGradient}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="color-palette" size={24} color="white" />
              </View>
              <Text style={styles.optionText}>Preferencias de usuario</Text>
              <Ionicons name="chevron-forward" size={24} color="white" style={styles.arrowIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Modal para actualizar datos de usuario */}
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          resetForm();
        }}
      >
        <View style={styles.centeredView}>
          <Animated.View 
            style={[
              styles.modalView,
              {
                opacity: modalOpacityAnim,
                transform: [{ scale: modalScaleAnim }]
              }
            ]}
          >
            <LinearGradient
              colors={["#1B8CA6", "#0a6a80"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.modalHeader}
            >
              <Text style={styles.modalTitle}>Actualizar datos de usuario</Text>
            </LinearGradient>
            
            <ScrollView style={styles.formContainer} showsVerticalScrollIndicator={false}>
              {/* Nombre */}
              <Text style={styles.inputLabel}>Nombre</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#1B8CA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Teléfono */}
              <Text style={styles.inputLabel}>Teléfono</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="call" size={20} color="#1B8CA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa tu teléfono"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Sección de contraseña */}
              <View style={styles.sectionDivider}>
                <LinearGradient
                  colors={["#fc9414", "#f57c00"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.sectionGradient}
                >
                  <Text style={styles.formSectionTitle}>Cambiar contraseña (opcional)</Text>
                </LinearGradient>
              </View>
              
              {/* Contraseña nueva */}
              <Text style={styles.inputLabel}>Contraseña nueva</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed" size={20} color="#1B8CA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Ingresa nueva contraseña"
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={true}
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Confirmar contraseña */}
              <Text style={styles.inputLabel}>Confirmar contraseña</Text>
              <View style={[
                styles.inputContainer,
                shouldShowPasswordError && styles.inputContainerError
              ]}>
                <Ionicons 
                  name={shouldShowPasswordError ? "alert-circle" : "lock-closed"} 
                  size={20} 
                  color={shouldShowPasswordError ? "red" : "#1B8CA6"} 
                  style={styles.inputIcon} 
                />
                <TextInput
                  style={styles.input}
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={true}
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Mensaje de error si las contraseñas no coinciden */}
              {shouldShowPasswordError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="warning" size={16} color="red" />
                  <Text style={styles.errorText}>
                    Las contraseñas no coinciden
                  </Text>
                </View>
              )}

              {/* Soy conductor */}
              <View style={styles.sectionDivider}>
                <LinearGradient
                  colors={["#fc9414", "#f57c00"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.sectionGradient}
                >
                  <Text style={styles.formSectionTitle}>Soy conductor</Text>
                </LinearGradient>
              </View>
              
              {/* Runt */}
              <Text style={styles.inputLabel}>Runt</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="card" size={20} color="#1B8CA6" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número RUNT"
                  value={runt}
                  onChangeText={setRunt}
                  placeholderTextColor="#aaa"
                />
              </View>
              
              {/* Fecha expiracion id*/}
              <Text style={styles.inputLabel}>Fecha de expiración licencia</Text>
              {show && (
                <DateTimePicker
                  mode='date'
                  display='spinner'
                  value={birthDate}
                  onChange={onChange}
                  minimumDate={new Date(Date.now() + 86400000)} // Tomorrow
                />
              )}
              
              {!show && (
                <View style={styles.inputContainer}>
                  <Ionicons name="calendar" size={20} color="#1B8CA6" style={styles.inputIcon} />
                  <Pressable 
                    onPress={toggleDatePicker}
                    style={styles.datePickerButton}
                  >
                    <Text style={styles.dateText}>
                      {birthDate.toLocaleDateString()}
                    </Text>
                  </Pressable>
                </View>
              )}
              
              {/* Botones */}
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={() => {
                    setModalVisible(false);
                    resetForm();
                  }}
                >
                  <LinearGradient
                    colors={["#c91905", "#a31504"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.modalButtonText}>Cancelar</Text>
                  </LinearGradient>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[
                    styles.modalButton,
                    !canSaveChanges && styles.disabledButton
                  ]}
                  onPress={handleSaveChanges}
                  disabled={!canSaveChanges}
                >
                  <LinearGradient
                    colors={["#11ac28", "#0a8a1f"]}
                    start={[0, 0]}
                    end={[1, 1]}
                    style={styles.modalButtonGradient}
                  >
                    <Text style={styles.modalButtonText}>Guardar cambios</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  scrollViewContent: {
    paddingBottom: 30,
    alignItems: 'center',
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  titleContainer: {
    marginVertical: 16,
    borderRadius: 12,
    overflow: 'hidden',
    width: '90%',
  },
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  profileImageContainer: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  profilePhotoSection: {
    alignItems: 'center',
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 15,
    borderWidth: 3,
    borderColor: '#fc9414',
  },
  photoButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'left',
    width: '100%',
    marginBottom: 10,
  },
  photoButton: {
    marginHorizontal: 5,
    borderRadius: 10,
    overflow: 'hidden',
  },
  photoButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  photoButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  optionsContainer: {
    width: '90%',
    backgroundColor: 'rgba(27, 140, 166, 0.2)', // Slightly transparent version of #1B8CA6
    borderRadius: 15,
    padding: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 15,
    textAlign: 'center',
  },
  optionButton: {
    marginVertical: 8,
    borderRadius: 10,
    overflow: 'hidden',
  },
  optionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  optionIconContainer: {
    marginRight: 15,
  },
  optionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  arrowIcon: {
    marginLeft: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: 'white',
  },
  formContainer: {
    padding: 20,
    maxHeight: 500,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
  },
  inputContainerError: {
    borderColor: "red",
    borderWidth: 2,
  },
  inputIcon: {
    padding: 10,
  },
  input: {
    flex: 1,
    height: 50,
    padding: 10,
    color: '#333',
  },
  datePickerButton: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 10,
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    marginLeft: 5,
    fontSize: 14,
  },
  sectionDivider: {
    marginVertical: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  sectionGradient: {
    padding: 10,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: 'white',
    textAlign: 'center',
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 5,
  },
  modalButtonGradient: {
    padding: 15,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});