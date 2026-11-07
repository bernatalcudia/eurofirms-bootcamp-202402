import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createModifyProductStyles = (colors: ThemeColors) => StyleSheet.create({
    scrollView: { backgroundColor: colors.background },
    scrollViewContent: { paddingBottom: 30 },
    container: { flex: 1, padding: 15, backgroundColor: colors.surface },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginTop: 20, marginBottom: 15, borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: 5 },
    photoActionsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, borderWidth: 1.5, flex: 1, marginHorizontal: 5 },
    buttonPrimary: { backgroundColor: colors.primary, borderColor: colors.primary, marginTop: 30 },
    buttonOutline: { backgroundColor: colors.surface, borderColor: colors.primary },
    buttonIcon: { marginRight: 8 },
    buttonPrimaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    buttonOutlineText: { color: colors.primary, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    galleryPreview: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 },
    imageContainer: { position: 'relative', margin: 5 },
    imageThumbnail: { width: 60, height: 60, borderRadius: 8, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    deleteButton: { position: 'absolute', top: -8, right: -8, backgroundColor: colors.surface, borderRadius: 12, padding: 1 },
    deleteIconBackground: { backgroundColor: colors.surface, borderRadius: 12, overflow: 'hidden' },
    label: { fontSize: 14, color: colors.mutedText, marginBottom: 6, fontWeight: '600' },
    input: { backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 10, fontSize: 16, color: colors.text, marginBottom: 15 },
    textArea: { height: 100, textAlignVertical: 'top', paddingTop: 10 },
    radioGroupContainer: { marginBottom: 15, alignItems: 'flex-start' },
    radioLabel: { fontSize: 16, color: colors.text },
    disabledButton: { opacity: 0.65 },
})

export default createModifyProductStyles
