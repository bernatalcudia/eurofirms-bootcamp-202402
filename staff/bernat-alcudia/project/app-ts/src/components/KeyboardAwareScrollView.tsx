import { useEffect, useImperativeHandle, useRef } from 'react'
import type { Ref } from 'react'
import { Keyboard, Platform, ScrollView, TextInput } from 'react-native'
import type { ScrollViewInstance, ScrollViewProps } from 'react-native'
import KeyboardAvoidingContainer from './KeyboardAvoidingContainer'

type KeyboardAwareScrollViewProps = ScrollViewProps & { ref?: Ref<ScrollViewInstance> }

// Scrolls the focused field above the keyboard once it is shown; the container reserves the space.
export default function KeyboardAwareScrollView({ ref, ...props }: KeyboardAwareScrollViewProps) {
    const scrollRef = useRef<ScrollViewInstance>(null)
    useImperativeHandle(ref, () => scrollRef.current as ScrollViewInstance)

    useEffect(() => {
        if (Platform.OS === 'web') return
        const subscription = Keyboard.addListener('keyboardDidShow', () => {
            const input = TextInput.State.currentlyFocusedInput()
            const content = scrollRef.current?.getInnerViewRef()
            if (!input || !content) return
            setTimeout(() => {
                input.measureLayout(content, (_x, y) => {
                    scrollRef.current?.scrollTo({ y: Math.max(0, y - 160), animated: true })
                }, () => undefined)
            }, 150)
        })
        return () => subscription.remove()
    }, [])

    return (
        <KeyboardAvoidingContainer>
            <ScrollView keyboardShouldPersistTaps='handled' {...props} ref={scrollRef} />
        </KeyboardAvoidingContainer>
    )
}
