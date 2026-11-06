import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { StatusBar } from "expo-status-bar"
import AppNavigator from "./src/navigation/AppNavigator"
import { LanguageProvider } from "./src/i18n/LanguageContext"

export default function App() {
  return (
    <LanguageProvider>
      <NavigationContainer>
        <AppNavigator />
        <StatusBar style="auto" />
      </NavigationContainer>
    </LanguageProvider>
  )
}
