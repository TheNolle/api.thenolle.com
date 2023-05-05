import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, enchantment } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!enchantment) return response.status(400).json({ error: 'Missing enchantment' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const enchantmentData = minecraftData.enchantmentsByName[enchantment.toLowerCase().replaceAll(' ', '_')]
    if (!enchantmentData) return response.status(400).json({ error: 'Invalid enchantment' })

    return response.status(200).json({ ...enchantmentData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const enchantmentsData = minecraftData.enchantmentsArray
    if (!enchantmentsData) return response.status(400).json({ error: 'Invalid enchantments' })

    return response.status(200).json({ version, count: enchantmentsData.length, enchantments: enchantmentsData })
})

export default router
