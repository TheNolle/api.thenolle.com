import express from 'express'

import Route1 from './mycurrentproject'
import Route2 from './socials'

const router = express.Router()

router.use('/mycurrentproject', Route1)
router.use('/socials', Route2)

export default router