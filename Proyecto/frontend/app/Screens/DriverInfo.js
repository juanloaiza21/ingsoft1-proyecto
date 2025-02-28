// DriverInfo.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome } from '@expo/vector-icons';

const DriverInfo = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>INFORMACIÓN DEL CONDUCTOR</Text>
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileIcon}>
          <Ionicons name="person" size={50} color="black" />
        </View>
        <Text style={styles.profileName}>Juan Pérez</Text>
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={20} color="#FFD700" />
          <Text style={styles.rating}>4.8</Text>
        </View>
        <Text style={styles.profileSubtitle}>Conductor desde 2020</Text>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Información del Vehículo</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="car" size={24} color="#0088FF" />
          </View>
          <Text style={styles.infoText}>Toyota Corolla - 2022</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <Ionicons name="color-palette" size={24} color="#0088FF" />
          </View>
          <Text style={styles.infoText}>Color: Blanco</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="credit-card" size={24} color="#0088FF" />
          </View>
          <Text style={styles.infoText}>Placa: ABC-123</Text>
        </View>
      </View>

      <View style={styles.sectionTitle}>
        <Text style={styles.sectionTitleText}>Contacto</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <FontAwesome name="phone" size={24} color="#0088FF" />
          </View>
          <Text style={styles.infoText}>+57 300 123 4567</Text>
        </View>
        <View style={styles.infoItem}>
          <View style={styles.infoIconContainer}>
            <MaterialIcons name="email" size={24} color="#0088FF" />
          </View>
          <Text style={styles.infoText}>juan.perez@ejemplo.com</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => {}}>
          <Ionicons name="call" size={20} color="white" />
          <Text style={styles.buttonText}>Llamar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button}
          onPress={() => navigation.navigate('ChatScreen')}
        >
          <Ionicons name="chatbubble" size={20} color="white" />
          <Text style={styles.buttonText}>Mensaje</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  profileSection: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'white',
  },
  profileIcon: {
    width: 100,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  profileSubtitle: {
    color: '#666',
    fontSize: 16,
  },
  sectionTitle: {
    padding: 16,
    backgroundColor: '#f8f8f8',
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  infoSection: {
    backgroundColor: 'white',
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  infoIconContainer: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    padding: 16,
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#0088FF',
    borderRadius: 8,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DriverInfo;