import type { ThemeColors, ThemeName } from '../theme/ThemeContext'

export const getStatusBarStyle = (theme: ThemeName): 'light' | 'dark' => theme === 'dark' ? 'light' : 'dark'

export const createAppNavigatorStyles = (colors: ThemeColors) => ({
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
    headerTitleStyle: { fontWeight: '700' as const },
})

export const createTabNavigatorStyles = (colors: ThemeColors) => ({
    tabBarActiveTintColor: colors.primary,
    tabBarInactiveTintColor: colors.mutedText,
    tabBarShowLabel: true,
    tabBarStyle: {
        height: 68,
        paddingBottom: 7,
        paddingTop: 5,
        backgroundColor: colors.surface,
        borderTopColor: colors.border,
    },
    tabBarLabelStyle: { fontSize: 10, fontWeight: '600' as const },
    homeHeaderStyle: { height: 100, backgroundColor: colors.surface },
    homeHeaderTitleAlign: 'center' as const,
    headerStyle: { backgroundColor: colors.surface },
    headerTintColor: colors.text,
})
