import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const protocolData = minecraftData.protocol
    if (!protocolData) return response.status(400).json({ error: 'Invalid protocol' })

    return response.status(200).json({ ...protocolData, version })
})

router.post('/comments', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const protocolCommentsData = minecraftData.protocolComments
    if (!protocolCommentsData) return response.status(400).json({ error: 'Invalid protocol comments' })

    return response.status(200).json({ version, protocolComments: protocolCommentsData })
})

export default router
