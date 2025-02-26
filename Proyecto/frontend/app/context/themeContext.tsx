import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Definir el tipo de las props del proveedor
interface ThemeProviderProps {
  children: ReactNode;
}

// 1. Crear el contexto con la firma correcta de toggleTheme
const ThemeContext = createContext<{
  theme: string;
  toggleTheme: (newTheme: string) => Promise<void>;
}>({
  theme: "light",
  toggleTheme: async () => {},
});

// 2. Crear el proveedor del contexto
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const loadTheme = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setTheme(storedTheme);
      }
    };
    loadTheme();
  }, []);

  const toggleTheme = async (newTheme: string) => {
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personalizado para usar el contexto
export const useTheme = () => useContext(ThemeContext);
