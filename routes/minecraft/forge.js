import { Router } from 'express'

const router = Router()

router.get('/:version/:buildNumber', async (request, response) => {
    return response.redirect(`https://maven.minecraftforge.net/net/minecraftforge/forge/${request.params.version}-${request.params.buildNumber}/forge-${request.params.version}-${request.params.buildNumber}-installer.jar`)
})

export default router
