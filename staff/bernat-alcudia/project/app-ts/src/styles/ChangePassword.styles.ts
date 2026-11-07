import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createChangePasswordStyles = (colors: ThemeColors) => StyleSheet.create({
    view: { flexGrow: 1, padding: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background },
    card: { alignItems: 'center', backgroundColor: colors.surface, borderRadius: 16, maxWidth: 420, padding: 24, width: '100%' },
    input: { width: '100%', paddingHorizontal: 14, paddingVertical: 13, marginBottom: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 10, backgroundColor: colors.input, color: colors.text },
    button: { alignItems: 'center', justifyContent: 'center', width: '100%', minHeight: 48, padding: 12, backgroundColor: colors.primary, borderRadius: 10, marginTop: 8 },
    disabledButton: { opacity: 0.65 },
    buttonText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700', textAlign: 'center' },
})

export default createChangePasswordStyles
