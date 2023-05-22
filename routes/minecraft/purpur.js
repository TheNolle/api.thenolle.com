import { Router } from 'express'
import { PurpurMC } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/', async (request, response) => {
    return response.redirect('/minecraft/purpur/latest')
})

router.get('/latest', async (request, response) => {
    const purpur = new PurpurMC()
    const version = await purpur.getLatestVersion()
    if (!version) return response.status(404).send('Not found')
    const buildNumber = await purpur.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await purpur.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    response.redirect(url)
})

router.get('/:version', async (request, response) => {
    return response.redirect(`/minecraft/purpur/${request.params.version}/latest`)
})

router.get('/:version/latest', async (request, response) => {
    const purpur = new PurpurMC()
    const versions = await purpur.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return purpur.notFound(response, 'Version not found')
    const buildNumber = await purpur.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await purpur.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

router.get('/:version/:buildNumber', async (request, response) => {
    const purpur = new PurpurMC()
    const versions = await purpur.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return purpur.notFound(response, 'Version not found')
    const buildNumbers = await purpur.getBuildNumbers(version)
    const buildNumber = buildNumbers.includes(parseInt(request.params.buildNumber)) ? parseInt(request.params.buildNumber) : null
    if (!buildNumber) return purpur.notFound(response, 'Build number not found')
    const url = await purpur.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

export default router
