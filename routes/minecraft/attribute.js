import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, type, attribute } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!attribute) return response.status(400).json({ error: 'Missing attribute' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const attributeData = minecraftData.attributes[`minecraft:${type.toLowerCase()}.${attribute.toLowerCase().replaceAll(' ', '_')}`]
    if (!attributeData) return response.status(400).json({ error: 'Invalid type or attribute' })

    return response.status(200).json({ ...attributeData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const attributesData = minecraftData.attributesArray
    if (!attributesData) return response.status(400).json({ error: 'Invalid attributes' })

    return response.status(200).json({ version, count: attributesData.length, attributes: attributesData })
})

export default router
