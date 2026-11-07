import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

export const getPaletteSwatchStyle = (color: string) => ({ backgroundColor: color })

const createProfileStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flexGrow: 1, backgroundColor: colors.background, padding: 20, alignItems: 'center' },
    content: { width: '100%', maxWidth: 520 },
    subtitle: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginBottom: 24 },
    sectionTitle: { color: colors.mutedText, fontSize: 13, fontWeight: '700', marginBottom: 8, marginTop: 16, textTransform: 'uppercase' },
    card: { backgroundColor: colors.surface, borderRadius: 16, borderColor: colors.border, borderWidth: 1, overflow: 'hidden' },
    disclosure: { flexDirection: 'row', alignItems: 'center', minHeight: 58, paddingHorizontal: 16 },
    disclosureWithTopBorder: { borderTopWidth: 1, borderTopColor: colors.border },
    disclosureIcon: { marginRight: 12 },
    disclosureText: { flex: 1, color: colors.text, fontSize: 16, fontWeight: '600' },
    disclosureValue: { color: colors.mutedText, marginRight: 8 },
    disclosureContent: { borderTopWidth: 1, borderTopColor: colors.border, padding: 16 },
    hint: { color: colors.mutedText, fontSize: 14, lineHeight: 20, marginTop: 12 },
    action: { flexDirection: 'row', alignItems: 'center', minHeight: 56, paddingHorizontal: 16, borderTopWidth: 1, borderTopColor: colors.border },
    actionText: { color: colors.text, fontSize: 16, fontWeight: '600', marginLeft: 12 },
    logoutText: { color: colors.danger },
    themeOptions: { gap: 8 },
    themeOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderWidth: 1, borderColor: colors.border, borderRadius: 12 },
    selectedTheme: { backgroundColor: colors.surfaceAlt, borderColor: colors.primary },
    themeOptionContent: { flex: 1 },
    themeName: { flex: 1, color: colors.text, fontSize: 15, fontWeight: '700' },
    themeDescription: { color: colors.mutedText, fontSize: 13, marginTop: 3 },
    palettePreview: { flexDirection: 'row', gap: 6, marginTop: 8 },
    paletteSwatch: { width: 14, height: 14, borderRadius: 7, borderWidth: 1, borderColor: colors.border },
})

export default createProfileStyles
