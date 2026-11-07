import React from "react"
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native"
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
  return (
    <LanguageProvider>
      <ThemeProvider>
        <AppNavigation />
      </ThemeProvider>
    </LanguageProvider>
  )
}
