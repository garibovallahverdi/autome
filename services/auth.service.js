import { Op } from "sequelize";
import { confirmAccountEmail } from "../configs/email.config.js";
import User from "../models/user.model.js";
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import Notifications from "../models/notifications.model.js";


class AuthService {

    async register(user){
        try {
            const isEmailExsist = await User.findOne({where:{email:user.email}})

            if(isEmailExsist){throw new Error("Email has registered. Try login")}
            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(user.password,salt)
            const createAccount = await User.create({
                first_name:user.first_name,
                last_name:user.last_name,
                email:user.email,
                password:hashPassword,
                confirmed:false
            })
            const token = crypto.randomBytes(20).toString('hex')
            createAccount.verifyToken =token
            createAccount.verifyTokenExpires =Date.now() + 3600000

            const mailResult = await confirmAccountEmail(createAccount.email,token)
            if(mailResult.status == true){

                await createAccount.save()
                return mailResult.result
            }else {
                await createAccount.destroy()
                return mailResult.error
            }
             
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
}

export default new AuthService()