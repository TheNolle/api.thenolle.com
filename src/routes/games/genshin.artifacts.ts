import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/artifacts'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const artifactsResponse = await axios.get(`${baseURL}`)
        const artifacts = artifactsResponse.data
        response.status(200).json(artifacts)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact artifacts (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch artifacts' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const artifactsResponse = await axios.get(`${baseURL}/all`)
        const artifacts = artifactsResponse.data
        response.status(200).json(artifacts)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact artifacts (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch artifacts' })
    }
})

router.get('/:artifactName', async (request: express.Request, response: express.Response) => {
    const artifactName = request.params.artifactName
    try {
        const artifactResponse = await axios.get(`${baseURL}/${artifactName}`)
        const artifact = artifactResponse.data
        response.status(200).json(artifact)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact artifact (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch artifact' })
    }
})

export default router