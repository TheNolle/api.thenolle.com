import express from 'express'
import packageJson from '../../package.json'

const router = express.Router()

const basePath = process.env.APP_STATUS === 'development' ? 'http://localhost:25000' : 'https://api.thenolle.com'
router.get('/', (request: express.Request, response: express.Response) => {
    response.render('home', {
        api_version: packageJson.version,
        title: packageJson.displayName,
        description: packageJson.description,
        keywords: 'API, Nolly, utilities, tools, web services, RESTful API, online API, developer tools, API integration, software development, API documentation, quick utilities, fun features, API services, multi-purpose API, free API, API for developers, programming interface, tech tools, API platform, digital services, API access, API endpoints, customizable API, API solutions, tech solutions, API testing, data services, API for software, application programming interface, web development',
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