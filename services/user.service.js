import BankCard from "../models/bank.card.model.js"
import Lot from "../models/lot.model.js"
import User from "../models/user.model.js"


class UserService {
  
   
  async updateAccountDetails(id,password,details){
    try {
      const user= await User.findOne({where:{id}})
        if(user.password == password){
           if(details.first_name){user.first_name=details.first_name}
           if(details.last_name){user.last_name=details.last_name}
           if(details.email){user.email=details.email}
           if(details.location){user.location=details.location}
        }
        await user.save()
       return user
    } catch (error) {
      throw new Error(error)      
    }
     
  }

  async addBankCard(card){
    try {
      const user= await User.findOne({where:{id:card.userId}})
      if(user){
        const newCard = await BankCard.create({...card})
        return newCard
      }else {
        throw new Error('Kart əlavə edərkən problem yaşandı.')
      }
    } catch (error) {
      console.log(error);
      throw new Error(error)
    }
  }
  async getCards(userId){
    try {
      const cards = findAll({where:{userId}})
      return cards
    } catch (error) {
      throw new Error(error)
    }
  }

  async getCardById(userId,id){
    try {
      const card = findOne({where:{id}})
      if(card.userId == userId){
        return card
      }else {
        throw new Error("Xeta bas verdi")
      }
    } catch (error) {
      throw new Error(error)
    }
  }
  async changePassword(userId,oldPassword,newPassword){
    try {
          const findUser = await User.findOne({where:{id:userId}})
          if(!findUser) {throw new Error("user does not exsist")}
          const isMatch = await bcrypt.compare(oldPassword, findUser.password)
          if(!isMatch) {throw new Error("Password does not match")}

          const salt = await bcrypt.genSalt(10)
          findUser.password = await bcrypt.hash(newPassword, salt)
          await findUser.save()
          return {message:"Password has changed"}
    } catch (error) {
        throw new Error(error)
    }
}
}

export default new UserService()