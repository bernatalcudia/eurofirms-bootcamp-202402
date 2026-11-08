import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import type { HostInstance, StyleProp, ViewStyle } from 'react-native'

type KeyboardAvoidingContainerProps = { style?: StyleProp<ViewStyle>, children: ReactNode }

// Android draws edge to edge, so the window no longer resizes when the keyboard opens. The container
// measures where it sits in the window and pads exactly the part the keyboard covers.
export default function KeyboardAvoidingContainer({ style, children }: KeyboardAvoidingContainerProps) {
    const containerRef = useRef<HostInstance>(null)
    const [overlap, setOverlap] = useState(0)

    useEffect(() => {
        if (Platform.OS !== 'android') return
        const show = Keyboard.addListener('keyboardDidShow', event => {
            containerRef.current?.measureInWindow((_x, y, _width, height) => {
                setOverlap(Math.max(0, y + height - event.endCoordinates.screenY))
            })
        })
        const hide = Keyboard.addListener('keyboardDidHide', () => setOverlap(0))
        return () => {
            show.remove()
            hide.remove()
        }
    }, [])

    if (Platform.OS === 'ios') {
        return <KeyboardAvoidingView style={[styles.fill, style]} behavior='padding'>{children}</KeyboardAvoidingView>
    }
    return <View ref={containerRef} style={[styles.fill, style, overlap > 0 && { paddingBottom: overlap }]}>{children}</View>
}

const styles = StyleSheet.create({
    fill: { flex: 1 },
})
