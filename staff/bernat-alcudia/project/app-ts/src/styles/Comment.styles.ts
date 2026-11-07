import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createCommentStyles = (colors: ThemeColors) => StyleSheet.create({
    commentItemContainer: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    authorInfo: {},
    commentAuthor: {
        fontWeight: 'bold',
        fontSize: 14,
        color: colors.text,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
    },
    actionButton: {
        padding: 5,
        marginLeft: 10,
    },
    commentText: {
        fontSize: 14,
        color: colors.mutedText,
        lineHeight: 20,
        paddingLeft: 5,
    },
    editContainer: {
        marginTop: 10,
    },
    textInput: {
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 5,
        paddingHorizontal: 10,
        paddingVertical: 8,
        marginBottom: 10,
        fontSize: 14,
        textAlignVertical: 'top',
        backgroundColor: colors.input,
        color: colors.text,
    },
    editActions: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginLeft: 10,
        alignItems: 'center',
    },
    saveButton: {
        backgroundColor: colors.primary,
    },
    cancelButton: {
        backgroundColor: colors.surfaceAlt,
    },
    buttonText: {
        color: colors.onPrimary,
        fontWeight: 'bold',
        fontSize: 14,
    },
    cancelButtonText: {
        color: colors.text,
    },
})

export default createCommentStyles
