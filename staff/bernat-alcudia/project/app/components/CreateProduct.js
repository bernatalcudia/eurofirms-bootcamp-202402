import React, { useMemo, useState, useEffect } from 'react';
import logic from '../logic';
import { View, Image, StyleSheet, ScrollView, Button, TextInput, Alert, Text, TouchableOpacity, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';
import RadioGroup from 'react-native-radio-buttons-group';
import * as ImagePicker from 'expo-image-picker';


const { width } = Dimensions.get('window')

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
    // galleryPreview: {
    //     display: 'flex',
    //     flexDirection: 'row',
    //     justifyContent: 'flex-start',
    //     alignItems: 'flex-start',
    //     maxWidth: '70%',
    //     flexWrap: 'wrap'
    // },
    // text: {
    //     alignSelf: 'flex-start',
    //     paddingLeft: 40
    // }
})

function CreateProduct({ }) {
    const [images, setImages] = useState([])
    const [title, setTitle] = useState(null)
    const [description, setDescription] = useState(null)
    const [brand, setBrand] = useState(null)
    const [price, setPrice] = useState(null)
    const [state, setState] = useState(null)
    const [stock, setStock] = useState(null)

    const [selectedId, setSelectedId] = useState('1');

    const navigation = useNavigation()

    const radioButtons = useMemo(() => ([
        {
            id: '1',
            label: 'new',
            value: 'new',
            selected: true
        },
        {
            id: '2',
            label: 'used',
            value: 'used',
            selected: false
        }
    ]), []);

    const selectedRadioButton = radioButtons.find(button => button.id === selectedId)



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

    const handleCreateProduct = () => {
        try {
            logic.createProduct(images, title, description, brand, +price, selectedRadioButton.value, +stock)
                .then(() => {
                    alert('created product')
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
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollViewContent}>
            <View style={styles.container}>


                <Text style={styles.sectionTitle}>Photos</Text>
                <View style={styles.photoActionsContainer}>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={selectImage}>
                        <Text style={styles.buttonOutlineText} >Upload photos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.buttonOutline]} onPress={takePicture}>
                        <Text style={styles.buttonOutlineText} >Take Picture</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.galleryPreview}>
                    {images.length > 0 ? images.map((image, index) => (
                        <View key={index} style={styles.imageContainer}>
                            <Image style={styles.imageThumbnail} source={{ uri: 'data:image/png;base64,' + image }}></Image>
                            <TouchableOpacity onPress={() => handleDeleteImage(image)}>
                                <MaterialCommunityIcons name='close-circle' size={25} style={styles.deleteIconBackground} />
                            </TouchableOpacity>
                        </View>
                    ))
                        :
                        <View style={styles.placeholderContainer}>
                            <Image style={styles.placeholderImage} source={{ uri: 'https://fakeimg.pl/200x200/cccccc/d61a1a?font=bebas' }}></Image>
                            <Text style={styles.placeholderText}>Add up to 10 photos</Text>
                        </View>
                    }
                </View>


                <Text style={styles.label}>Title</Text>
                <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder='Blue Summer Dress' placeholderTextColor={'#aaa'} />

                <Text style={styles.label}>Brand</Text>
                <TextInput style={styles.input} value={brand} onChangeText={setBrand} placeholder='Zara,H&M,None' placeholderTextColor={'#aaa'} />

                <Text style={styles.label}>Price</Text>
                <TextInput style={styles.input} keyboardType='numeric' value={price} onChangeText={setPrice} placeholder='price' placeholderTextColor={'#aaa'} />

                <Text style={styles.label}>State</Text>
                <RadioGroup containerStyle={styles.radioGroupContainer} layout='row' radioButtons={radioButtons} onPress={setSelectedId} selectedId={selectedId} />

                <Text style={styles.label}>Stock</Text>
                <TextInput style={styles.input} keyboardType='numeric' value={stock} onChangeText={setStock} placeholder='1' placeholderTextColor={'#aaa'} />

                <Text style={styles.label}>Description</Text>
                <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} placeholder='Describe your product' placeholderTextColor={'#aaa'} multiline={true} numberOfLines={4} />

                <TouchableOpacity style={[styles.button, styles.buttonPrimary, styles.submitButton]} onPress={handleCreateProduct}>
                    <Text style={styles.buttonPrimaryText}>Create</Text>
                </TouchableOpacity>
            </View>
        </ScrollView >
    )
}

export default CreateProduct