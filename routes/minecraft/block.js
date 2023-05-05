import { Router } from 'express'
import MinecraftData from 'minecraft-data'

const router = Router()

router.post('/', async (request, response) => {
    const { version, block } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!block) return response.status(400).json({ error: 'Missing block' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })
    
    const blockData = minecraftData.blocksByName[block.toLowerCase()]
    if (!blockData) return response.status(400).json({ error: 'Invalid block' })

    return response.status(200).json({ ...blockData, version})
})

router.post('/collision-shape', async (request, response) => {
    const { version, block } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })
    if (!block) return response.status(400).json({ error: 'Missing block' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const collisionshapeData = minecraftData.blockCollisionShapes.blocks[block.toLowerCase().replaceAll(' ', '_')]
    if (!collisionshapeData) return response.status(400).json({ error: 'Invalid block' })

    return response.status(200).json({ version, collisionshape: collisionshapeData })
})

router.post('/all', async (request, response) => {
    const { version } = request.body

    if (!version) return response.status(400).json({ error: 'Missing version' })

    const minecraftData = MinecraftData(version)
    if (!minecraftData) return response.status(400).json({ error: 'Invalid version' })

    const blocksData = minecraftData.blocksArray
    if (!blocksData) return response.status(400).json({ error: 'Invalid blocks' })

    return response.status(200).json({ version, count: blocksData.length, blocks: blocksData })
})

export default router
