import type { CompositeNavigationProp, RouteProp } from "@react-navigation/native"
import type { BottomTabNavigationProp } from "@react-navigation/bottom-tabs"
import type { StackNavigationProp } from "@react-navigation/stack"

export type RootStackParamList = {
  LoginUser: undefined
  RegisterUser: undefined
  Home: undefined
  ChangePassword: undefined
  tabs: undefined
  ProductDetail: { id: string }
  ModifyProduct: { id: string }
  CreateProduct: undefined
  RetrieveSavedProducts: undefined
  ChatConversation: { chatId: string }
  UserProfile: { userId: string }
}

export type MainTabParamList = {
  Home: undefined
  CreateProduct: undefined
  RetrieveSavedProducts: undefined
  Profile: undefined
  Messages: undefined
}

export type RootNavigation = StackNavigationProp<RootStackParamList>
export type ProductRoute = RouteProp<RootStackParamList, "ProductDetail" | "ModifyProduct">
export type ChatConversationRoute = RouteProp<RootStackParamList, "ChatConversation">
export type UserProfileRoute = RouteProp<RootStackParamList, "UserProfile">
export type TabNavigation = CompositeNavigationProp<
  BottomTabNavigationProp<MainTabParamList>,
  StackNavigationProp<RootStackParamList>
>
