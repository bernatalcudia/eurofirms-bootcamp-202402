import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

export const authLogo = {
    width: 190,
    height: 150,
    marginBottom: 8,
} as const

export const authDisabledButton = {
    opacity: 0.7,
} as const

export const createLoginStyles = (colors: ThemeColors) => StyleSheet.create({
    view: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    card: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 18,
        elevation: 3,
        maxWidth: 420,
        padding: 24,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        width: '100%',
    },
    heading: {
        color: colors.text,
        fontSize: 26,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: colors.mutedText,
        fontSize: 15,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        backgroundColor: colors.input,
        color: colors.text,
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 14,
        backgroundColor: colors.primary,
        borderRadius: 10,
        marginTop: 6,
    },
    secondaryButton: {
        width: '100%',
        padding: 13,
        borderColor: colors.primary,
        borderWidth: 1,
        borderRadius: 10,
        marginTop: 10,
    },
    buttonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
    secondaryButtonText: {
        color: colors.primary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
})

export const createRegisterStyles = (colors: ThemeColors) => StyleSheet.create({
    view: {
        flexGrow: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.background,
    },
    card: {
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: 18,
        elevation: 3,
        maxWidth: 420,
        padding: 24,
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        width: '100%',
    },
    heading: {
        color: colors.text,
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        color: colors.mutedText,
        fontSize: 15,
        marginBottom: 18,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        paddingHorizontal: 14,
        paddingVertical: 13,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 10,
        backgroundColor: colors.input,
        color: colors.text,
        fontSize: 16,
    },
    button: {
        width: '100%',
        padding: 14,
        backgroundColor: colors.primary,
        borderRadius: 10,
        marginTop: 6,
    },
    buttonText: {
        color: colors.onPrimary,
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'center',
    },
})
