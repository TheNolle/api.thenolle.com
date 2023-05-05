import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, particle } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!particle) return response.status(400).json({ error: 'Missing particle' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })
    
    const particleData = minecraftData.particlesByName[particle.toLowerCase().replaceAll(' ', '_')]
    if (!particleData) return response.status(400).json({ error: 'Invalid particle' })

    return response.status(200).json({ ...particleData, version })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const particlesData = minecraftData.particlesArray
    if (!particlesData) return response.status(400).json({ error: 'Invalid particles' })

    return response.status(200).json({ version, count: particlesData.length, particles: particlesData })
})

export default router
