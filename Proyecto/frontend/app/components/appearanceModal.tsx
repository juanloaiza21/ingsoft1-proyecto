import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
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
        <View style={[
          styles.modalContent,
          { backgroundColor: theme === "dark" ? "#2d2c24" : "#024059" }
        ]}>
          <LinearGradient
            colors={["#fc9414", "#f57c00"]}
            start={[0, 0]}
            end={[1, 1]}
            style={styles.titleGradient}
          >
            <Ionicons name="color-palette" size={24} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Apariencia</Text>
          </LinearGradient>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => toggleTheme("light")}
              style={styles.optionButtonContainer}
            >
              <LinearGradient
                colors={theme === "light" ? ["#11ac28", "#0d8a21"] : ["#1B8CA6", "#0a6a80"]}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.optionButton, theme === "light" && styles.selected]}
              >
                <Ionicons name="sunny" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Claro</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => toggleTheme("dark")}
              style={styles.optionButtonContainer}
            >
              <LinearGradient
                colors={theme === "dark" ? ["#11ac28", "#0d8a21"] : ["#1B8CA6", "#0a6a80"]}
                start={[0, 0]}
                end={[1, 1]}
                style={[styles.optionButton, theme === "dark" && styles.selected]}
              >
                <Ionicons name="moon" size={20} color="white" style={{ marginRight: 8 }} />
                <Text style={styles.buttonText}>Oscuro</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={onClose} style={styles.confirmButtonContainer}>
            <LinearGradient
              colors={["#1B8CA6", "#0a6a80"]}
              start={[0, 0]}
              end={[1, 1]}
              style={styles.confirmButton}
            >
              <Text style={styles.confirmText}>Confirmar</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContent: {
    width: width * 0.85,
    padding: 0,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    overflow: "hidden",
  },
  titleGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  optionButtonContainer: {
    width: "45%",
  },
  optionButton: {
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderWidth: 2,
    borderColor: "white",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  confirmButtonContainer: {
    width: "80%",
    marginBottom: 20,
  },
  confirmButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },
});
