import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Notificaciones</Text>

          <Text style={styles.sectionTitle}>Notificaciones de mensajes</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.optionButton, messagesEnabled && styles.selected]}
              onPress={() => setMessagesEnabled(true)}
            >
              <Text style={styles.buttonText}>Activar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, !messagesEnabled && styles.selected]}
              onPress={() => setMessagesEnabled(false)}
            >
              <Text style={styles.buttonText}>Desactivar</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionTitle}>Vibración</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.optionButton, vibrationEnabled && styles.selected]}
              onPress={() => setVibrationEnabled(true)}
            >
              <Text style={styles.buttonText}>Activar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, !vibrationEnabled && styles.selected]}
              onPress={() => setVibrationEnabled(false)}
            >
              <Text style={styles.buttonText}>Desactivar</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.confirmButton} onPress={onClose}>
            <Text style={styles.confirmText}>Confirmar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#ccc",
    borderWidth: 1, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  selected: {
    backgroundColor: "#11ac28",
    borderWidth: 1, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#11ac28",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1, // Grosor del borde
    borderColor: "black", // Color del borde negro
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
});
