import express from 'express'
import { addBid, getUserBids, toCancelTheBid } from '../controller/bide.controller.js'

const router = express.Router()

router.post('/add-bid/:id',addBid)
// router.post('/cancel-thebide/:id',toCancelTheBid)
router.get('/getuser-allbids/:id',getUserBids)

export default router   