import { useColorScheme as useNativeWindColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useColorScheme } from "react-native";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";
import { Colors } from "../constants/Colors";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  isDark: boolean;
  toggleTheme: () => void;
  setThemeMode: (mode: ThemeMode) => void;
  theme: typeof MD3LightTheme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useAppTheme must be used within a ThemeProvider");
  }
  return context;
};

// Custom light theme colors
const customLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: Colors.light.primary,
    secondary: Colors.light.secondary,
    background: Colors.light.background,
    surface: Colors.light.backgroundMuted,
  },
};

// Custom dark theme colors
const customDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: Colors.dark.primary,
    secondary: Colors.dark.secondary,
    background: Colors.dark.background,
    surface: Colors.dark.backgroundMuted,
    onSurface: Colors.dark.text,
    surfaceVariant: Colors.dark.outline,
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const systemColorScheme = useColorScheme();
  const { colorScheme: nwColorScheme, setColorScheme: setNWColorScheme } =
    useNativeWindColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");

  const isDark =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";
  const theme = isDark ? customDarkTheme : customLightTheme;

  useEffect(() => {
    // Sync NativeWind color scheme
    setNWColorScheme(isDark ? "dark" : "light");
  }, [isDark]);

  const toggleTheme = useCallback(() => {
    setThemeModeState(isDark ? "light" : "dark");
  }, [isDark]);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDark,
        toggleTheme,
        setThemeMode,
        theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
