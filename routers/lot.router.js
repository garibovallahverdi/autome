import express from 'express'
import { addLot, getLotBids, getLotById, joinToLotBidders, leaveTheLotBidders, likeLot } from '../controller/lot.controller.js'
import {fileUploadMiddleware} from '../middlewares/upload.file.js'

const router = express.Router()

router.post('/add-lot', fileUploadMiddleware,addLot)
router.post('/jointo-lotbidders/:id',joinToLotBidders)
router.post('/leave-lotbidders/:id',leaveTheLotBidders)
router.get('/getlot-byid/:id',getLotById)
router.get('/getlot-bids/:id',getLotBids)
router.post('/like-lot/:id',likeLot)

export default router