import { Router } from 'express'
import axios from 'axios'
import { manipulateImage, handleImageSize } from '../../functions/image.utils.js'
import { getUUID, getUsername, getUuidOrUsername, fetchProfileAndTexture } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/uuid/:username', async (request, response) => {
    try {
        const data = await getUUID(request.params.username)
        response.send(data.id)
    } catch (error) {
        response.status(500).send('An error occurred while fetching the UUID.')
    }
})

router.get('/username/:uuid', async (request, response) => {
    try {
        const data = await getUsername(request.params.uuid)
        response.send(data.name)
    } catch (error) {
        response.status(500).send('An error occurred while fetching the username.')
    }
})

router.get('/skin/:uuidOrUsername', async (request, response) => {
    response.setHeader('Content-Type', 'image/png')
    const { uuid, username } = getUuidOrUsername(request.params.uuidOrUsername)
    if (!uuid && !username) return response.status(404).send('Invalid UUID or username.')
    try {
        const imageResponse = await fetchProfileAndTexture(uuid, username)
        const resizedImage = await handleImageSize(imageResponse.data, request.query.size)
        return response.send(resizedImage)
    } catch (error) {
        await axios.get('https://textures.minecraft.net/texture/267c5b2bd8da77b8b7bd1c942e5bf4e04a1eaab50190203f1d0ff47ca90b74e2', { responseType: 'arraybuffer' })
            .then(async (imageResponse) => {
                const resizedImage = await handleImageSize(imageResponse.data, request.query.size)
                return response.send(resizedImage)
            })
            .catch((error) => response.status(404).send(error.response.data.errorMessage))
    }
})

router.get('/skin/head/:uuidOrUsername', async (request, response) => {
    response.setHeader('Content-Type', 'image/png')
    const { uuid, username } = getUuidOrUsername(request.params.uuidOrUsername)
    if (!uuid && !username) return response.status(404).send('Invalid UUID or username.')
    try {
        const imageResponse = await fetchProfileAndTexture(uuid, username)
        const manipulatedImageBuffer = await manipulateImage(imageResponse.data, 8, 8, 8, 8, 40, 8, 8, 8)
        const resizedImage = await handleImageSize(manipulatedImageBuffer, request.query.size)
        return response.send(resizedImage)
    } catch (error) {
        await axios.get('https://textures.minecraft.net/texture/267c5b2bd8da77b8b7bd1c942e5bf4e04a1eaab50190203f1d0ff47ca90b74e2', { responseType: 'arraybuffer' })
            .then(async (imageResponse) => {
                const manipulatedImageBuffer = await manipulateImage(imageResponse.data, 8, 8, 8, 8, 40, 8, 8, 8)
                const resizedImage = await handleImageSize(manipulatedImageBuffer, request.query.size)
                return response.send(resizedImage)
            })
            .catch((error) => response.status(404).send(error.response.data.errorMessage))
    }
})

router.get('/cape/:uuidOrUsername', async (request, response) => {
    response.setHeader('Content-Type', 'image/png')
    const { uuid, username } = getUuidOrUsername(request.params.uuidOrUsername)
    if (!uuid && !username) return response.status(404).send('Invalid UUID or username.')
    try {
        const imageResponse = await fetchProfileAndTexture(uuid, username, 'CAPE')
        const resizedImage = await handleImageSize(imageResponse.data, request.query.size)
        return response.send(resizedImage)
    } catch (error) {
        await axios.get('https://textures.minecraft.net/texture/2340c0e03dd24a11b15a8b33c2a7e9e32abb2051b2481d0ba7defd635ca7a933', { responseType: 'arraybuffer' })
            .then(async (imageResponse) => {
                const resizedImage = await handleImageSize(imageResponse.data, request.query.size)
                return response.send(resizedImage)
            })
            .catch((error) => response.status(404).send(error.response.data.errorMessage))
    }
})

export default router