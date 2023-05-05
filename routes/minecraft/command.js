import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const commandsData = minecraftData.commands
    if (!commandsData) return response.status(400).json({ error: 'Invalid commands' })

    return response.status(200).json({ version, count: commandsData.length, commands: commandsData })
})

export default router
