import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDB } from './mongoose'

import RouteMyData from './routes/my data/_'
import RouteSecrets from './routes/secrets/_'
import RouteGenerate from './routes/generate/_'
import RouteRandom from './routes/random/_'
import RouteGames from './routes/games/_'
import RouteUtils from './routes/utils/_'
import SoftwaresRoute from './routes/softwares/_'

connectDB()

//* Initialization
const app = express()
app.use(express.json())
app.use(cors({ origin: '*', credentials: true }))


//- Routes
app.use('/mydata', RouteMyData) //! My Data
app.use('/secrets', RouteSecrets) //! Secrets
app.use('/generate', RouteGenerate) //! Generate
app.use('/random', RouteRandom) //! Random
app.use('/games', RouteGames) //! Games
app.use('/utils', RouteUtils) //! Utilities
app.use('/softwares', SoftwaresRoute) //! Softwares


//= Error handling
app.use((error: Error, request: express.Request, response: express.Response, next: express.NextFunction) => {
    console.error(error.stack)
    response.status(500).send('Something broke!')
})


//! Startup
app.listen(process.env.APP_PORT, () => {
    console.clear()
    console.log(`Server listening on port ${process.env.APP_PORT}`)
})