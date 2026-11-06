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

const Stack = createStackNavigator<RootStackParamList>()

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="LoginUser">
      <Stack.Screen name="LoginUser" component={LoginUser} />
      <Stack.Screen name="RegisterUser" component={RegisterUser} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen
        name="tabs"
        component={MyTabs}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
      <Stack.Screen name="ModifyProduct" component={ModifyProduct} />
      <Stack.Screen name="CreateProduct" component={CreateProduct} />
      <Stack.Screen
        name="RetrieveSavedProducts"
        component={RetrieveSavedProducts}
      />
    </Stack.Navigator>
  )
}
