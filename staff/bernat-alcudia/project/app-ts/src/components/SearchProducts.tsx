import { View, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '../theme/ThemeContext'
import createSearchProductsStyles from '../styles/SearchProducts.styles'

interface SearchProductProps {
    onSearch: (query: string) => void
}

function SearchProduct({ onSearch }: SearchProductProps) {
    const [text, setText] = useState('')
    const { t } = useLanguage()
    const { colors } = useTheme()

    useEffect(() => {
        const timeout = setTimeout(() => onSearch(text.trim()), 250)
        return () => clearTimeout(timeout)
    }, [onSearch, text])

    const styles = createSearchProductsStyles(colors)

    return (
        <View style={styles.view}>
            <TextInput
                onChangeText={setText}
                style={styles.input}
                placeholder={t('Search products')}
                placeholderTextColor={colors.mutedText}
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
                    <MaterialCommunityIcons name='close-circle' size={22} color={colors.mutedText} />
                </TouchableOpacity>
            )}
        </View>
    )
}

export default SearchProduct
