import sharp from 'sharp'

export function createErrorImage(message) {
    return sharp({ create: { width: 64, height: 64, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 1 } } })
        .composite([{ input: Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><text x="32" y="32" font-family="Arial" font-size="12" text-anchor="middle" alignment-baseline="central" fill="white">${message}</text></svg>`) }])
        .png()
        .toBuffer()
}

export async function manipulateImage(imageBuffer, x1, y1, width1, height1, x2, y2, width2, height2) {
    const image = sharp(imageBuffer)

    // Extract the first part of the image
    const part1 = await image.clone().extract({ left: x1, top: y1, width: width1, height: height1 }).toBuffer()

    // Extract the second part of the image
    const part2 = await image.clone().extract({ left: x2, top: y2, width: width2, height: height2 }).toBuffer()

    // Create a new image with part1 as the base
    const baseImage = sharp(part1)

    // Place the second part on top of the first part
    const manipulatedImage = await baseImage
        .composite([{ input: part2, left: 0, top: 0 }])
        .png()
        .toBuffer()

    return manipulatedImage
}