import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const tintData = minecraftData.tints
    if (!tintData) return response.status(400).json({ error: 'Invalid tints' })

    return response.status(200).json({ version, count: Object.keys(tintData).length, tints: tintData })
})

export default router
