import express from 'express'
import axios from 'axios'

const router = express.Router()

const OPEN_WEATHER_API_ENDPOINT = 'https://api.openweathermap.org/data/2.5/weather'

router.get('/langs', (request: express.Request, response: express.Response) => {
    try {
        response.json([
            { short: 'af', full: 'Afrikaans' },
            { short: 'al', full: 'Albanian' },
            { short: 'ar', full: 'Arabic' },
            { short: 'az', full: 'Azerbaijani' },
            { short: 'bg', full: 'Bulgarian' },
            { short: 'ca', full: 'Catalan' },
            { short: 'cz', full: 'Czech' },
            { short: 'da', full: 'Danish' },
            { short: 'de', full: 'German' },
            { short: 'el', full: 'Greek' },
            { short: 'en', full: 'English' },
            { short: 'eu', full: 'Basque' },
            { short: 'fa', full: 'Persian (Farsi)' },
            { short: 'fi', full: 'Finnish' },
            { short: 'fr', full: 'French' },
            { short: 'gl', full: 'Galician' },
            { short: 'he', full: 'Hebrew' },
            { short: 'hi', full: 'Hindi' },
            { short: 'hr', full: 'Croatian' },
            { short: 'hu', full: 'Hungarian' },
            { short: 'id', full: 'Indonesian' },
            { short: 'it', full: 'Italian' },
            { short: 'ja', full: 'Japanese' },
            { short: 'kr', full: 'Korean' },
            { short: 'la', full: 'Latvian' },
            { short: 'lt', full: 'Lithuanian' },
            { short: 'mk', full: 'Macedonian' },
            { short: 'no', full: 'Norwegian' },
            { short: 'nl', full: 'Dutch' },
            { short: 'pl', full: 'Polish' },
            { short: 'pt', full: 'Portuguese' },
            { short: 'pt_br', full: 'Português Brasil' },
            { short: 'ro', full: 'Romanian' },
            { short: 'ru', full: 'Russian' },
            { short: 'sv', full: ' se Swedish' },
            { short: 'sk', full: 'Slovak' },
            { short: 'sl', full: 'Slovenian' },
            { short: 'sp', full: ' es Spanish' },
            { short: 'sr', full: 'Serbian' },
            { short: 'th', full: 'Thai' },
            { short: 'tr', full: 'Turkish' },
            { short: 'ua', full: ' uk Ukrainian' },
            { short: 'vi', full: 'Vietnamese' },
            { short: 'zh_cn', full: 'Chinese Simplified' },
            { short: 'zh_tw', full: 'Chinese Traditional' },
            { short: 'zu', full: 'Zulu' }
        ])
    } catch (error: any) {
        console.error(`Error fetching weather langs (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(400).send('Error fetching weather langs.')
    }
})

router.get('/city/:city', async (request: express.Request, response: express.Response) => {
    const city: string = String(request.params.city || '').trim()
    const units: string = String(['metric', 'imperial'].includes(String(request.query.units)) ? request.query.units : 'metric')
    const lang: string = String(request.query.lang || 'en')
    try {
        if (!city) return response.status(400).send('Missing city param.')
        const res = await axios.get(OPEN_WEATHER_API_ENDPOINT, { params: { q: city, appid: process.env.OPEN_WEATHER_API_KEY, units, lang } })
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching weather data for ${city} using ${units} units (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(400).send('Error fetching weather data.')
    }
})

router.get('/coords', async (request: express.Request, response: express.Response) => {
    const lat: string = String(request.query.lat || '').trim()
    const lon: string = String(request.query.lon || '').trim()
    if (!lat || !lon) return response.status(400).send('Missing lat or lon query.')
    const units: string = String(['metric', 'imperial'].includes(String(request.query.units)) ? request.query.units : 'metric')
    const lang: string = String(request.query.lang || 'en')
    try {
        const res = await axios.get(OPEN_WEATHER_API_ENDPOINT, { params: { lat, lon, appid: process.env.OPEN_WEATHER_API_KEY, units, lang } })
        response.json(res.data)
    } catch (error: any) {
        console.error(`Error fetching weather data for ${lat}, ${lon} using ${units} units (http://api.thenolle.com${request.originalUrl}): ${error.message}`)
        response.status(400).send('Error fetching weather data.')
    }
})

export default router