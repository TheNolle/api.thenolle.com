import sharp from 'sharp'

export function createErrorImage(message) {
    return sharp({ create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } })
        .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="32" y="32" font-family="Arial" font-size="12" text-anchor="middle" alignment-baseline="central" fill="white">${message}</text></svg>`) }])
        .png()
        .toBuffer()
}

export async function manipulateImage(imageBuffer, x1, y1, width1, height1, x2, y2, width2, height2) {
    const image = sharp(imageBuffer)
    const part1 = await image.clone().extract({ left: x1, top: y1, width: width1, height: height1 }).toBuffer()
    const part2 = await image.clone().extract({ left: x2, top: y2, width: width2, height: height2 }).toBuffer()
    const baseImage = sharp(part1)
    const manipulatedImage = await baseImage
        .composite([{ input: part2, left: 0, top: 0 }])
        .png()
        .toBuffer()

    return manipulatedImage
}

export async function resizeImage(buffer, height) {
    if (!height) return buffer
    const image = sharp(buffer)
    const resizedImageBuffer = await image.resize({ height: height, kernel: sharp.kernel.nearest }).toBuffer()
    return resizedImageBuffer
}

export async function handleImageSize(imageData, size) {
    if (size) {
        if (size < 1) size = 1
        if (size > 3840) size = 3840
        const newSize = parseInt(size, 10)
        if (isNaN(newSize)) return imageData
        return await resizeImage(imageData, newSize)
    }
    return imageData
}