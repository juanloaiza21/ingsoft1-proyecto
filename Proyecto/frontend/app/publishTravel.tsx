import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./context/themeContext";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  Alert,
  Platform,
  ScrollView,
  Dimensions,
  Keyboard
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ConfigVariables } from "./config/config";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function PublishTravel(): JSX.Element {
  const { theme } = useTheme();
  const router = useRouter();

  // Form state
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [price, setPrice] = useState<string>("");
  const [published, setPublished] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);

  // Animation refs
  const logoAnim = useRef(new Animated.Value(300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const publishAnim = useRef(new Animated.Value(0)).current;
  const successIconAnim = useRef(new Animated.Value(0)).current;
  const successScaleAnim = useRef(new Animated.Value(0.5)).current;
  const inputAnimRefs = {
    origin: useRef(new Animated.Value(0)).current,
    destination: useRef(new Animated.Value(0)).current,
    date: useRef(new Animated.Value(0)).current,
    price: useRef(new Animated.Value(0)).current,
  };

  // Validations
  const isOriginValid = origin.trim() !== "";
  const isDestinationValid = destination.trim() !== "";
  const isDateValid = date !== null;
  const isPriceValid = parseFloat(price) > 0;
  const isFormValid =
    isOriginValid && isDestinationValid && isDateValid && isPriceValid;

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
  
  useEffect(() => {
    const loadTokens = async () => {
      await getTokens();
      if (access_token && refresh_token) {
        console.log('Tokens recuperados correctamente');
      }
    };
    loadTokens();
  }, []);

  // Setup animations
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
    
    // Animation sequence for form elements
    const animateInputs = () => {
      const inputs = [
        inputAnimRefs.origin,
        inputAnimRefs.destination,
        inputAnimRefs.date,
        inputAnimRefs.price
      ];
      
      inputs.forEach((anim, i) => {
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.spring(anim, {
            toValue: 1,
            friction: 6,
            tension: 40,
            useNativeDriver: true,
          })
        ]).start();
      });
    };
    
    animateInputs();
    
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // Handle success animation when published
  useEffect(() => {
    if (published) {
      // Animate success state
      Animated.parallel([
        Animated.timing(publishAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.spring(successIconAnim, {
          toValue: 1,
          friction: 4,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.spring(successScaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        })
      ]).start();
      
      // Navigate after animation
      setTimeout(() => {
        router.push('..');
      }, 1500);
    }
  }, [published]);

  // Handle price input with $ symbol
  const handlePriceChange = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);
  };

  // Format price with $ symbol
  const formattedPrice = price ? `$${price} COP` : "";

  // Handle date/time selection in two steps
  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === "date") {
        // When the user picks the date, save it and open the time picker.
        setDate(new Date(selectedDate));
        setPickerMode("time");
        setShowPicker(true);
      } else {
        // When the user picks the time, update the existing date with the new time.
        if (date) {
          const updatedDate = new Date(date);
          updatedDate.setHours(selectedDate.getHours());
          updatedDate.setMinutes(selectedDate.getMinutes());
          setDate(updatedDate);
        } else {
          // In the unlikely event that date is null, use the selected time.
          setDate(selectedDate);
        }
        setPickerMode("date"); // Reset mode for future use
      }
    }
  };

  // Button animation
  const buttonScaleAnim = useRef(new Animated.Value(1)).current;
  
  const handlePressIn = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };
  
  const handlePressOut = () => {
    Animated.spring(buttonScaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 50,
      useNativeDriver: true,
    }).start();
  };

  // Handle publish button press
  const handlePublish = async () => {
    if (!isFormValid) return;
    
    try {
    console.log('Publicando viaje...');
      const petition = await axios.request({
        method: ConfigVariables.api.trip.driverCreateTrip.method,
        url: ConfigVariables.api.trip.driverCreateTrip.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data: {
          origin,
          destination,
          date,
          price: parseInt(price)
        }
      });
      setPublished(true);
      console.log('Viaje publicado:', petition.data);
      
    } catch (error) {
      Alert.alert('Solo conductores pueden crear viajes', 'Conviertete en conductor desde la sección de ajustes');
      router.push('..');
    }
  };

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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Page Title */}
        <Animated.View 
          style={{ 
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            marginBottom: 20
          }}
        >
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="car-sport" size={28} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Publica un viaje</Text>
          </LinearGradient>
        </Animated.View>

        {/* Form Content */}
        <View style={styles.formContainer}>
          {/* Origen */}
          <Animated.View style={{ 
            opacity: inputAnimRefs.origin,
            transform: [{ 
              translateY: inputAnimRefs.origin.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="location" size={20} color="#fc9414" />
              </View>
              <TextInput
                style={[
                  styles.input,
                  isOriginValid && styles.inputValid
                ]}
                placeholder="Origen"
                placeholderTextColor="#888888"
                value={origin}
                onChangeText={setOrigin}
                editable={!published}
              />
            </View>
          </Animated.View>

          {/* Destino */}
          <Animated.View style={{ 
            opacity: inputAnimRefs.destination,
            transform: [{ 
              translateY: inputAnimRefs.destination.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="flag" size={20} color="#fc9414" />
              </View>
              <TextInput
                style={[
                  styles.input,
                  isDestinationValid && styles.inputValid
                ]}
                placeholder="Destino"
                placeholderTextColor="#888888"
                value={destination}
                onChangeText={setDestination}
                editable={!published}
              />
            </View>
          </Animated.View>

          {/* Date & Time Picker */}
          <Animated.View style={{ 
            opacity: inputAnimRefs.date,
            transform: [{ 
              translateY: inputAnimRefs.date.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}>
            <TouchableOpacity
              onPress={() => {
                if (!published) {
                  setPickerMode("date");
                  setShowPicker(true);
                }
              }}
              disabled={published}
            >
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconContainer}>
                  <Ionicons name="calendar" size={20} color="#fc9414" />
                </View>
                <View style={[
                  styles.datePickerTouchable,
                  isDateValid && styles.inputValid
                ]}>
                  <Text style={[
                    styles.dateText,
                    date ? styles.dateTextSelected : styles.dateTextPlaceholder
                  ]}>
                    {date ? date.toLocaleString() : "Selecciona fecha y hora"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>

          {showPicker && !published && (
            <DateTimePicker
              value={date ? date : new Date()}
              mode={pickerMode}
              display="default"
              onChange={handleDateTimeChange}
            />
          )}

          {/* Precio */}
          <Animated.View style={{ 
            opacity: inputAnimRefs.price,
            transform: [{ 
              translateY: inputAnimRefs.price.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              })
            }]
          }}>
            <View style={styles.inputWrapper}>
              <View style={styles.inputIconContainer}>
                <Ionicons name="pricetag" size={20} color="#fc9414" />
              </View>
              <TextInput
                style={[
                  styles.input,
                  isPriceValid && styles.inputValid
                ]}
                placeholder="Precio ($)"
                placeholderTextColor="#888888"
                keyboardType="numeric"
                value={formattedPrice}
                onChangeText={handlePriceChange}
                editable={!published}
              />
            </View>
          </Animated.View>

          {/* Publish Button */}
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: buttonScaleAnim }],
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handlePublish}
              disabled={!isFormValid || published}
            >
              <LinearGradient
                colors={published ? ["#11ac28", "#0a8a1f"] : isFormValid ? ["#fc9414", "#f57c00"] : ["#aaaaaa", "#888888"]}
                start={[0, 0]}
                end={[1, 1]}
                style={styles.buttonGradient}
              >
                {published ? (
                  <Animated.View 
                    style={{ 
                      flexDirection: 'row', 
                      alignItems: 'center',
                      opacity: publishAnim,
                      transform: [{ scale: successScaleAnim }]
                    }}
                  >
                    <Ionicons name="checkmark-circle" size={24} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>¡Viaje publicado con éxito!</Text>
                  </Animated.View>
                ) : (
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="send" size={20} color="white" style={{ marginRight: 10 }} />
                    <Text style={styles.buttonText}>Publicar viaje</Text>
                  </View>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
          
          {/* Success Animation */}
          {published && (
            <Animated.View 
              style={[
                styles.successContainer, 
                { 
                  opacity: successIconAnim,
                  transform: [
                    { translateY: successIconAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [50, 0]
                    })},
                    { scale: successScaleAnim }
                  ] 
                }
              ]}
            >
              <Animated.Image
                source={require("../assets/images/icon-black.png")}
                style={styles.successIcon}
                resizeMode="contain"
              />
            </Animated.View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#024059",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
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
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderRadius: 12,
    backgroundColor: 'white',
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  inputIconContainer: {
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRightWidth: 1,
    borderRightColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#333',
  },
  inputValid: {
    backgroundColor: '#ffefd3',
  },
  datePickerTouchable: {
    flex: 1,
    height: 50,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 16,
  },
  dateTextSelected: {
    color: '#333',
  },
  dateTextPlaceholder: {
    color: '#888888',
  },
  buttonGradient: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  successIcon: {
    width: 120,
    height: 120,
    marginBottom: 15,
  },
  successText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
  },
});
