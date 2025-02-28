// app/solicitudViaje.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator 
} from 'react-native';

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
        { id: '1', title: 'Viaje a Bogotá', description: 'Salida: 8:00 AM - Precio: $20' },
        { id: '2', title: 'Viaje a Medellín', description: 'Salida: 9:00 AM - Precio: $25' },
        { id: '3', title: 'Viaje a Cali', description: 'Salida: 10:00 AM - Precio: $22' },
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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [travelOptions, setTravelOptions] = useState<TravelOption[]>([]);
  const [loadingTravel, setLoadingTravel] = useState<boolean>(false);

  const [starOptions, setStarOptions] = useState<StarOption[]>([]);
  const [starDropdownVisible, setStarDropdownVisible] = useState<boolean>(false);
  const [loadingStar, setLoadingStar] = useState<boolean>(false);

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

  return (
    <View style={styles.container}>
      {/* Header con barra de búsqueda y botón de estrella */}
      <View style={styles.headerContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar viaje..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearchSubmit}
          returnKeyType="search"
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
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.travelOption}
                onPress={() => handleTravelPress(item)}
              >
                <Text style={styles.travelTitle}>{item.title}</Text>
                <Text style={styles.travelDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
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
  travelOption: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  travelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  travelDescription: {
    fontSize: 16,
    color: '#555',
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
  },
});
