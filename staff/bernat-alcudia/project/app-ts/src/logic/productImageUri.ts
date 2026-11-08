const IMAGE_FORMATS: [prefix: string, subtype: string][] = [
    ['/9j/', 'jpeg'],
    ['iVBORw0KGgo', 'png'],
    ['R0lGOD', 'gif'],
    ['UklGR', 'webp'],
]

// Product images are stored as raw base64; label them with the format they actually have.
export function productImageUri(image: string): string {
    if (/^(data:|https?:)/i.test(image)) return image
    const format = IMAGE_FORMATS.find(([prefix]) => image.startsWith(prefix))
    return `data:image/${format ? format[1] : 'png'};base64,${image}`
}
