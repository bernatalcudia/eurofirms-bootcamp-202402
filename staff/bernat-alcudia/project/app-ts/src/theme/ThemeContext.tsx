import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

export type ThemeName = 'light' | 'dark' | 'fallera'

export interface ThemeColors {
    background: string
    surface: string
    surfaceAlt: string
    text: string
    mutedText: string
    border: string
    primary: string
    onPrimary: string
    accent: string
    onAccent: string
    danger: string
    onDanger: string
    input: string
}

const themeStorageKey = '@app-ts/theme'

export const themeColors: Record<ThemeName, ThemeColors> = {
    light: {
        background: '#F4F6F5',
        surface: '#FFFFFF',
        surfaceAlt: '#E8EEEA',
        text: '#17231D',
        mutedText: '#4B5B52',
        border: '#AAB8AF',
        primary: '#175C3D',
        onPrimary: '#FFFFFF',
        accent: '#8C4936',
        onAccent: '#FFFFFF',
        danger: '#A32119',
        onDanger: '#FFFFFF',
        input: '#FFFFFF',
    },
    dark: {
        background: '#111813',
        surface: '#1C2820',
        surfaceAlt: '#29382E',
        text: '#F4F7F4',
        mutedText: '#C1CEC4',
        border: '#53645A',
        primary: '#83D2A4',
        onPrimary: '#102419',
        accent: '#FFB79F',
        onAccent: '#32190F',
        danger: '#FF8A80',
        onDanger: '#3B0A06',
        input: '#17221B',
    },
    fallera: {
        background: '#FBF5F0',
        surface: '#FFFFFF',
        surfaceAlt: '#F1E5DD',
        text: '#2B211D',
        mutedText: '#594B45',
        border: '#C9B5A9',
        primary: '#285B40',
        onPrimary: '#FFFFFF',
        accent: '#8D4936',
        onAccent: '#FFFFFF',
        danger: '#A32119',
        onDanger: '#FFFFFF',
        input: '#FFFFFF',
    },
}

interface ThemeContextValue {
    theme: ThemeName
    colors: ThemeColors
    setTheme: (theme: ThemeName) => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: React.PropsWithChildren) {
    const [theme, setThemeState] = useState<ThemeName>('fallera')

    useEffect(() => {
        AsyncStorage.getItem(themeStorageKey)
            .then(value => {
                if (value === 'light' || value === 'dark' || value === 'fallera') setThemeState(value)
            })
            .catch(error => console.error('Could not load the saved theme preference:', error))
    }, [])

    const setTheme = useCallback(async (nextTheme: ThemeName) => {
        setThemeState(nextTheme)
        await AsyncStorage.setItem(themeStorageKey, nextTheme)
    }, [])

    const value = useMemo(() => ({ theme, colors: themeColors[theme], setTheme }), [theme, setTheme])

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) throw new Error('useTheme must be used within a ThemeProvider')
    return context
}
