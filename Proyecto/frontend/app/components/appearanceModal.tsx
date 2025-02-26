import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../context/themeContext";

// Definir el tipo de las props
interface AppearanceModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function AppearanceModal({ visible, onClose }: AppearanceModalProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Apariencia</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.optionButton, theme === "light" && styles.selected]}
              onPress={() => toggleTheme("light")}
            >
              <Text style={styles.buttonText}>Claro</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.optionButton, theme === "dark" && styles.selected]}
              onPress={() => toggleTheme("dark")}
            >
              <Text style={styles.buttonText}>Oscuro</Text>
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
  buttonContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  optionButton: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 10,
    backgroundColor: "#ccc",
  },
  selected: {
    backgroundColor: "#007bff",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  confirmButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
  },
});
