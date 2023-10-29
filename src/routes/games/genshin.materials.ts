import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/materials'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const materialsResponse = await axios.get(`${baseURL}`)
        const materials = materialsResponse.data
        response.status(200).json(materials)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact materials (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch materials' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const materialsResponse = await axios.get(`${baseURL}/all`)
        const materials = materialsResponse.data
        response.status(200).json(materials)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact materials (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch materials' })
    }
})

router.get('/:materialType', async (request: express.Request, response: express.Response) => {
    const materialType = request.params.materialType
    try {
        const materialResponse = await axios.get(`${baseURL}/${materialType}`)
        const material = materialResponse.data
        response.status(200).json(material)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact material (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch material' })
    }
})

router.get('/:materialType/:materialName', async (request: express.Request, response: express.Response) => {
    const materialType = request.params.materialType
    const materialName = request.params.materialName
    try {
        const materialResponse = await axios.get(`${baseURL}/${materialType}/${materialName}`, { responseType: 'arraybuffer' })
        response.set('Content-Type', 'image/png')
        response.status(200).send(materialResponse.data)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact material (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch material' })
    }
})

export default router