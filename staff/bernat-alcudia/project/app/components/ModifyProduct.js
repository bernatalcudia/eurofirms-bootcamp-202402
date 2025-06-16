import { useMemo, useState, useEffect, } from 'react';
import logic from '../logic';
import { View, Image, StyleSheet, ScrollView, TextInput, Alert, Text, TouchableOpacity, Platform, Linking } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';







function ModifyProduct() {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [brand, setBrand] = useState('')
    const [state, setState] = useState(null)
    const [price, setPrice] = useState(0)
    const [stock, setStock] = useState('')

    const [selectedId, setSelectedId] = useState('');

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'new',
            value: 'new',
            selected: false
        },
        {
            id: '2',
            label: 'used',
            value: 'used',
            selected: false
        }
    ]), []);

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)

    const isSelected = radioButtons.selected


    const route = useRoute()

    const { id: productId } = route.params

    const navigation = useNavigation()


    const styles = StyleSheet.create({

        scrollView: {
            backgroundColor: '#f8f8f8',
        },
        scrollViewContent: {
            paddingBottom: 30,
        },
        container: {
            flex: 1,
            padding: 15,
            backgroundColor: '#ffffff'
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: '#333',
            marginTop: 20,
            marginBottom: 15,
            borderBottomWidth: 1,
            borderBottomColor: '#eee',
            paddingBottom: 5,
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
            marginTop: 30,
        },
        buttonOutline: {
            backgroundColor: '#fff',
            borderColor: '#09B1BA'
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
            borderColor: '#ddd',
        },
        deleteButton: {
            position: 'absolute',
            top: -8,
            right: -8,
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 1,
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
            paddingVertical: 10,
            fontSize: 16,
            color: '#333',
            marginBottom: 15,
        },
        textArea: {
            height: 100,
            textAlignVertical: 'top',
            paddingTop: 10,
        },
        radioGroupContainer: {
            marginBottom: 15,
            alignItems: 'flex-start',
        },
        radioLabel: {
            fontSize: 16,
            color: '#333'
        },
    })

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

    const showProductDetails = () => {
        try {
            logic.retrieveProductDetails(productId)
                .then(product => {
                    setImages(product.images)
                    setTitle(product.title)
                    setDescription(product.description)
                    setBrand(product.brand)
                    setPrice(product.price.toString())
                    setState(product.state)
                    product.state === 'new' ? setSelectedId('1') : setSelectedId('2')

                    setStock(product.stock.toString())
                })
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }


    useEffect(() => {
        showProductDetails()
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


    const handleModifyProduct = () => {
        try {
            logic.modifyProduct(productId, images, title, description, brand, +price, selectedRadioButton.value, +stock)
                .then(() => {
                    alert('Product modified successfully!')
                    navigation.navigate('tabs')
                })
                .catch(error => {
                    console.error(error)

                    alert(error.message)
                })
        } catch (error) {
            console.error(error)

            alert(error.message)
        }
    }

    const handleDeleteImage = urlImage => {
        const newImages = images.filter(image => image !== urlImage)
        setImages(newImages);
    }

    return (
        <>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent} accessibilityLabel='Modify Product Scroll View' accessible={true}>
                <View style={styles.container} accessibilityRole='header'>

                    <Text style={styles.sectionTitle}>Photos</Text>
                    <View style={styles.photoActionsContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage} accessibilityLabel='Add photos from gallery' accessibilityHint='Tap to open your photo gallery and select images to add'>
                            <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true}></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} accessibilityRole='button' >Add from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture} accessibilityLabel='Take a new picture' accessibilityHint='Tap to open your camera and take a new photo'>
                            <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon} accessibilityElementsHidden={true} ></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} accessibilityRole='button' >Take Picture</Text>
                        </TouchableOpacity>
                    </View>



                    <View style={styles.galleryPreview} accessibilityLabel='Product images preview' >

                        {images?.map((image, index, images) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.imageThumbnail} onError={(error) => console.error('Error loading image:', error)} accessibilityLabel={`Product image ${index + 1}`} accessibilityHint='Displays a preview of an image for the product.' />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(image)} accessibilityLabel={`Delete image ${index + 1}`} accessibilityHint='Tap to remove this image from the product.'>
                                    <MaterialCommunityIcons name='close-circle' size={25} color={'black'} style={styles.deleteIconBackground} accessibilityElementsHidden={true} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle} accessibilityRole='header'>Details</Text>

                    <Text style={styles.label} accessibilityLabel='Product title'>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder='title' placeholderTextColor='#aaa' accessibilityLabel='Product title input' accessibilityHint='Enter the title of your product' />

                    <Text style={styles.label} accessibilityLabel='Product brand' >Brand</Text>
                    <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder='brand' placeholderTextColor='#aaa' accessibilityLabel='Product brand input' accessibilityHint='Enter the brand of your product' />

                    <Text style={styles.label} accessibilityLabel='Product price'>Price</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} placeholder='price' placeholderTextColor='#aaa' accessibilityLabel='Product price input' accessibilityHint='Enter the price of your product' />

                    <Text style={styles.label} accessibilityLabel='Product state'>State</Text>
                    <RadioGroup labelStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} accessibilityLabel='Product state selection' accessibilityHint='Choose whether the product is new or used' />

                    <Text style={styles.label} accessibilityLabel='Product stock'>Stock</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={stock} onChangeText={setStock} placeholder='1' placeholderTextColor={'#aaa'} accessibilityLabel='Product stock input' accessibilityHint='Enter the available stock quantity' />

                    <Text style={styles.label} accessibilityLabel='Product description'>Description</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder='Describe your product' placeholderTextColor={'#aaa'} multiline={true} numberOfLines={4} accessibilityLabel='Product description input' accessibilityHint='Provide a detailed description of your product' />


                    <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleModifyProduct} accessibilityLabel='Save product changes' accessibilityHint='Tap to save all modification to the product details'>
                        <MaterialCommunityIcons name='content-save-edit-outline' size={20} color={styles.buttonPrimaryText.color} accessibilityElementsHidden={true} />
                        <Text style={styles.buttonPrimaryText} accessibilityRole='button'>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </>
    )
}

export default ModifyProduct