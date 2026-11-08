import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createRetrieveSavedProductsStyles = (colors: ThemeColors) => StyleSheet.create({
    centeredContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: colors.background },
    container: { flex: 1, backgroundColor: colors.background },
    list: { padding: 16, alignSelf: 'center', width: '100%', maxWidth: 880 },
    productContainer: {
        marginBottom: 20,
        backgroundColor: colors.surface,
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imagesScrollViewContainer: { marginBottom: 15 },
    image: { width: 150, height: 150, borderRadius: 10, marginLeft: 10, alignSelf: 'center' },
    dateText: { fontSize: 12, color: colors.mutedText, marginBottom: 5 },
    titleText: { fontSize: 20, fontWeight: 'bold', marginBottom: 5, color: colors.text },
    brandText: { fontSize: 16, color: colors.mutedText, marginBottom: 5 },
    priceText: { fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 5 },
    stateText: { fontSize: 14, fontStyle: 'italic', color: colors.mutedText, marginBottom: 3 },
    stockText: { fontSize: 14, color: colors.mutedText, marginBottom: 3 },
    descriptionText: { fontSize: 14, color: colors.text, marginTop: 10 },
    emptyText: { color: colors.text, fontSize: 16, textAlign: 'center' },
    retryButton: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 16, paddingHorizontal: 18, paddingVertical: 11 },
    retryText: { color: colors.onPrimary, fontWeight: '700' },
})

export default createRetrieveSavedProductsStyles
