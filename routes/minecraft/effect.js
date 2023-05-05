import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, effect } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!effect) return response.status(400).json({ error: 'Missing effect' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const effectData = minecraftData.effectsByName[effect.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ').replaceAll(' ', '')]
    if (!effectData) return response.status(400).json({ error: 'Invalid effect' })

    return response.status(200).json({ ...effectData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const effectsData = minecraftData.effectsArray
    if (!effectsData) return response.status(400).json({ error: 'Invalid effects' })

    return response.status(200).json({ version, count: effectsData.length, effects: effectsData })
})

export default router
