import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, entity } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!entity) return response.status(400).json({ error: 'Missing entity' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const entityData = minecraftData.entitiesByName[entity.toLowerCase().replaceAll(' ', '_')]
    if (!entityData) return response.status(400).json({ error: 'Invalid entity' })

    return response.status(200).json({ ...entityData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const entitiesData = minecraftData.entitiesArray
    if (!entitiesData) return response.status(400).json({ error: 'Invalid entities' })

    return response.status(200).json({ version, count: entitiesData.length, entities: entitiesData })
})

export default router
