import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, biome } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!biome) return response.status(400).json({ error: 'Missing biome' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const biomeData = minecraftData.biomesByName[biome.toLowerCase().replaceAll(' ', '_')]
    if (!biomeData) return response.status(400).json({ error: 'Invalid biome' })

    return response.status(200).json({ ...biomeData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const biomesData = minecraftData.biomesArray
    if (!biomesData) return response.status(400).json({ error: 'Invalid biomes' })

    return response.status(200).json({ version, count: biomesData.length, biomes: biomesData })
})

export default router
