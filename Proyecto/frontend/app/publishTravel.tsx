import React, { useState } from "react";
import { useTheme } from "./context/themeContext";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Slider from "@react-native-community/slider";

export default function PublishTravel(): JSX.Element {
  const { theme } = useTheme(); //para cambiar el tema

  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [date, setDate] = useState<Date | null>(null);
  // Use separate state for controlling the picker and its mode
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [price, setPrice] = useState<string>(""); // Using string for numeric input
  const [seats, setSeats] = useState<number>(1);
  const [published, setPublished] = useState<boolean>(false);

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

  const handlePublish = () => {
    setPublished(true);
    // Add any additional logic (e.g., API calls) here.
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme === "dark" ? "#2d2c24" : "white" },
      ]}
    >
      <Text style={[styles.title, theme === "dark" && styles.title2]}>
        Publica un viaje
      </Text>

      {/* Origen */}
      <TextInput
        style={[styles.input, !isOriginValid && styles.inputError]}
        placeholder="Origen"
        
        placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        value={origin}
        onChangeText={setOrigin}
        editable={!published}
      />

      {/* Destino */}
      <TextInput
        style={[styles.input, !isDestinationValid && styles.inputError]}
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
        style={[styles.input, !isPriceValid && styles.inputError]}
        placeholder="Precio ($)"
        placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        keyboardType="numeric"
        value={formattedPrice}
        onChangeText={handlePriceChange}
        editable={!published}
      />

      {/* Asientos */}
      <View style={styles.sliderContainer}>
        <Text style={[styles.sliderLabel, theme === "dark" && styles.sliderLabel2]}

        
        >
          Número de asientos disponibles: {seats}
        </Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={seats}
          onValueChange={setSeats}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ccc"
          disabled={published}
        />
      </View>

      {/* Publicar Button */}
      <TouchableOpacity
        style={[
          styles.button,
          !isFormValid && styles.buttonDisabled,
          published && styles.buttonSuccess,
        ]}
        onPress={handlePublish}
        disabled={!isFormValid || published}
      >
        <Text style={styles.buttonText}>
          {published ? "Viaje publicado con éxito" : "Publicar"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  title2: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: "center",
  },
  inputError: {
    borderColor: "red",
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
    backgroundColor: "#007AFF",
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
});
