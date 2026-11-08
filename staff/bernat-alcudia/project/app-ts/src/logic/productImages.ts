import * as ImageManipulator from 'expo-image-manipulator'

const MAX_IMAGE_SIDE = 1280
const MAX_ENCODED_LENGTH = 1_200_000

type PickedAsset = { uri: string; width: number; height: number }

export async function prepareProductImages(assets: PickedAsset[]): Promise<string[]> {
    const prepared: string[] = []
    for (const asset of assets) {
        const longestSide = Math.max(asset.width, asset.height)
        const resize = longestSide > MAX_IMAGE_SIDE
            ? [{ resize: asset.width >= asset.height ? { width: MAX_IMAGE_SIDE } : { height: MAX_IMAGE_SIDE } }]
            : []
        const result = await ImageManipulator.manipulateAsync(
            asset.uri,
            resize,
            { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG, base64: true },
        )
        if (!result.base64 || result.base64.length > MAX_ENCODED_LENGTH) {
            throw new Error('Product image is too large after optimisation')
        }
        prepared.push(result.base64)
    }
    return prepared
}
