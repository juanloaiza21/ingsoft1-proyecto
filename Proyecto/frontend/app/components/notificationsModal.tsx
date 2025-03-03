import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/themeContext";

interface NotificationsModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function NotificationsModal({ visible, onClose }: NotificationsModalProps) {
  const [messagesEnabled, setMessagesEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const { theme } = useTheme();

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
            <Ionicons name="notifications" size={24} color="white" style={{ marginRight: 10 }} />
            <Text style={styles.title}>Notificaciones</Text>
          </LinearGradient>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Notificaciones de mensajes</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.optionButton, messagesEnabled && styles.selectedContainer]}
                onPress={() => setMessagesEnabled(true)}
              >
                <LinearGradient
                  colors={messagesEnabled ? ["#1B8CA6", "#0a6a80"] : ["#666", "#444"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradientButton}
                >
                  <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginRight: 5, opacity: messagesEnabled ? 1 : 0 }} />
                  <Text style={styles.buttonText}>Activar</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, !messagesEnabled && styles.selectedContainer]}
                onPress={() => setMessagesEnabled(false)}
              >
                <LinearGradient
                  colors={!messagesEnabled ? ["#1B8CA6", "#0a6a80"] : ["#666", "#444"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradientButton}
                >
                  <Ionicons name="close-circle" size={16} color="white" style={{ marginRight: 5, opacity: !messagesEnabled ? 1 : 0 }} />
                  <Text style={styles.buttonText}>Desactivar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Vibración</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.optionButton, vibrationEnabled && styles.selectedContainer]}
                onPress={() => setVibrationEnabled(true)}
              >
                <LinearGradient
                  colors={vibrationEnabled ? ["#1B8CA6", "#0a6a80"] : ["#666", "#444"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradientButton}
                >
                  <Ionicons name="checkmark-circle" size={16} color="white" style={{ marginRight: 5, opacity: vibrationEnabled ? 1 : 0 }} />
                  <Text style={styles.buttonText}>Activar</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.optionButton, !vibrationEnabled && styles.selectedContainer]}
                onPress={() => setVibrationEnabled(false)}
              >
                <LinearGradient
                  colors={!vibrationEnabled ? ["#1B8CA6", "#0a6a80"] : ["#666", "#444"]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={styles.gradientButton}
                >
                  <Ionicons name="close-circle" size={16} color="white" style={{ marginRight: 5, opacity: !vibrationEnabled ? 1 : 0 }} />
                  <Text style={styles.buttonText}>Desactivar</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity style={styles.confirmButtonContainer} onPress={onClose}>
            <LinearGradient
              colors={["#fc9414", "#f57c00"]}
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

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#024059",
    borderRadius: 12,
    overflow: "hidden",
    paddingBottom: 20,
  },
  titleGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    width: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  sectionContainer: {
    width: "100%",
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginBottom: 10,
  },
  optionButton: {
    flex: 1,
    margin: 5,
    maxWidth: "45%",
  },
  selectedContainer: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  gradientButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 15,
  },
  confirmButtonContainer: {
    width: "50%",
    alignSelf: "center",
    marginTop: 24,
    borderRadius: 8,
    overflow: "hidden",
  },
  confirmButton: {
    padding: 14,
    alignItems: "center",
    borderRadius: 8,
  },
  confirmText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
