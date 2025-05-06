import express from 'express'
import configRouter from './configuration.js'

const router = express.Router()

router.use('/config', configRouter)


export default router
