import express from 'express'
import { getuserLots, register } from '../controller/auth.controller.js'
import { addBankCart, getCardById, getCards, updateAccountDetails } from '../controller/user.controller.js'

const router = express.Router()

router.post('/register',register)
router.get('/get-lots/:id',getuserLots)
router.post('/update-account-details/:id',updateAccountDetails)
router.post('/add-card/:id',addBankCart)
router.post('/get-cards/:userId',getCards)
router.post('/get-card-byid/:id',getCardById)
export default router 