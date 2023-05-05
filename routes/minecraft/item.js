import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, item } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!item) return response.status(400).json({ error: 'Missing item' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const itemData = minecraftData.itemsByName[item.toLowerCase().replaceAll(' ', '_')]
    if (!itemData) return response.status(400).json({ error: 'Invalid item' })

    return response.status(200).json({ ...itemData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const itemsData = minecraftData.itemsArray
    if (!itemsData) return response.status(400).json({ error: 'Invalid items' })

    return response.status(200).json({ version, count: itemsData.length, items: itemsData })
})

export default router
