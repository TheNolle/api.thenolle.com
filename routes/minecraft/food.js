import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, food } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!food) return response.status(400).json({ error: 'Missing food' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const foodData = minecraftData.foodsByName[food.toLowerCase().replaceAll(' ', '_')]
    if (!foodData) return response.status(400).json({ error: 'Invalid food' })

    return response.status(200).json({ ...foodData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const foodsData = minecraftData.foodsArray
    if (!foodsData) return response.status(400).json({ error: 'Invalid foods' })

    return response.status(200).json({ version, count: foodsData.length, foods: foodsData })
})

export default router
