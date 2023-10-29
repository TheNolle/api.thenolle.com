import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/characters'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const charactersResponse = await axios.get(`${baseURL}`)
        const characters = charactersResponse.data
        response.status(200).json(characters)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact characters (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch characters' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const charactersResponse = await axios.get(`${baseURL}/all`)
        const characters = charactersResponse.data
        response.status(200).json(characters)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact characters (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch characters' })
    }
})

router.get('/:characterName', async (request: express.Request, response: express.Response) => {
    const characterName = request.params.characterName
    try {
        const characterResponse = await axios.get(`${baseURL}/${characterName}`)
        const character = characterResponse.data
        response.status(200).json(character)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact character (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch character' })
    }
})

export default router