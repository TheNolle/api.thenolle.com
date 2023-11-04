import 'dotenv/config'
import packageJson from '../package.json'
import express from 'express'
import cors from 'cors'
import { connectDB } from './mongoose'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import { getAbsoluteFSPath } from 'swagger-ui-dist'

import RouteMyData from './routes/my data/_'
import RouteSecrets from './routes/secrets/_'
import RouteGenerate from './routes/generate/_'
import RouteRandom from './routes/random/_'
import RouteGames from './routes/games/_'
import RouteUtils from './routes/utils/_'
import SoftwaresRoute from './routes/softwares/_'


//+ Database connection
connectDB()

//* Initialization
const app = express()
app.use(express.json())
app.use(cors({ origin: '*', credentials: true }))
app.use(express.static(path.join(__dirname, 'assets')))
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))


//- Routes
app.use('/mydata', RouteMyData) //! My Data
app.use('/secrets', RouteSecrets) //! Secrets
app.use('/generate', RouteGenerate) //! Generate
app.use('/random', RouteRandom) //! Random
app.use('/games', RouteGames) //! Games
app.use('/utils', RouteUtils) //! Utilities
app.use('/softwares', SoftwaresRoute) //! Softwares


//? Swagger
const basePath = process.env.APP_STATUS === 'development' ? 'http://localhost:25000' : 'https://api.thenolle.com'
app.get('/docs', (request: express.Request, response: express.Response) => {
    response.render('swagger', {
        title: `${packageJson.displayName} - Documentation`,
        description: packageJson.description,
        keywords: 'api, documentation, swagger, nolly, thenolle',
        theme_color: '#ff88ff',
        author: 'Nolly',
        og_image: `${basePath}/og-image.png`,
        site_url: `${basePath}/docs`,
        twitter_handle: '@TheNolly_',
        favicon: `${basePath}/favicon.ico`,
        cssUrl: `${basePath}/styles.min.css`,
        swaggerSpecUrl: `${basePath}/swagger.json`,
    })
})
app.get('/swagger.json', (request: express.Request, response: express.Response) => {
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
        apis: [path.join(__dirname, 'routes', '**', '*.ts')],
    }))
})
app.use('/swagger-ui', express.static(getAbsoluteFSPath()))


//= Error handling
app.use('*', (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.error(error.stack)
    response.status(500).send('Something broke!')
})


//! Startup
app.listen(process.env.APP_PORT, () => {
    console.clear()
    console.log(`Server listening on port ${process.env.APP_PORT} (url: http://localhost:${process.env.APP_PORT})`)
})