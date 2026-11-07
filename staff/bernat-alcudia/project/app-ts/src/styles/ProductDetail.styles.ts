import { Dimensions, StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createProductDetailStyles = (colors: ThemeColors) => {
    const screenWidth = Dimensions.get('window').width

    return StyleSheet.create({
        mainContainer: { flex: 1, backgroundColor: colors.background },
        productCard: {
            margin: 15,
            backgroundColor: colors.surface,
            borderRadius: 10,
            padding: 15,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
        },
        imageScrollView: { height: screenWidth, marginBottom: 15 },
        imageContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
        productImage: { width: screenWidth - 30, height: screenWidth - 30, borderRadius: 10, marginRight: 0, marginLeft: 10 },
        infoContainer: { paddingHorizontal: 5, paddingBottom: 10 },
        sectionTitle: { fontSize: 18, fontWeight: 'bold', color: colors.text, marginBottom: 10 },
        detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8, paddingVertical: 2 },
        detailLabel: { fontSize: 15, color: colors.mutedText, fontWeight: '500' },
        detailValue: { fontSize: 15, color: colors.text, flexShrink: 1, textAlign: 'right' },
        dateText: { fontSize: 12, color: colors.mutedText, marginBottom: 5 },
        titleText: { fontSize: 22, fontWeight: 'bold', color: colors.text, marginBottom: 8, textAlign: 'center' },
        brandText: { fontSize: 16, color: colors.mutedText, marginBottom: 8, textAlign: 'center' },
        priceText: { fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 10, textAlign: 'center' },
        stateText: { fontSize: 14, fontStyle: 'italic', color: colors.mutedText, marginBottom: 5, textAlign: 'center' },
        stockText: { fontSize: 14, color: colors.mutedText, marginBottom: 10, textAlign: 'center' },
        descriptionText: { fontSize: 15, color: colors.text, lineHeight: 22, marginTop: 10, textAlign: 'justify' },
        actionButtonsContainer: { flexDirection: 'row', justifyContent: 'space-around', paddingTop: 15, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 15 },
        actionButton: { padding: 10, borderRadius: 5, backgroundColor: colors.surfaceAlt },
        contactSellerButton: { backgroundColor: colors.primary, borderRadius: 14, minHeight: 50, alignItems: 'center', justifyContent: 'center', marginTop: 8, paddingHorizontal: 18 },
        contactSellerText: { color: colors.onPrimary, fontSize: 16, fontWeight: '700' },
        modifyIcon: { fontSize: 26, color: colors.primary },
        deleteIcon: { fontSize: 26, color: colors.danger },
        loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
        loadingText: { fontSize: 16, marginTop: 12, color: colors.mutedText },
    })
}

export default createProductDetailStyles
