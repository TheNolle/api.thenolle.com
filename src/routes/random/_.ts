import express from 'express'

import Route1 from './user'
import Route2 from './fact'
import Route3 from './quote'

const router = express.Router()

router.use('/user', Route1)
router.use('/fact', Route2)
router.use('/quote', Route3)

export default router