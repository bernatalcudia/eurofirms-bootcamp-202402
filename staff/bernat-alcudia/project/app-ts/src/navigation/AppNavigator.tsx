import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import ChangePassword from "../components/ChangePassword"
import CreateProduct from "../components/CreateProduct"
import ProductDetail from "../components/ProductDetail"
import ModifyProduct from "../components/ModifyProduct"
import RetrieveSavedProducts from "../components/RetrieveSavedProducts"
import MyTabs from "../components/MyTabs"
import Home from "../pages/Home"
import LoginUser from "../pages/LoginUser"
import RegisterUser from "../pages/RegisterUser"
import type { RootStackParamList } from "../types/navigation"
import { useLanguage } from "../i18n/LanguageContext"
import { useTheme } from "../theme/ThemeContext"

const Stack = createStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  const { t } = useLanguage()
  const { colors } = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="LoginUser"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="LoginUser" component={LoginUser} options={{ title: t('Login'), headerShown: false }} />
      <Stack.Screen name="RegisterUser" component={RegisterUser} options={{ title: t('Register') }} />
      <Stack.Screen name="Home" component={Home} options={{ title: t('Home') }} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} options={{ title: t('Change password') }} />
      <Stack.Screen
        name="tabs"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetail} options={{ title: t('Details') }} />
      <Stack.Screen name="ModifyProduct" component={ModifyProduct} options={{ title: t('Modify product') }} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} options={{ title: t('Create product') }} />
      <Stack.Screen
        name="RetrieveSavedProducts"
        component={RetrieveSavedProducts}
        options={{ title: t('Saved products') }}
      />
    </Stack.Navigator>
  )
}
