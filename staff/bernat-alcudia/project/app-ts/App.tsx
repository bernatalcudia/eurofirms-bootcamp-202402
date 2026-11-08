import React from "react"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
import { useFonts } from "expo-font"
import { StatusBar } from "expo-status-bar"
import AppNavigator from "./src/navigation/AppNavigator"
import { LanguageProvider } from "./src/i18n/LanguageContext"
import { ThemeProvider, useTheme } from "./src/theme/ThemeContext"
import { getStatusBarStyle } from "./src/styles/Navigation.styles"

function AppNavigation() {
  const { theme, colors } = useTheme()
  const baseTheme = theme === 'dark' ? DarkTheme : DefaultTheme
  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.accent,
    },
  }

  return (
    <NavigationContainer theme={navigationTheme}>
      <AppNavigator />
      <StatusBar style={getStatusBarStyle(theme)} />
    </NavigationContainer>
  )
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    MaterialCommunityIcons: require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
    "Material Design Icons": require("react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf"),
  })
  if (!fontsLoaded && !fontError) return null

  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </LanguageProvider>
  )
}
