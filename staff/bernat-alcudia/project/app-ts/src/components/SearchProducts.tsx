import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'



interface SearchProductProps {
    onSearch: (query: string) => void
}

function SearchProduct({ onSearch }: SearchProductProps) {
    const [text, setText] = useState('')
    const { t } = useLanguage()

    useEffect(() => {
        const timeout = setTimeout(() => onSearch(text.trim()), 250)
        return () => clearTimeout(timeout)
    }, [onSearch, text])

    const styles = StyleSheet.create({
        input: {
            flex: 1,
            paddingHorizontal: 14,
            paddingVertical: 8,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 10,
            height: 42,
            backgroundColor: '#fff',
        },
        view: {
            alignItems: 'center',
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'center',
            paddingHorizontal: 16,
        },
        clearButton: {
            marginLeft: 8,
            padding: 8,
        }
    })

    return (
        <View style={styles.view}>
            <TextInput
                onChangeText={setText}
                style={styles.input}
                placeholder={t('Search products')}
                placeholderTextColor='#64748b'
                value={text}
                returnKeyType='search'
                accessibilityLabel={t('Search products')}
            />
            {text.length > 0 && (
                <TouchableOpacity
                    style={styles.clearButton}
                    onPress={() => setText('')}
                    accessibilityRole='button'
                    accessibilityLabel={t('Clear search')}
                >
                    <MaterialCommunityIcons name='close-circle' size={22} color='#64748b' />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default SearchProduct
