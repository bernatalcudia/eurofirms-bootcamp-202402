import React, { useMemo, useState, useEffect } from 'react'
import logic from '../logic'
import { View, Image, StyleSheet, ScrollView, TextInput, Alert, Text, TouchableOpacity, Platform, Linking } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useNavigation } from '@react-navigation/native'
import RadioGroup from 'react-native-radio-buttons-group'
import * as ImagePicker from 'expo-image-picker'



const styles = StyleSheet.create({
    scrollView: {
        backgroundColor: '#f8f8f8'
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: '#ffffff',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 20,
        marginBottom: 15,
    },
    photoActionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        borderWidth: 1.5,
        flex: 1,
        marginHorizontal: 5,
    },
    buttonPrimary: {
        backgroundColor: '#09B1BA',
        borderColor: '#09B1BA',
    },
    buttonOutline: {
        backgroundColor: '#fff',
        borderColor: '#09B1BA',
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonPrimaryText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonOutlineText: {
        color: '#09B1BA',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    galleryPreview: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
        justifyContent: 'flex-start',
    },
    placeholderContainer: {
        width: '100%',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 20,
        paddingVertical: 20,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        backgroundColor: '#f9f9f9'
    },
    placeholderImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        opacity: 0.7,
    },
    placeholderText: {
        color: '#777',
        fontSize: 14,
    },
    imageContainer: {
        position: 'relative',
        margin: 5,
    },
    imageThumbnail: {
        width: 60,
        height: 60,
        borderRadius: 8,
        backgroundColor: '#eee',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        borderRadius: 12,
    },
    deleteIconBackground: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
    },
    label: {
        fontSize: 14,
        color: '#555',
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: '#333',
        marginBottom: 15,
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
        paddingTop: 12,
    },
    radioGroupContainer: {
        marginBottom: 15,
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10,
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    submitButton: {
        marginTop: 30,
        marginHorizontal: 0,
        width: '100%'
    },
})

function CreateProduct({ }) {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [brand, setBrand] = useState(null)
    const [price, setPrice] = useState(null)
    const [state, setState] = useState(null)
    const [stock, setStock] = useState(null)

    const [selectedId, setSelectedId] = useState('1')

    const navigation = useNavigation()

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'new',
            value: 'new',
            selected: true,
            accessibilityLabel: 'New Condition'
        },
        {
            id: '2',
            label: 'used',
            value: 'used',
            selected: false,
            accessibilityLabel: 'Used condition'
        }
    ]), [])

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)



    useEffect(() => {
        const requestPermissions = async () => {
            try {
                if (Platform.OS !== 'web') {
                    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync()

                    const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync()

                    if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
                        Alert.alert(
                            'Permissions Required',
                            'To use this feature, please grant access to your camera and photo library.',
                            [
                                {
                                    text: 'Cancel',
                                    style: 'cancel'
                                },
                                {
                                    text: 'Open Settings',
                                    onPress: () => Linking.openSettings()
                                }
                            ],
                            { cancelable: false }
                        )
                    }
                }
            } catch (error) {
                console.error('Error requesting permissions:', error)
                Alert.alert(
                    'Error',
                    'Failed to request necessary permissions. Please try again later.'
                )
            }
        }

        requestPermissions()
    }, [])

    const selectImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Please grant access to you media library to select image')
                return
            }

            const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true })
            if (result.canceled) {
                console.log('Image selection cancelled')

            }
            if (result.assets && result.assets.length > 0) {
                const base64Images = result.assets.map(asset => asset.base64)
                setImages(prevImages => [...prevImages, ...base64Images])
            } else {
                Alert.alert('No Images Selected', 'It seems no images were picked. Please try again.')
            }
        } catch (error) {
            console.error('Error selecting image', error)
            Alert.alert('Error', 'Failed to select images.Please try again later')
        }
    }

    const takePicture = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync()

            if (status !== 'granted') {
                Alert.alert(
                    'Permission Denied',
                    'Please grant camera access to take pictures.'
                )
                return
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                base64: true,
            })

            if (result.canceled) {
                console.log('Camera operation cancelled.')
                return
            }

            if (result.assets && result.assets.length > 0) {
                const base64Images = result.assets.map(asset => asset.base64)
                setImages(prevImages => [...prevImages, ...base64Images])
            } else {
                Alert.alert('No Picture Taken', 'It seems no picture was taken. Please try again.')
            }

        } catch (error) {
            console.error('Error taking picture:', error)
            Alert.alert(
                'Error',
                'Failed to take a picture. Please try again later.'
            )
        }
    }

    const handleCreateProduct = () => {
        try {
            logic.createProduct(images, title, description, brand, +price, selectedRadioButton.value, +stock)
                .then(() => {
                    Alert.alert('Success', 'Product created successfully!')
                    setImages('')
                    setTitle('')
                    setDescription('')
                    setBrand('')
                    setPrice('')
                    setSelectedId('1')
                    setStock('')
                    navigation.navigate('Home')
                })
                .catch(error => {
                    console.error(error)

                    Alert.alert('Error', error.message)
                })
        } catch (error) {
            console.error(error)

            Alert.alert('Error', error.message)
        }
    }


    const handleDeleteImage = urlImage => {
        const newImages = images.filter(image => image !== urlImage)
        setImages(newImages)
    }


    return (
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>


                <Text style={styles.sectionTitle} accessibilityRole='header'>Photos</Text>
                <View style={styles.photoActionsContainer}>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage} accessibilityHint='Button to insert images with phone storage' accessibilityLabel='Upload photos from gallery' accessible={true} >
                        <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} aria-hidden='true' ></MaterialCommunityIcons>
                        <Text style={styles.buttonOutlineText}  >Upload photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture} accessibilityLabel='Take a new photo' accessibilityHint='Opens your phones camera to take a picture' accessible={true}>
                        <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} aria-hidden='true'></MaterialCommunityIcons>
                        <Text style={styles.buttonOutlineText} >Take Picture</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.galleryPreview} accessibilityLabel='Selected images preview'>
                    {images.length > 0 ? images.map((image, index) => (
                        <View key={index} style={styles.imageContainer} accessible={true} accessibilityLabel={`Product image ${index + 1}`}>
                            <Image style={styles.imageThumbnail} source={{ uri: 'data:image/png;base64,' + image }} accessibilityLabel={`Thumbnail of product image ${index + 1}`} ></Image>
                            <TouchableOpacity onPress={() => handleDeleteImage(image)} accessibilityLabel={`Remove image ${index + 1}`} accessibilityHint='Deletes this product image' accessible={true}>
                                <MaterialCommunityIcons name='close-circle' size={25} style={styles.deleteIconBackground} accessibilityHint='icon close-circle' accessible={true} />
                            </TouchableOpacity>
                        </View>
                    ))
                        :
                        <View style={styles.placeholderContainer} accessibilityLabel='No images selected yet'>
                            <Image style={styles.placeholderImage} source={{ uri: 'https://fakeimg.pl/200x200/cccccc/d61a1a?font=bebas' }} accessibilityLabel='Placeholder image for product photos'></Image>
                            <Text style={styles.placeholderText}>Add up to 10 photos</Text>
                        </View>
                    }
                </View>


                <Text style={styles.label} nativeID='titleLabel'>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder='Blue Summer Dress' placeholderTextColor={'#aaa'} accessibilityLabel='Product title input' accessibilityHint='Enter the title of your product' />

                <Text style={styles.label}>Brand</Text>
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder='Zara,H&M,Celio' placeholderTextColor={'#aaa'} accessibilityLabel='Product brand input' accessibilityHint='Enter the brand of your product.  For example, Zara or H&M.' />

                <Text style={styles.label}>Price</Text>
                <TextInput style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} placeholder='price' placeholderTextColor={'#aaa'} accessibilityLabel='Product price input' accessibilityHint='Enter the price of your product in numbers' />

                <Text style={styles.label}>State</Text>
                <RadioGroup containerStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} accessibilityLabel='Product condition radio buttons' accessibilityHint='Select whether the product is new or used' />

                <Text style={styles.label}>Stock</Text>
                <TextInput style={styles.input} keyboardType='numeric' value={stock} onChangeText={setStock} placeholder='3' placeholderTextColor={'#aaa'} accessibilityLabel='Product stock input' accessibilityHint='Enter the number of items available in stock' />

                <Text style={styles.label}>Description</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder='Describe your product' placeholderTextColor={'#aaa'} multiline={true} numberOfLines={4} accessibilityLabel='Product description input' accessibilityHint='Provide a detailed description of your product, including features, condition, and any relevant information.' />

                <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton]} onPress={handleCreateProduct} accessibilityLabel='Create product button' accessibilityHint='Tap to save and create your product listing' accessible={true}>
                    <Text style={styles.buttonPrimaryText}>Create</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    )
}

export default CreateProduct