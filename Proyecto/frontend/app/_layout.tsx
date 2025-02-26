// app/_layout.tsx
import React from "react";
import { Stack } from "expo-router";
import { ThemeProvider } from "./context/themeContext"; // Importa el ThemeProvider

export default function Layout(): JSX.Element {
  return (
    <ThemeProvider>
      <Stack
        screenOptions={{
          headerShown: false, // Puedes configurar opciones globales aquí
        }}
      />
    </ThemeProvider>
  );
}
