import { Router } from 'express'
import { PaperMC } from '../../functions/minecraft.utils.js'

const router = Router()

router.get('/', async (request, response) => {
    return response.redirect('/minecraft/velocity/latest')
})

router.get('/latest', async (request, response) => {
    const velocity = new PaperMC('velocity')
    const version = await velocity.getLatestVersion()
    if (!version) return response.status(404).send('Not found')
    const buildNumber = await velocity.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await velocity.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    response.redirect(url)
})

router.get('/:version', async (request, response) => {
    return response.redirect(`/minecraft/velocity/${request.params.version}/latest`)
})

router.get('/:version/latest', async (request, response) => {
    const velocity = new PaperMC('velocity')
    const versions = await velocity.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return velocity.notFound(response, 'Version not found')
    const buildNumber = await velocity.getLatestBuildNumber(version)
    if (!buildNumber) return response.status(404).send('Not found')
    const url = await velocity.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

router.get('/:version/:buildNumber', async (request, response) => {
    const velocity = new PaperMC('velocity')
    const versions = await velocity.getVersions()
    const version = versions.includes(request.params.version) ? request.params.version : null
    if (!version) return velocity.notFound(response, 'Version not found')
    const buildNumbers = await velocity.getBuildNumbers(version)
    const buildNumber = buildNumbers.includes(parseInt(request.params.buildNumber)) ? parseInt(request.params.buildNumber) : null
    if (!buildNumber) return velocity.notFound(response, 'Build number not found')
    const url = await velocity.finalURL(version, buildNumber)
    if (!url) return response.status(404).send('Not found')
    return response.redirect(url)
})

export default router
