import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createProductsStyles = (colors: ThemeColors) => StyleSheet.create({
    commentsContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    commentsCountText: { fontSize: 16, color: colors.text, fontWeight: '500' },
    mainContainer: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', paddingTop: 20, paddingHorizontal: 12 },
    productContainer: {
        padding: 20,
        marginBottom: 15,
        alignSelf: 'center',
        maxWidth: 680,
        width: '100%',
        backgroundColor: colors.surface,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
        flex: 1,
    },
    input: { width: '80%', padding: 10, marginVertical: 10, borderWidth: 1, borderColor: colors.border, borderRadius: 5, alignSelf: 'center' },
    productImage: { width: '100%', height: 300, borderRadius: 10, backgroundColor: colors.surfaceAlt },
    productInfoContainer: { marginBottom: 12 },
    productTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 4 },
    productBrand: { fontSize: 14, color: colors.mutedText, marginBottom: 4 },
    productPrice: { fontSize: 16, fontWeight: '600', color: colors.primary, marginBottom: 4 },
    productState: { fontSize: 14, color: colors.mutedText, fontStyle: 'italic' },
    actionsContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border },
    likeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    likeCountText: { fontSize: 16, color: colors.text, fontWeight: '500' },
    buttonPressIn: { transform: [{ scale: 0.95 }] },
    button: { justifyContent: 'center', padding: 5 },
    buttonText: { fontSize: 18, textAlign: 'center', color: colors.text },
    emptyState: { alignItems: 'center', justifyContent: 'center', minHeight: 280, padding: 28 },
    emptyTitle: { color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: 8, textAlign: 'center' },
    emptyMessage: { color: colors.mutedText, fontSize: 15, lineHeight: 22, textAlign: 'center' },
    retryButton: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 16, paddingHorizontal: 18, paddingVertical: 11 },
    retryText: { color: colors.onPrimary, fontWeight: '700' },
})

export default createProductsStyles
