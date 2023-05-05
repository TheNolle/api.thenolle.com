import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, type, tool } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!type) return response.status(400).json({ error: 'Missing type' })
    if (!tool) return response.status(400).json({ error: 'Missing tool' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const materialData = minecraftData.materials[`${type.toLowerCase().replaceAll(' ', '_')}/${tool.toLowerCase().replaceAll(' ', '_')}`]
    if (!materialData) return response.status(400).json({ error: 'Invalid material type or tool' })

    return response.status(200).json({ version, blocks: materialData })
})

export default router
