import express from 'express'
import axios from 'axios'

const router = express.Router()
const baseURL = 'https://genshin.jmp.blue/domains'

router.get('/', async (request: express.Request, response: express.Response) => {
    try {
        const domainsResponse = await axios.get(`${baseURL}`)
        const domains = domainsResponse.data
        response.status(200).json(domains)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact domains (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch domains' })
    }
})

router.get('/all', async (request: express.Request, response: express.Response) => {
    try {
        const domainsResponse = await axios.get(`${baseURL}/all`)
        const domains = domainsResponse.data
        response.status(200).json(domains)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact domains (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch domains' })
    }
})

router.get('/:domainName', async (request: express.Request, response: express.Response) => {
    const domainName = request.params.domainName
    try {
        const domainResponse = await axios.get(`${baseURL}/${domainName}`)
        const domain = domainResponse.data
        response.status(200).json(domain)
    } catch (error: any) {
        console.error(`Error fetching Genshin Impact domain (https://api.thenolle.com${request.originalUrl}):`, error.message)
        response.status(500).json({ error: 'Failed to fetch domain' })
    }
})

export default router