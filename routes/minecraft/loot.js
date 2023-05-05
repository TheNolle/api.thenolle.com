import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/entity', async (request, response) => {
    const { version, entity } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!entity) return response.status(400).json({ error: 'Missing entity' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const entityData = minecraftData.entityLoot[entity.toLowerCase().replaceAll(' ', '_')]
    if (!entityData) return response.status(400).json({ error: 'Invalid entity' })

    return response.status(200).json({ ...entityData, version })
})

router.post('/block', async (request, response) => {
    const { version, block } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!block) return response.status(400).json({ error: 'Missing block' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const blockData = minecraftData.blockLoot[block.toLowerCase().replaceAll(' ', '_')]
    if (!blockData) return response.status(400).json({ error: 'Invalid block' })

    return response.status(200).json({ ...blockData, version })
})

export default router
