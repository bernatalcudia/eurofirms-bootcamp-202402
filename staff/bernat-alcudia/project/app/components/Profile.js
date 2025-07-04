import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import logic from '../logic'



function Profile() {

    const navigation = useNavigation()

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#f5f5f5',
            padding: 16,
        },
        logoutSection: {
            marginTop: 20,
            alignItems: 'center',
        },
        actionButtonContainer: {
            marginTop: 15,
            width: '100%',
            alignItems: 'center',
        },
        actionButton: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            paddingVertical: 12,
            paddingHorizontal: 20,
            borderRadius: 8,
            borderColor: '#E0E0E0',
            borderWidth: 1,
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 1,
            },
            shadowOpacity: 0.18,
            shadowRadius: 1.00,
            elevation: 2,
            width: '90%',
            justifyContent: 'flex-start',
        },
        actionButtonText: {
            marginLeft: 15,
            fontSize: 16,
            fontWeight: '500',
            color: '#333333',
        },
        logoutButton: {
            backgroundColor: '#FFEBEE',
            borderColor: '#EF9A9A',
        },
        logoutButtonText: {
            marginLeft: 8,
            fontSize: 16,
            fontWeight: '600',
            color: '#D32F2F',
        },
    })


    const handleNavigateChangePassword = () => {
        navigation.navigate('ChangePassword')
    }


    const handleLogout = () => {
        logic.logoutUser()

        navigation.navigate('LoginUser')
    }




    return (
        <View style={styles.container}>
            <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                    onPress={handleNavigateChangePassword}
                    style={styles.actionButton}
                    accessibilityLabel='Change your account password'
                    accessibilityRole='button'
                >
                    <MaterialCommunityIcons name='lock-reset' size={24} color={'#424242'} />
                    <Text style={styles.actionButtonText}>Change Password</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.actionButtonContainer}>
                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.actionButton, styles.logoutButton]}
                    accessibilityLabel='Log out of your account'
                    accessibilityRole='button'
                >
                    <MaterialCommunityIcons name='logout' size={24} color={'#D32F2F'} />
                    <Text style={styles.logoutButtonText}>Log out</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Profile