import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createCreateProductStyles = (colors: ThemeColors) => StyleSheet.create({
    scrollView: { backgroundColor: colors.background },
    scrollViewContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
    container: { alignSelf: 'center', width: '100%', maxWidth: 720, paddingHorizontal: 22, paddingVertical: 24, backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2 },
    pageTitle: { fontSize: 26, lineHeight: 34, fontWeight: '800', color: colors.text },
    introText: { color: colors.mutedText, fontSize: 15, lineHeight: 22, marginTop: 5, marginBottom: 12 },
    formError: { color: colors.danger, backgroundColor: colors.surfaceAlt, borderColor: colors.danger, borderWidth: 1, borderRadius: 10, padding: 12, fontSize: 14, lineHeight: 20, marginBottom: 12 },
    sectionTitle: { fontSize: 19, fontWeight: '700', color: colors.text, marginTop: 18, marginBottom: 5 },
    helperText: { color: colors.mutedText, fontSize: 13, lineHeight: 19, marginBottom: 12 },
    photoActionsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 },
    button: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, paddingHorizontal: 12, borderRadius: 12, borderWidth: 1.5, flex: 1, minWidth: 180 },
    buttonPrimary: { backgroundColor: colors.primary, borderColor: colors.primary },
    buttonOutline: { backgroundColor: colors.surface, borderColor: colors.primary },
    buttonIcon: { marginRight: 8 },
    buttonPrimaryText: { color: colors.onPrimary, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    buttonOutlineText: { color: colors.primary, fontSize: 16, fontWeight: 'bold', textAlign: 'center' },
    galleryPreview: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 12, justifyContent: 'flex-start' },
    placeholderContainer: { width: '100%', minHeight: 150, alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8, padding: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: colors.border, borderRadius: 14, backgroundColor: colors.surfaceAlt },
    placeholderImage: { width: 100, height: 100, marginBottom: 10, opacity: 0.7 },
    placeholderText: { color: colors.mutedText, fontSize: 13, textAlign: 'center' },
    imageContainer: { position: 'relative', margin: 2 },
    imageThumbnail: { width: 104, height: 104, borderRadius: 12, backgroundColor: colors.surfaceAlt, borderWidth: 1, borderColor: colors.border },
    deleteButton: { position: 'absolute', top: -7, right: -7, borderRadius: 15, backgroundColor: colors.surface },
    deleteIconBackground: { color: colors.danger, borderRadius: 12, overflow: 'hidden' },
    label: { fontSize: 14, color: colors.text, marginBottom: 7, fontWeight: '700' },
    input: { backgroundColor: colors.input, borderWidth: 1, borderColor: colors.border, borderRadius: 11, paddingHorizontal: 14, paddingVertical: 13, fontSize: 16, color: colors.text, marginBottom: 16 },
    textArea: { minHeight: 120, textAlignVertical: 'top', paddingTop: 12 },
    radioGroupContainer: { marginBottom: 16, alignItems: 'flex-start', borderWidth: 1, borderColor: colors.border, borderRadius: 11, padding: 12, backgroundColor: colors.input },
    radioLabel: { fontSize: 16, color: colors.text, lineHeight: 24 },
    submitButton: { marginTop: 12, marginHorizontal: 0, width: '100%', minHeight: 52 },
    disabledButton: { opacity: 0.65 },
})

export default createCreateProductStyles
