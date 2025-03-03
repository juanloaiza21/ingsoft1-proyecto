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
} from "react-native";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { ConfigVariables } from "./config/config";

export default function PublishTravel(): JSX.Element {
  const { theme } = useTheme(); // para cambiar el tema

  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  // Use separate state for controlling the picker and its mode
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [price, setPrice] = useState<string>(""); // Using string for numeric input
  const [published, setPublished] = useState<boolean>(false);
  const [access_token, setAccess_token] = useState<string>('');
  const [refresh_token, setRefresh_token] = useState<string>('');
  const router = useRouter()

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
  // Validations
  const isOriginValid = origin.trim() !== "";
  const isDestinationValid = destination.trim() !== "";
  const isDateValid = date !== null;
  const isPriceValid = parseFloat(price) > 0;
  const isFormValid =
    isOriginValid && isDestinationValid && isDateValid && isPriceValid;

  // Handle price input with $ symbol
  const handlePriceChange = (text: string) => {
    // Remove any non-numeric characters
    const numericValue = text.replace(/[^0-9]/g, "");
    setPrice(numericValue);
  };

  // Format price with $ symbol
  const formattedPrice = price ? `$${price}` : "";

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

  const handlePublish =async  () => {
    try {
      const petition = await axios.request({
        method: ConfigVariables.api.trip.driverCreateTrip.method,
        url: ConfigVariables.api.trip.driverCreateTrip.url,
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
        data:{
          origin,
          destination,
          date,
          price: parseInt(price)
        }
      });
      setPublished(true); 
      console.log('Viaje publicado:', petition.data);
    } catch (error) {
      console.error('Error al publicar viaje:', error);
      Alert.alert('Error', 'No se pudo publicar el viaje. Inténtalo de nuevo.');
    }
  };

  // Animated value for the top bar logo (unchanged)
  const logoAnim = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    Animated.spring(logoAnim, {
      toValue: 0,
      friction: 4,
      tension: 5,
      useNativeDriver: true,
    }).start();
  }, [logoAnim]);

  // Animated value for the new icon-black image that will animate below the button
  const publishAnim = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    if (published) {
      Animated.timing(publishAnim, {
        toValue: -400, // Adjust this value as needed to fully move off-screen to the right
        duration: 1500,
        useNativeDriver: true,
      }).start();
    }
  }, [published, publishAnim]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" },
      ]}
    >
      <View style={styles.topBar}>
        {/* Left: App Name Image (unchanged) */}
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
      <Text style={[styles.title, theme === "dark" && styles.title2]}>
        Publica un viaje
      </Text>

      {/* Origen */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: origin.trim() ? "#ffc073" : "#fff" },
          !isOriginValid && styles.inputError,
        ]}
        placeholder="Origen"
        placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        value={origin}
        onChangeText={setOrigin}
        editable={!published}
      />

      {/* Destino */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: destination.trim() ? "#ffc073" : "#fff" },
          !isDestinationValid && styles.inputError,
        ]}
        placeholder="Destino"
        placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        value={destination}
        onChangeText={setDestination}
        editable={!published}
      />

      {/* Date & Time Picker */}
      <TouchableOpacity
        onPress={() => {
          if (!published) {
            // Always start by picking the date.
            setPickerMode("date");
            setShowPicker(true);
          }
        }}
        style={[
          styles.input,
          styles.dateInput,
          !isDateValid && styles.inputError,
          published && styles.disabledInput,
          { backgroundColor: date ? "#ffc073" : "#fff" },
        ]}
        disabled={published}
      >
        <Text style={styles.dateText}>
          {date ? date.toLocaleString() : "Selecciona fecha y hora"}
        </Text>
      </TouchableOpacity>
      {showPicker && !published && (
        <DateTimePicker
          value={date ? date : new Date()}
          mode={pickerMode}
          display="default"
          onChange={handleDateTimeChange}
        />
      )}

      {/* Precio */}
      <TextInput
        style={[
          styles.input,
          { backgroundColor: price.trim() ? "#ffc073" : "#fff" },
          !isPriceValid && styles.inputError,
        ]}
        placeholder="Precio ($)"
        placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        keyboardType="numeric"
        value={formattedPrice}
        onChangeText={handlePriceChange}
        editable={!published}
      />

      {/* Publicar Button */}
      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && styles.buttonDisabled,
          published && styles.buttonSuccess,
        ]}
        onPress={() => {
          handlePublish();
          setTimeout(() => {
            router.push('..')
          }, 1200)
        }}
      >
        <Text style={styles.buttonText}>
          {published ? "Viaje publicado con éxito" : "Publicar"}
        </Text>
      </TouchableOpacity>

      {/* Animated icon-black image below the Publicar button */}
      {published && (
        <Animated.Image
          source={require("../assets/images/icon-black.png")}
          style={[
            styles.publishIcon,
            { transform: [{ translateX: publishAnim }] },
          ]}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "white",
  },
  title2: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  appNameImage: {
    width: 120,
    height: 40,
    marginHorizontal: 20,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: -15,
    borderRadius: 20,
    marginHorizontal: -10,
    marginVertical: 5,
  },
  animatedLogo: {
    width: 60,
    height: 60,
    marginHorizontal: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 35,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
    borderColor: "#fc9414",
  },
  inputError: {
    borderColor: "#fc9414",
  },
  disabledInput: {
    backgroundColor: "#f0f0f0",
    color: "#888",
  },
  dateInput: {
    justifyContent: "center",
  },
  dateText: {
    color: "#333",
  },
  sliderContainer: {
    marginVertical: 15,
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  sliderLabel2: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  button: {
    backgroundColor: "#fc9414",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#ccc",
  },
  buttonSuccess: {
    backgroundColor: "#4CD964", // Color verde de iOS
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  publishIcon: {
    width: 220,
    height: 220,
    alignSelf: "center",
    marginTop: 20,
  },
});
