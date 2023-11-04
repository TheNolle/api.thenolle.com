import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './mongoose'
import path from 'path'

import RouteHome from './routes/home'
import RouteGames from './routes/games/_'
import RouteGenerate from './routes/generate/_'
import RouteMyData from './routes/my data/_'
import RouteRandom from './routes/random/_'
import RouteSecrets from './routes/secrets/_'
import RouteSoftwares from './routes/softwares/_'
import RouteUtils from './routes/utils/_'
import RouteSwagger from './routes/swagger'


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
app.use('/', RouteHome) //! Home
app.use('/games', RouteGames) //! Games
app.use('/generate', RouteGenerate) //! Generate
app.use('/mydata', RouteMyData) //! My Data
app.use('/random', RouteRandom) //! Random
app.use('/secrets', RouteSecrets) //! Secrets
app.use('/softwares', RouteSoftwares) //! Softwares
app.use('/utils', RouteUtils) //! Utilities
app.use('/docs', RouteSwagger) //! Swagger


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