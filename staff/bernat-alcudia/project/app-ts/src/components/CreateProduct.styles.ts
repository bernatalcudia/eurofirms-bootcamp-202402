import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createCreateProductStyles = (colors: ThemeColors) => StyleSheet.create({
    scrollView: {
        backgroundColor: colors.background
    },
    scrollViewContent: {
        paddingBottom: 30,
    },
    container: {
        flex: 1,
        paddingHorizontal: 15,
        paddingTop: 10,
        backgroundColor: colors.surface,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.text,
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
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    buttonOutline: {
        backgroundColor: colors.surface,
        borderColor: colors.primary,
    },
    buttonIcon: {
        marginRight: 8,
    },
    buttonPrimaryText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    buttonOutlineText: {
        color: colors.primary,
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
        borderColor: colors.border,
        borderRadius: 8,
        backgroundColor: colors.surfaceAlt
    },
    placeholderImage: {
        width: 100,
        height: 100,
        marginBottom: 10,
        opacity: 0.7,
    },
    placeholderText: {
        color: colors.mutedText,
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
        backgroundColor: colors.surfaceAlt,
        borderWidth: 1,
        borderColor: colors.border
    },
    deleteButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        borderRadius: 12,
    },
    deleteIconBackground: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        overflow: 'hidden',
    },
    label: {
        fontSize: 14,
        color: colors.mutedText,
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        backgroundColor: colors.input,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 12,
        fontSize: 16,
        color: colors.text,
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
        borderColor: colors.border,
        borderRadius: 8,
        padding: 10,
    },
    radioLabel: {
        fontSize: 16,
        color: colors.text,
        lineHeight: 24,
    },
    submitButton: {
        marginTop: 30,
        marginHorizontal: 0,
        width: '100%'
    },
})

export default createCreateProductStyles
