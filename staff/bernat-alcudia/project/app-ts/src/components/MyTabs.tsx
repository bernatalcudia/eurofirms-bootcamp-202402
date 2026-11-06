import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native'
import { ContentError } from '../com/errors'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Home from '../pages/Home';
import CreateProduct from './CreateProduct';
import RetrieveSavedProducts from './RetrieveSavedProducts';
import SearchProduct from './SearchProducts';
import Profile from './Profile';
import React, { useState, useEffect } from 'react';
import logic from '../logic';
import type { MainTabParamList, RootNavigation } from '../types/navigation'
import type { User } from '../types/models'

const Tab = createBottomTabNavigator<MainTabParamList>()

function MyTabs() {
    const [, setUser] = useState<User>()
    const [searchQuery, setSearchQuery] = useState('')
    const navigation = useNavigation<RootNavigation>()

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
                    let feedback = error instanceof Error ? error.message : 'Unexpected error'

                    if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                        feedback = `${feedback}, please correct it`
                    else
                        feedback = 'sorry,there was an error,please try again later'

                    alert(feedback)
                })

        } catch (error) {
            console.error(error)
            let feedback = error instanceof Error ? error.message : 'Unexpected error'

            if (error instanceof TypeError || error instanceof RangeError || error instanceof ContentError)
                feedback = `${feedback}, please correct it`
            else
                feedback = 'sorry,there was an error,please try again later'

            alert(feedback)
        }
    }, [])

    const handleSearch = (searchQuery: string) => {
        setSearchQuery(searchQuery)
    }

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarActiveTintColor: 'black', tabBarInactiveTintColor: 'grey', tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60, paddingBottom: 5, paddingTop: 5,
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
                    }, headerTitleAlign: 'center',
                    headerTitle: () => <SearchProduct onSearch={handleSearch} />, tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='home' color={color} size={size} />), tabBarAccessibilityLabel: 'Home tab, displays your main feed',
                }}></Tab.Screen>
            {logic.getLoggedInUserRole() === 'seller' && <Tab.Screen name='CreateProduct' component={CreateProduct} options={{
                tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='plus-circle-outline' color={color} size={size} />), tabBarAccessibilityLabel: 'Create Product tab, navigate to add a new product',
            }}></Tab.Screen>}

            <Tab.Screen name='RetrieveSavedProducts' component={RetrieveSavedProducts} options={{
                tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name='bookmark-multiple' color={color} size={size} />), tabBarAccessibilityLabel: 'Saved Products tab, view your saved items',
            }}></Tab.Screen>

            <Tab.Screen
                name='Profile'
                component={Profile}
                options={{
                    tabBarLabel: 'Profile',
                    tabBarAccessibilityLabel: 'Profile tab, access your account settings and logout',
                    headerTitle: 'My Profile',
                    tabBarIcon: ({ color, size }) => (
                        <MaterialCommunityIcons name='account-circle' color={color} size={size} />
                    ),
                }}
            />
        </Tab.Navigator >

        //TODO add messages tab and profile tab
    );
}

export default MyTabs