import express from 'express'
import packageJson from '../../package.json'

const router = express.Router()

const basePath = process.env.APP_STATUS === 'development' ? 'http://localhost:25000' : 'https://api.thenolle.com'
router.get('/', (request: express.Request, response: express.Response) => {
    response.render('home', {
        api_version: packageJson.version,
        title: packageJson.displayName,
        description: packageJson.description,
        keywords: 'api, documentation, nolly, thenolle',
        theme_color: '#ff88ff',
        author: 'Nolly',
        og_image: `${basePath}/og-image.png`,
        site_url: `${basePath}`,
        docs_url: `${basePath}/docs`,
        github_url: packageJson.repository.url,
        twitter_handle: '@TheNolly_',
        favicon: `${basePath}/favicon.ico`,
        css_base_url: basePath,
    })
})

export default router