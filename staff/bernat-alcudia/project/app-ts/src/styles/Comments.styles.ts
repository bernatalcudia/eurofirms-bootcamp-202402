import { StyleSheet } from 'react-native'
import type { ThemeColors } from '../theme/ThemeContext'

const createCommentsStyles = (colors: ThemeColors) => StyleSheet.create({
    slider: {
        position: 'absolute',
        height: '85%',
        width: '100%',
        backgroundColor: colors.surface,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingTop: 5,
        bottom: 0,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
    },
    dragBar: { width: 60, height: 5, backgroundColor: colors.border, borderRadius: 3, alignSelf: 'center', marginBottom: 10, paddingVertical: 10, paddingHorizontal: 20 },
    closeButton: { padding: 5, paddingRight: 15, paddingVertical: 10 },
    title: { fontSize: 20, fontWeight: 'bold', marginLeft: 15, flex: 1, color: colors.text },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    contentArea: { flex: 1, width: '100%' },
    commentsList: { paddingHorizontal: 15, paddingBottom: 10, flexGrow: 1 },
    commentHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 },
    inputContainer: { flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface },
    input: { flex: 1, paddingVertical: 10, paddingHorizontal: 15, borderWidth: 1, borderColor: colors.border, borderRadius: 20, marginRight: 10, fontSize: 16, color: colors.text, backgroundColor: colors.input },
    sendButton: { padding: 10 },
    overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'black', zIndex: 999 },
    emptyListContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
    emptyListText: { fontSize: 16, color: colors.mutedText },
})

export default createCommentsStyles
