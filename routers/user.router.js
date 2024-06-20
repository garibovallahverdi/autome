import express from 'express'
import { addBankCart, changePassword, getCardById, getCards, getNotification, updateAccountDetails } from '../controller/user.controller.js'

const router = express.Router()

// router.get('/get-lots/:id',getuserLots)
router.post('/update-account-details/:id',updateAccountDetails)
router.post('/add-card/:id',addBankCart)
router.post('/get-cards/:userId',getCards)
router.post('/get-card-byid/:id',getCardById)
router.get('/get-notification/:id', getNotification)
router.post('change-password',changePassword)
export default router 