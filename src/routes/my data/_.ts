import express from 'express'

import Route1 from './mycurrentproject'

const router = express.Router()

router.use('/mycurrentproject', Route1)

export default router