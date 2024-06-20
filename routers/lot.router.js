import express from 'express'
import { addLot, getAllLot, getLotBids, getLotById, joinToLotBidders, leaveTheLotBidders, likeLot, sellLot } from '../controller/lot.controller.js'
import {fileUploadMiddleware} from '../middlewares/upload.file.js'
import  fs from 'fs'

const router = express.Router()

router.post('/add-lot', fileUploadMiddleware,addLot)
router.post('/jointo-lotbidders/:id',joinToLotBidders)
router.get('/getall-lots',getAllLot)
router.post('/leave-lotbidders/:id',leaveTheLotBidders)
router.get('/getlot-byid/:id',getLotById)
router.get('/getlot-bids/:id',getLotBids)
router.post('/like-lot/:id',likeLot)
router.post('/sell-lot',sellLot)


export default router