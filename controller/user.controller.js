import Notifications from "../models/notifications.model.js"
import userService from "../services/user.service.js"


export const updateAccountDetails = async (req,res,next)=>{
    const {id} =req.params
    const {first_name,last_name,email,location, password} =req.body

    try {
        const details = {
            first_name,
            last_name,
            email,
            location
        }
        const result = await userService.updateAccountDetails(id,password,details)

        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const addBankCart=async (req,res,next)=>{
     const {id} =req.params
    const {cardHolderName,cardNumber,CVV,expiryDate} =req.body
    try {
        const card ={
            userId:id,
            cardHolderName,
            cardNumber,
            CVV,
            expiryDate
        }
        const result =await userService.addBankCard(card)
       res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const getCards = async (req,res,next)=>{
    const {userId} = req.params
    try {
        const result = await userService.getCards(userId)
        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}


export const getCardById = async (req,res,next)=>{
    const {id} = req.params
    const {userId} =req.body
    try {
        const result = await userService.getCardById(userId,id)
        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const getNotification = async(req,res,next)=>{
    const {id} =req.params

    try {
        const notfication = await Notifications.findOne({where:{userId:id},include:"Detail"})
        res.status(200).json(notfication)
    } catch (error) {
        console.log(error);
        next(error)
    }
}

export const changePassword = async (req,res,next)=>{
    const {userId,oldPasswrd,newPassword} =req.body
    try {
        const result =await userService.changePassword(userId,oldPasswrd,newPassword)

        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}