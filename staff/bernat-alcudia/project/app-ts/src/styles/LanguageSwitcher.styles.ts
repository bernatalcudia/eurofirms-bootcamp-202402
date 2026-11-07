import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createLanguageSwitcherStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        alignItems: 'center',
        alignSelf: 'stretch',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
        width: '100%',
    },
    compactContainer: { alignSelf: 'center', marginBottom: 0, marginRight: 8, width: 'auto' },
    label: { color: colors.text, fontSize: 14, fontWeight: '600' },
    options: { backgroundColor: colors.surfaceAlt, borderColor: colors.border, borderWidth: 1, borderRadius: 10, flexDirection: 'row', padding: 3 },
    option: { alignItems: 'center', borderRadius: 8, minHeight: 40, minWidth: 52, justifyContent: 'center', paddingHorizontal: 10 },
    compactOption: { minWidth: 36, paddingHorizontal: 8, minHeight: 36 },
    selectedOption: { backgroundColor: colors.primary },
    optionText: { color: colors.text, fontSize: 13, fontWeight: '700' },
    selectedText: { color: colors.onPrimary },
})

export default createLanguageSwitcherStyles
