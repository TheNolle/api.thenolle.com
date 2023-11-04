import express from 'express'
import swaggerJSDoc from 'swagger-jsdoc'
import { getAbsoluteFSPath } from 'swagger-ui-dist'
import path from 'path'
import packageJson from '../../package.json'

const router = express.Router()

const basePath = process.env.APP_STATUS === 'development' ? 'http://localhost:25000' : 'https://api.thenolle.com'
router.get('/', (request: express.Request, response: express.Response) => {
    response.render('swagger', {
        api_version: packageJson.version,
        title: packageJson.displayName,
        description: packageJson.description,
        keywords: 'api, documentation, swagger, nolly, thenolle',
        theme_color: '#ff88ff',
        author: 'Nolly',
        og_image: `${basePath}/og-image.png`,
        site_url: basePath,
        docs_url: `${basePath}/docs`,
        github_url: packageJson.repository.url,
        twitter_handle: '@TheNolly_',
        favicon: `${basePath}/favicon.ico`,
        swagger_spec_url: `${basePath}/docs/swagger.json`,
    })
})
router.get('/swagger.json', (request: express.Request, response: express.Response) => {
    response.setHeader('Content-Type', 'application/json')
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.send(swaggerJSDoc({
        definition: {
            openapi: '3.0.0',
            info: {
                title: `${packageJson.displayName} - Documentation`,
                version: packageJson.version,
                description: packageJson.description,
            },
            servers: [
                { description: 'Production Server', url: 'https://api.thenolle.com', },
                { description: 'Development Server', url: 'http://localhost:25000', },
            ],
        },
        apis: [path.join(__dirname, '../', 'routes', '**', '*.ts')],
    }))
})
router.use('/swagger-ui', express.static(getAbsoluteFSPath()))

export default router