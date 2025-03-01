import React, { useState } from "react";
import { useTheme } from "./context/themeContext";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function Page() {

  const { theme } = useTheme(); //para cambiar el tema

  const router = useRouter();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { id: 1, text: "Hola, estoy en camino.", sender: "driver", time: "12:10" },
    { id: 2, text: "Perfecto, te espero en la entrada principal.", sender: "user", time: "12:11" },
    { id: 3, text: "Hay mucho tráfico, demoraré unos 5 minutos más.", sender: "driver", time: "12:15" },
    { id: 4, text: "No hay problema, tomate tu tiempo.", sender: "user", time: "12:16" },
  ]);

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: chatHistory.length + 1,
        text: message,
        sender: "user",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setChatHistory([...chatHistory, newMessage]);
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={[styles.container, { backgroundColor: theme === "dark" ? "#2d2c24" : "white" }]}
      >
        {/* Encabezado */}
        <View style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>Juan Pérez</Text>
            <Text style={styles.headerStatus}>En línea</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="videocam" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIcon}>
              <Ionicons name="call" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Mensajes */}
        <ScrollView style={styles.chatContainer} contentContainerStyle={styles.chatContent}>
          {chatHistory.map((item) => (
            <View
              key={item.id}
              style={[
                styles.messageBubble,
                item.sender === "user" ? styles.userMessage : styles.driverMessage,
              ]}
            >
              <Text style={styles.messageText}>{item.text}</Text>
              <Text style={styles.messageTime}>{item.time}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Barra de entrada de mensaje */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="happy" size={24} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Escribe un mensaje"
            value={message}
            onChangeText={setMessage}
            multiline
          />
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="attach" size={24} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!message.trim()}
          >
            <Ionicons name="send" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f0f0" },
  header: { backgroundColor: "#0088FF", flexDirection: "row", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16 },
  headerInfo: { flex: 1, marginLeft: 16 },
  headerName: { color: "white", fontSize: 18, fontWeight: "bold" },
  headerStatus: { color: "rgba(255, 255, 255, 0.7)", fontSize: 14 },
  headerIcons: { flexDirection: "row" },
  headerIcon: { marginLeft: 16 },
  chatContainer: { flex: 1 },
  chatContent: { padding: 16 },
  messageBubble: { borderRadius: 20, padding: 12, marginBottom: 8, maxWidth: "70%" },
  userMessage: { backgroundColor: "#0088FF", alignSelf: "flex-end", borderBottomRightRadius: 4 },
  driverMessage: { backgroundColor: "white", alignSelf: "flex-start", borderBottomLeftRadius: 4 },
  messageText: { fontSize: 16, color: "#333" },
  messageTime: { fontSize: 12, color: "#666", alignSelf: "flex-end", marginTop: 4 },
  inputContainer: { flexDirection: "row", alignItems: "center", padding: 8, backgroundColor: "white" },
  iconButton: { padding: 8 },
  input: { flex: 1, backgroundColor: "#f0f0f0", borderRadius: 20, padding: 8, maxHeight: 100 },
  sendButton: { backgroundColor: "#0088FF", width: 40, height: 40, borderRadius: 20, justifyContent: "center", alignItems: "center", marginLeft: 8 },
  sendButtonDisabled: { backgroundColor: "#c7c7c7" },
});
