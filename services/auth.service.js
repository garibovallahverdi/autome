import { Op } from "sequelize";
import { confirmAccountEmail, resePasswordMail } from "../configs/email.config.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Notifications from "../models/notifications.model.js";

// const token = crypto.randomBytes(20).toString('hex')
// const salt = await bcrypt.genSalt(10)
// const hashPassword = await bcrypt.hash(user.password,salt)
//     createAccount.verifyToken =token
//     createAccount.verifyTokenExpires =Date.now() + 3600000

class AuthService {

    async register(user){
        try {
        const isEmailExsist = await User.findOne({where:{email:user.email,confirmed:true}})
        const isEmailExsistConfirmedFalse = await User.findOne({where:{email:user.email,confirmed:false}})

        if(isEmailExsist){throw new Error("Email already does exsist.")}
        const token = crypto.randomBytes(20).toString('hex')
         let email = ''
        if(isEmailExsistConfirmedFalse){
            isEmailExsistConfirmedFalse.verifyToken =token
            isEmailExsistConfirmedFalse.verifyTokenExpires =Date.now() + 3600000
            email = isEmailExsistConfirmedFalse.email
            await confirmAccountEmail(email,token)
            await isEmailExsistConfirmedFalse.save()
            return {message:"Mail yeniden gonderildi"}
        }
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(user.password,salt)
        const newUser = await User.create({
            first_name:user.first_name,
            last_name:user.last_name,
            email:user.email,
            password:hashPassword,
            confirmed:false
            
        })
        newUser.verifyToken =token
        newUser.verifyTokenExpires =Date.now() + 3600000
        email = newUser.email
        await confirmAccountEmail(email,token)

        await newUser.save()
        return {message:'hesab yaradildi, tesdiqleme maili gonderildi'}
        
       } catch (error) {
        throw new Error(error)
       }
      
             

    }

    async accountConfirmed(token){
  
        try {
            const confirmedUser =await User.findOne({
                where:{
                    verifyToken:token,
                    verifyTokenExpires:{[Op.gt]:Date.now()}
        
                }
            })

            if(confirmedUser){
                confirmedUser.confirmed =true
                confirmedUser.verifyToken =null
                confirmedUser.verifyTokenExpires =null
                const notif = await Notifications.create({userId:confirmedUser.id})
                await confirmedUser.save()
                return {status:true,message:'Hesab tesdiqlendi',user:confirmedUser}
             
            }else {
                throw new Error('TokenExpiredError')
            }
        } catch (error) {
            throw new Error(error)
        }
    } 

    async forgotPassword(email){
        const findUser = User.findOne({where:{email:email}})
        try {
               if(!findUser){throw new Error("User does not exsist")}

               const token = crypto.randomBytes(20).toString('hex')
               findUser.resetPasswordToken = token
               findUser.resetPasswordExpires = Date.now() + 3600000
               const emailResult = await resePasswordMail(email,token)
               if(emailResult.status){
                await findUser.save()
                return{ message:"Mail gonderildi"}
               }else {
                throw new Error(emailResult.error)
               }

        } catch (error) {
            throw new Error(error)
        }
    }
    async verifyForgetPassword (token){
        try {
            const user = await User.findOne({
                where: {
                    resetPasswordToken: token,
                    resetPasswordExpires: { [Op.gt]: Date.now() }
                }
              })
          
              if (!user) {
                throw new Error("TokenExpiredError")
              }
          
             
              return user
        } catch (error) {
            throw new Error(error)            
        }
    }
    async resetPassword(token,password){
        try {
            const user = await User.findOne({
                where: {
                  resetPasswordToken: token,
                  resetPasswordExpires: { [Op.gt]: Date.now() }
                }
              })
              if (!user) {
                 throw new Error({ message: 'Invalid or expired token.' })
              }
              const salt = await bcrypt.genSalt(10)
              user.password = await bcrypt.hash(password, salt)
              user.resetPasswordToken = null
              user.resetPasswordExpires = null
              await user.save()
              return    {message:"Password has been reset"}
        } catch (error) {
            throw new Error(error)
        }
    }
  
}

export default new AuthService()