// app/BottomNavBar.tsx
import React from "react";
import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useSegments } from "expo-router";

export default function BottomNavBar() {
  const router = useRouter();
  const segments = useSegments();

  // Hide the nav bar if we're at the root/register pages.
  if (segments.length === 0 || segments.includes("register")) {
    return null;
  }

  return (
    <View style={styles.navContainer}>
      <TouchableOpacity onPress={() => router.push("/historial")}>
        <Ionicons name="time-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/home")}>
        <Ionicons name="home-outline" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => router.push("/settings")}>
        <Ionicons name="settings-outline" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

const styles = {
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#e6e6e6",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 10,
  },
};
