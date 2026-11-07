import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'
import { errors } from 'com'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../pages/Home';
import CreateProduct from './CreateProduct';
import RetrieveSavedProducts from './RetrieveSavedProducts';
import SearchProduct from './SearchProducts';
import Profile from './Profile';
import React, { useCallback, useState, useEffect } from 'react';
import logic from '../logic';
import type { MainTabParamList, RootNavigation } from '../types/navigation'
import type { User } from '../types/models'
import { useLanguage } from '../i18n/LanguageContext'
import { useTheme } from '../theme/ThemeContext'

const Tab = createBottomTabNavigator<MainTabParamList>()

function MyTabs() {
    const [, setUser] = useState<User>()
    const [searchQuery, setSearchQuery] = useState('')
    const navigation = useNavigation<RootNavigation>()
    const { t } = useLanguage()
    const { colors } = useTheme()

    useEffect(() => {
        try {
            if (!logic.isUserLoggedIn()) {
                navigation.navigate('LoginUser')
                return
            }
            logic.retrieveUser() //Return Users
                .then(user => setUser(user))
                .catch(error => {
                    console.error(error)
                    alert(error instanceof errors.ValidationError
                        ? t('Please correct the highlighted information and try again.')
                        : t('Something went wrong. Please try again.'))
                })

        } catch (error) {
            console.error(error)
            alert(error instanceof errors.ValidationError
                ? t('Please correct the highlighted information and try again.')
                : t('Something went wrong. Please try again.'))
        }
    }, [])

    const handleSearch = useCallback((searchQuery: string) => {
        setSearchQuery(searchQuery)
    }, [])

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: colors.primary, tabBarInactiveTintColor: colors.mutedText, tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60, paddingBottom: 5, paddingTop: 5,
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                },
            }}

        >
            <Tab.Screen name='Home' children={() => <Home searchQuery={searchQuery} />}
                options={{
                    headerStyle: {
                        height: 100,
                        backgroundColor: colors.surface,
                    }, headerTitleAlign: 'center',
                    headerTitle: () => <SearchProduct onSearch={handleSearch} />, tabBarLabel: t('Home'), tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='home' color={color} size={size} />), tabBarAccessibilityLabel: t('Home tab, displays your main feed'),
                    headerTintColor: colors.text,
                }}></Tab.Screen>
            <Tab.Screen name='CreateProduct' component={CreateProduct} options={{
                title: t('Create product'), headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, tabBarLabel: t('Create product'), tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='plus-circle-outline' color={color} size={size} />), tabBarAccessibilityLabel: t('Create product tab'),
            }}></Tab.Screen>

            <Tab.Screen name='RetrieveSavedProducts' component={RetrieveSavedProducts} options={{
                title: t('Saved products'), headerStyle: { backgroundColor: colors.surface }, headerTintColor: colors.text, tabBarLabel: t('Saved'), tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='bookmark-multiple' color={color} size={size} />), tabBarAccessibilityLabel: t('Saved products tab'),
            }}></Tab.Screen>

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarLabel: t('Profile'),
                    tabBarAccessibilityLabel: t('Profile and account settings tab'),
                    headerTitle: t('My profile'),
                    headerStyle: { backgroundColor: colors.surface },
                    headerTintColor: colors.text,
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='account-circle' color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
}

export default MyTabs