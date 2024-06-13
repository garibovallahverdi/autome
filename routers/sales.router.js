import express from 'express'
import { getSalesAgreementById, signAgreementForBuyer, signAgreementForSaller } from '../controller/salesagrement.controllers.js'

const router = express.Router()


router.post('/seller-sign/:id',signAgreementForSaller)
router.post('/buyer-sign/:id',signAgreementForBuyer)
router.get('/getsales-agreement/:userId/:id', getSalesAgreementById)
export default router   
