// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';

export default function Layout(): JSX.Element {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // Puedes configurar opciones globales aquí
      }}
    />
  );
}