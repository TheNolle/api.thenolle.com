import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/login', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const loginData = minecraftData.loginPacket
    if (!loginData) return response.status(400).json({ error: 'Invalid login packet' })

    return response.status(200).json({ version, ...loginData })
})

export default router
