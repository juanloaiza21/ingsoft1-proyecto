// app/_layout.tsx
import React from "react";
import { Slot, Stack } from "expo-router";
import { ThemeProvider } from "./context/themeContext"; // Importa el ThemeProvider
import BottomNavBar from "./BottomNavBar";

export default function Layout(): JSX.Element {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
    <Slot />
        </Stack>
        <BottomNavBar />
    </ThemeProvider>
  );
}