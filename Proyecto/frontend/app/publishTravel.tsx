// app/publishTravel.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Slider from '@react-native-community/slider';

export default function PublishTravel(): JSX.Element {
  const [origin, setOrigin] = useState<string>('');
  const [destination, setDestination] = useState<string>('');
  const [date, setDate] = useState<Date | null>(null);
  // Use separate state for controlling the picker and its mode
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [price, setPrice] = useState<string>(''); // Using string for numeric input
  const [seats, setSeats] = useState<number>(1);
  const [published, setPublished] = useState<boolean>(false);

  // Validations
  const isOriginValid = origin.trim() !== '';
  const isDestinationValid = destination.trim() !== '';
  const isDateValid = date !== null;
  const isPriceValid = parseFloat(price) > 0;
  const isFormValid = isOriginValid && isDestinationValid && isDateValid && isPriceValid;

  // Handle date/time selection in two steps
  const handleDateTimeChange = (event: any, selectedDate?: Date) => {
    setShowPicker(false);
    if (selectedDate) {
      if (pickerMode === 'date') {
        // When the user picks the date, save it and open the time picker.
        setDate(new Date(selectedDate));
        setPickerMode('time');
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
        setPickerMode('date'); // Reset mode for future use
      }
    }
  };

  const handlePublish = () => {
    setPublished(true);
    // Add any additional logic (e.g., API calls) here.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Publica un viaje</Text>

      {/* Origen */}
      <TextInput 
        style={[styles.input, !isOriginValid && styles.inputError]} 
        placeholder="Origen"
        value={origin}
        onChangeText={setOrigin}
      />

      {/* Destino */}
      <TextInput 
        style={[styles.input, !isDestinationValid && styles.inputError]} 
        placeholder="Destino"
        value={destination}
        onChangeText={setDestination}
      />

      {/* Date & Time Picker */}
      <TouchableOpacity 
        onPress={() => {
          // Always start by picking the date.
          setPickerMode('date');
          setShowPicker(true);
        }} 
        style={[styles.input, styles.dateInput, !isDateValid && styles.inputError]}
      >
        <Text style={styles.dateText}>
          {date ? date.toLocaleString() : "Selecciona fecha y hora"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
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
        placeholder="Precio"
        keyboardType="numeric"
        value={price}
        onChangeText={setPrice}
      />

      {/* Asientos */}
      <View style={styles.sliderContainer}>
        <Text style={styles.sliderLabel}>Número de asientos: {seats}</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={5}
          step={1}
          value={seats}
          onValueChange={setSeats}
          minimumTrackTintColor="#007AFF"
          maximumTrackTintColor="#ccc"
        />
      </View>

      {/* Publicar Button */}
      <TouchableOpacity 
        style={[styles.button, (!isFormValid || published) && styles.buttonDisabled]} 
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
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
    justifyContent: 'center'
  },
  inputError: {
    borderColor: 'red'
  },
  dateInput: {
    justifyContent: 'center'
  },
  dateText: {
    color: '#333'
  },
  sliderContainer: {
    marginVertical: 15
  },
  sliderLabel: {
    fontSize: 16,
    marginBottom: 5
  },
  slider: {
    width: '100%',
    height: 40
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20
  },
  buttonDisabled: {
    backgroundColor: '#ccc'
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  }
});