import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/icon', async (request, response) => {
    const { version, icon } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!icon) return response.status(400).json({ error: 'Missing icon' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const iconData = minecraftData.mapIconsByName[icon.toLowerCase().replaceAll(' ', '_')]
    if (!iconData) return response.status(400).json({ error: 'Invalid icon' })

    return response.status(200).json({ ...iconData, version })
})

router.post('/icon/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const iconsData = minecraftData.mapIconsArray
    if (!iconsData) return response.status(400).json({ error: 'Invalid icons' })

    return response.status(200).json({ version, count: iconsData.length, icons: iconsData })
})

export default router
