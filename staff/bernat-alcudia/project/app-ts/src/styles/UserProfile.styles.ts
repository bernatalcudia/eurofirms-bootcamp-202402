import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createUserProfileStyles = (colors: ThemeColors) => StyleSheet.create({
    container: { flexGrow: 1, alignItems: 'center', justifyContent: 'center', padding: 20, backgroundColor: colors.background },
    centered: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: colors.background },
    profileCard: { width: '100%', maxWidth: 480, alignItems: 'center', padding: 28, borderRadius: 20, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
    avatar: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center', borderRadius: 38, backgroundColor: colors.surfaceAlt },
    name: { color: colors.text, fontSize: 23, fontWeight: '800', marginTop: 16 },
    username: { color: colors.mutedText, fontSize: 15, marginTop: 4 },
    stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 28, marginVertical: 24 },
    stat: { alignItems: 'center', minWidth: 76 },
    statNumber: { color: colors.text, fontSize: 20, fontWeight: '800' },
    statLabel: { color: colors.mutedText, fontSize: 13, marginTop: 3 },
    statDivider: { width: 1, height: 34, backgroundColor: colors.border },
    primaryButton: { width: '100%', minHeight: 48, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.primary },
    primaryButtonText: { color: colors.onPrimary, fontSize: 15, fontWeight: '700' },
    blockButton: { minHeight: 44, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12 },
    blockButtonText: { color: colors.danger, fontWeight: '700' },
    mutedText: { color: colors.mutedText, fontSize: 15, textAlign: 'center', lineHeight: 22 },
    disabledButton: { opacity: 0.6 },
})

export default createUserProfileStyles
