import express from 'express'

import Route1 from './image'

const router = express.Router()

router.use('/image', Route1)

export default router