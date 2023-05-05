import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, gui } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!gui) return response.status(400).json({ error: 'Missing gui' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const guiData = minecraftData.windows[`minecraft:${gui.replaceAll(' ', '_').toLowerCase()}`]
    if (!guiData) return response.status(400).json({ error: 'Invalid gui' })

    return response.status(200).json({ ...guiData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const guisData = minecraftData.windowsArray
    if (!guisData) return response.status(400).json({ error: 'Invalid guis' })

    return response.status(200).json({ version, count: guisData.length, guis: guisData })
})

export default router
