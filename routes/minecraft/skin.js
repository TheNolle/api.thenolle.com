import { Router } from 'express'
import axios from 'axios'
import sharp from 'sharp'
import { createErrorImage, manipulateImage } from '../../functions/image.utils.js'

const router = Router()

router.get('/head/*', async (request, response) => {
    try {
        const url = request.params[0]

        response.setHeader('Content-Type', 'image/png')

        if (!/^https{0,1}:\/\/.+$/.test(url)) return response.send(await createErrorImage('Invalid URL format.'))

        const imageResponse = await axios.get(url, { responseType: 'arraybuffer' })
        // 1000000 bytes = 1 Megabyte = 1 * 1000000
        if (imageResponse.headers['content-length'] > (1 * 1000000)) return response.send(await createErrorImage('Image is too big.'))
        if (!imageResponse.headers['content-type'].startsWith('image/')) return response.send(await createErrorImage('Invalid skin URL.'))

        const image = sharp(imageResponse.data)
        const metadata = await image.metadata()

        if (metadata.width === 64 && metadata.height === 64) {
            const manipulatedImageBuffer = await manipulateImage(imageResponse.data, 8, 8, 8, 8, 40, 8, 8, 8)
            return response.send(manipulatedImageBuffer)
        }
        else return response.send(await createErrorImage('Not a skin.'))
    } catch (error) {
        return response.send(await createErrorImage('Invalid URL.'))
    }
})

export default router
