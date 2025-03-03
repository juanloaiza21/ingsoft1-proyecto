// app/_layout.tsx
import React from "react";
import { Stack, Slot } from "expo-router";
import { ThemeProvider } from "./context/themeContext";
import BottomNavBar from "./BottomNavBar";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from 'expo-status-bar';

export default function Layout(): JSX.Element {
  return (
    <ThemeProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#024059" }}>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "#F0F0F0" },
          }}
        >
          <Slot />
        </Stack>
        <BottomNavBar />
      </SafeAreaView>
      <StatusBar style="light" backgroundColor="#024059" />
    </ThemeProvider>
  );
}