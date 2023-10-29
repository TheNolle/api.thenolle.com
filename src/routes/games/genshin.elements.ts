import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/elements'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const elementsResponse = await axios.get(`${baseURL}`)
        const elements = elementsResponse.data
        response.status(200).json(elements)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact elements (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch elements' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const elementsResponse = await axios.get(`${baseURL}/all`)
        const elements = elementsResponse.data
        response.status(200).json(elements)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact elements (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch elements' })
    }
})

router.get('/:elementName', async (request: express.Request, response: express.Response) => {
    const elementName = request.params.elementName
    try {
        const elementResponse = await axios.get(`${baseURL}/${elementName}`)
        const element = elementResponse.data
        response.status(200).json(element)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact element (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch element' })
    }
})

export default router