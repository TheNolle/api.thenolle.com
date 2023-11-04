import 'dotenv/config'
import packageJson from '../package.json'
import express from 'express'
import cors from 'cors'
import { connectDB } from './mongoose'
import path from 'path'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

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


//- Routes
app.use('/mydata', RouteMyData) //! My Data
app.use('/secrets', RouteSecrets) //! Secrets
app.use('/generate', RouteGenerate) //! Generate
app.use('/random', RouteRandom) //! Random
app.use('/games', RouteGames) //! Games
app.use('/utils', RouteUtils) //! Utilities
app.use('/softwares', SoftwaresRoute) //! Softwares


//? Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: `${packageJson.displayName} - Documentation`,
            version: packageJson.version,
            description: `${packageJson.description}<br>Here are some useful links: <ul><li><a href='https://discord.com/invite/86yVsMVN9z' target='_blank'>Support Server</a></li><li><a href='https://github.com/thenolle/api.thenolle.com' target='_blank'>GitHub Repository</a></li>`,
        },
        servers: [
            {
                description: 'Production Server',
                url: 'https://api.thenolle.com',
            },
            {
                description: 'Development Server',
                url: 'http://localhost:25000',
            },
        ],
    },
    apis: [path.join(__dirname, 'routes', '**', '*.ts')],
}
app.use('/',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(
        swaggerJSDoc(swaggerOptions),
        {
            customCssUrl: '/styles.min.css',
            customfavIcon: 'favicon.ico',
        }
    )
)


//= Error handling
app.use('*', (error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.error(error.stack)
    response.status(500).send('Something broke!')
})


//! Startup
app.listen(process.env.APP_PORT, () => {
    console.clear()
    console.log(`Server listening on port ${process.env.APP_PORT} (url: http://localhost:${process.env.APP_PORT})`)
    console.log(JSON.stringify(swaggerJSDoc(swaggerOptions), null, 2))
})