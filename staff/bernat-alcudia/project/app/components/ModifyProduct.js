import { useMemo, useState, useEffect, } from 'react';
import logic from '../logic';
import { View, Image, StyleSheet, ScrollView, TextInput, Alert, Text, TouchableOpacity, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import RadioGroup from 'react-native-radio-buttons-group';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



const width = Dimensions.get('window')




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
            justifyContent: 'space-between',
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
        // view: {
        //     display: 'flex',
        //     flexDirection: 'column',
        //     gap: 5,
        //     alignItems: 'center',
        // },
        // input: {
        //     width: '80%',
        //     padding: 10,
        //     borderWidth: 1,
        //     borderColor: '#ccc',
        //     borderRadius: 5,
        // },
        // button: {
        //     width: '80%',
        //     padding: 15,
        //     backgroundColor: 'black',
        //     borderRadius: 5,
        // },
        // buttonText: {
        //     color: '#fff',
        //     fontSize: 16,
        //     alignSelf: 'center'
        // },
        // logo: {
        //     width: 66,
        //     height: 58,
        // },
        // radioButtons: {
        //     padding: 10
        // },

        // text: {
        //     alignSelf: 'flex-start',
        //     paddingLeft: 40
        // }
    })

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
                const { status: mediaLibraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
                    Alert.alert('Insufficient permissions', 'Permissions are required to access the camera and photo gallery.');
                }
            }
        })();
    }, []);

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
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchImageLibraryAsync({ allowsMultipleSelection: true, mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
            if (!result.canceled) {
                const base64Images = result.assets.map(asset => asset.base64)
                const newImages = images.slice()
                base64Images.forEach(image => newImages.push(image))
                setImages(newImages);
            }
        }
    };

    const takePicture = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status === 'granted') {
            const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
            if (!result.canceled) {
                const base64Images = result.assets.map(asset => asset.base64)
                const newImages = images.slice()
                base64Images.forEach(image => newImages.push(image))
                setImages(newImages);
            }
        }
    };

    const handleModifyProduct = () => {
        try {
            logic.modifyProduct(productId, images, title, description, brand, +price, selectedRadioButton.value, +stock)
                .then(() => {
                    alert('modified product')
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
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>

                    <Text style={styles.sectionTitle}>Photos</Text>
                    <View style={styles.photoActionsContainer}>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage}>
                            <MaterialCommunityIcons name='image-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon}></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} >Add from Gallery</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture}>
                            <MaterialCommunityIcons name='camera-plus' size={20} color={styles.buttonOutlineText.color} style={styles.buttonIcon}></MaterialCommunityIcons>
                            <Text style={styles.buttonOutlineText} >Take Picture</Text>
                        </TouchableOpacity>
                    </View>



                    <View style={styles.galleryPreview} >

                        {images?.map((image, index, images) => (
                            <View key={index} style={styles.imageContainer}>
                                <Image key={index} source={{ uri: 'data:image/png;base64,' + image }} style={styles.imageThumbnail} onError={(error) => console.error('Error loading image:', error)} />
                                <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteImage(image)}>
                                    <MaterialCommunityIcons name='close-circle' size={25} color={'black'} style={styles.deleteIconBackground} />
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>

                    <Text style={styles.sectionTitle}>Details</Text>

                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder='title' placeholderTextColor="#aaa" />

                    <Text style={styles.label} >Brand</Text>
                    <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder='brand' placeholderTextColor="#aaa" />

                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} placeholder='price' placeholderTextColor="#aaa" />

                    <Text style={styles.label}>State</Text>
                    <RadioGroup labelStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} />

                    <Text style={styles.label}>Stock</Text>
                    <TextInput style={styles.input} keyboardType='numeric' value={stock} onChangeText={setStock} placeholder='1' placeholderTextColor={'#aaa'} />

                    <Text style={styles.label}>Description</Text>
                    <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder='Describe your product' placeholderTextColor={'#aaa'} multiline={true} numberOfLines={4} />


                    <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleModifyProduct}>
                        <MaterialCommunityIcons name='content-save-edit-outline' size={20} color={styles.buttonPrimaryText.color} />
                        <Text style={styles.buttonPrimaryText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView >
        </>
    )
}

export default ModifyProduct