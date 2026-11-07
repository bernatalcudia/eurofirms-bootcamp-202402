import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createSearchProductsStyles = (colors: ThemeColors) => StyleSheet.create({
    input: {
        flex: 1,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        height: 42,
        backgroundColor: colors.input,
        color: colors.text,
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

export default createSearchProductsStyles
