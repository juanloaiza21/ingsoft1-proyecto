import React, { useState, useEffect } from "react";
import { useTheme } from "./context/themeContext";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Image,
  ActivityIndicator,
  Button,
  TextInput
} from "react-native";
import { useRouter } from "expo-router";

interface TravelOption {
  id: string;
  title: string;
  description: string;
}

interface StarOption {
  id: string;
  name: string;
}

// Función simulada para obtener opciones de viaje desde el backend
const fetchTravelOptions = async (query: string): Promise<TravelOption[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: '1', title: 'Universidad Nacional - Facatativá', description: 'Salida: 8:00 AM - Precio: $20' },
        { id: '2', title: 'Chía - Universidad Nacional', description: 'Salida: 9:00 AM - Precio: $25' },
        { id: '3', title: 'Universidad Nacional - Bosa', description: 'Salida: 10:00 AM - Precio: $22' },
      ]);
    }, 1000);
  });
};

// Función simulada para obtener opciones de la estrella desde el backend
const fetchStarOptions = async (): Promise<StarOption[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { id: 'a', name: 'Opción Favorita 1' },
        { id: 'b', name: 'Opción Favorita 2' },
        { id: 'c', name: 'Opción Favorita 3' },
      ]);
    }, 1000);
  });
};

export default function SolicitudViaje(): JSX.Element {

  const { theme } = useTheme(); //para cambiar el tema

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [loadingTravel, setLoadingTravel] = useState<boolean>(false);

  const [starOptions, setStarOptions] = useState<StarOption[]>([]);
  const [starDropdownVisible, setStarDropdownVisible] = useState<boolean>(false);
  const [loadingStar, setLoadingStar] = useState<boolean>(false);

  const router = useRouter();

  // Maneja la búsqueda al confirmar el texto
  const handleSearchSubmit = async () => {
    setLoadingTravel(true);
    const results = await fetchTravelOptions(searchQuery);
    setTravelOptions(results);
    setLoadingTravel(false);
  };

  // Alterna la visibilidad del dropdown de la estrella
  const toggleStarDropdown = async () => {
    if (!starDropdownVisible) {
      setLoadingStar(true);
      const options = await fetchStarOptions();
      setStarOptions(options);
      setLoadingStar(false);
      setStarDropdownVisible(true);
    } else {
      setStarDropdownVisible(false);
    }
  };

  // Función para manejar la acción al presionar una opción de viaje
  const handleTravelPress = (item: TravelOption) => {
    console.log("Opción de viaje presionada:", item);
    // Aquí podrías navegar a una pantalla de detalles, por ejemplo:
    // router.push(`/detalleViaje/${item.id}`);
  };

  const renderTravelOption = ({ item }: { item: TravelOption }) => (
    <View style={styles.travelOption}>
      <View style={styles.travelTextContainer}>
        <Text style={styles.travelTitle}>{item.title}</Text>
        <Text style={styles.travelDescription}>{item.description}</Text>
      </View>
      <TouchableOpacity 
        style={styles.verViajeButton} 
        onPress={() => router.push("/newTrip")}
      >
        <Text style={styles.verViajeButtonText}>Ver viaje</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
    >
      {/* Header con barra de búsqueda y botón de estrella */}
      <View style={styles.headerContainer}>
        <TextInput
          style={[styles.title, theme === "dark" && styles.title2]}
          placeholder="Buscar viaje..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
          placeholderTextColor={theme === "dark" ? "#AAAAAA" : "#888888"}
        />
        <TouchableOpacity style={styles.starButton} onPress={toggleStarDropdown}>
          <Text style={styles.starIcon}>★</Text>
        </TouchableOpacity>
      </View>

      {/* Dropdown de opciones de la estrella */}
      {starDropdownVisible && (
        <View style={styles.starDropdown}>
          {loadingStar ? (
            <ActivityIndicator size="small" color="#007AFF" />
          ) : (
            starOptions.map(option => (
              <TouchableOpacity key={option.id} style={styles.starOption}>
                <Text style={styles.starOptionText}>{option.name}</Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      )}

      {/* Lista de opciones de viaje */}
      <View style={styles.travelOptionsContainer}>
        {loadingTravel ? (
          <ActivityIndicator size="large" color="#007AFF" />
        ) : travelOptions.length > 0 ? (
          <FlatList
            data={travelOptions}
            keyExtractor={(item) => item.id}
            renderItem={renderTravelOption}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <Text style={styles.noResultsText}>No hay opciones de viaje</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  headerContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  title: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 45, // Espacio para el botón de estrella
    fontSize: 16,
  },
  title2: {
    color : "white",
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 45, // Espacio para el botón de estrella
    fontSize: 16,
  },
  searchInput: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingRight: 45, // Espacio para el botón de estrella
    fontSize: 16,
  },
  starButton: {
    position: 'absolute',
    right: 10,
    top: 7,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 24,
    color: '#FFD700',
  },
  starDropdown: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  starOption: {
    paddingVertical: 5,
  },
  starOptionText: {
    fontSize: 16,
    color: '#333',
  },
  travelOptionsContainer: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 20,
  },
  travelOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: "#fafafa",
  },
  travelTextContainer: {
    flex: 1,
    marginRight: 10,
  },
  travelTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  travelDescription: {
    fontSize: 16,
    color: "#555",
  },
  verViajeButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  verViajeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noResultsText: {
    fontSize: 16,
    textAlign: "center",
    color: "#999",
    marginTop: 20,
  },
});
