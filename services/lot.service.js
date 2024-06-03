import { Op } from "sequelize";
import Lot from "../models/lot.model.js";
import User from "../models/user.model.js";
import db from "../configs/db.config.js";
import Bid from "../models/bide.model.js";
import LotFeaturesDetails from "../models/lot.details.model.js";

class LotServices {
    async addLot(lot,featuresDeatils){
        try {
        const avialableLot = await this.getNextAvailableLot()
        const newFeaturesDeatils = await LotFeaturesDetails.create({
          ...featuresDeatils
        })
        const newLot = await Lot.create({
            lotName:lot.lotName,
            ownerId:lot.ownerId,
            ownerName:lot.ownerName,
            location:lot.location,
            startPrice:lot.startPrice,
            interval:lot.interval,
            image:[...lot.image],
            startTime:lot.startTime,
            status:lot.status,
            detailsText:lot.detailsText,
            lotNumber:avialableLot,
            featuresDeatils:newFeaturesDeatils.id
        })
        return newLot
    } catch (error) {
      console.log(error);
            // throw new Error("Lot yaradılarkən xəta baş verdi.")
            throw new Error(error)
    }
        
    }
    async deleteLot (id){
        try {
            const result = await Lot.destroy({where:{id}})
            return result > 0
        } catch (error) {
            throw new Error("Lot silinərkən xəta baş verdi. Təkrar cəhd edin")
        }
    }

    async joinToLotBidders (id,userId){
      try {
        const user = await User.findOne({where:{id:userId}})
         const lot = await Lot.findOne({where:{id}})
         if(user && lot){
            let lotBidders = lot.bidders.length>0?[...lot.bidders]:[]
            lotBidders.push(user.id)
             lot.bidders =[...lotBidders]
             await lot.save()
              user.addJoinedLots(lot)
             return lot.bidders
          }
      } catch (error) {
        console.log(error);
        throw new Error("Lota qoşularkən xəta baş verdi.")
        
      }

    }
    
    async leaveTheLotBidders (id,userId){
      const transaction = await db.transaction();

      try {
         const user = await User.findOne({where:{id:userId}})
         const lot = await Lot.findOne({where:{id}})
         if(user && lot && lot.bidders.includes(user.id)){
           let oldLotBiddersList = [...lot.bidders]
           let newLotBiddersList = oldLotBiddersList.filter(item=>item!==user.id)
           const [numOfupdatedbides,updatedBidesData] = await Bid.update({
            status:'invalid',
            removed:true
           },{
            where:{
              lotId:lot.id,
              userId:user.id
            },
            returning: true, 
            transaction
           }  
          )
          lot.bidders =[...newLotBiddersList]
          const newValidBid = await Bid.findOne({
            where:{
              lotId:lot.id,
              removed:false,
            },
            order:[['createdAt', 'DESC']]
           })
           if(newValidBid){
             newValidBid.status='valid'
             await newValidBid.save()
           }
          await lot.save()
          await transaction.commit();
          user.removeJoinedLots(lot)
          return {updatedBidesData,lotbidders:lot.bidders}
         } else {
          throw new Error("Lot üzvülüyündən imtina edərkən xəta baş verdi.")
         }
      } catch (error) {
        console.log(error);
        await transaction.rollback()
        throw new Error(error)
      }
    }

    async getAllLots(limit,offset){
        
        try {
            let where = []
            if (filters.price) {
                where.price = {
                  [Op.between]: [filters.price.min, filters.price.max],
                };
              }

            const result = await Lot.findAll({
                where,
                limit,
                offset 
            })
            
            return result
        } catch (error) {
            throw new Error("Lotların yüklənməsində xəta baş verdi.")
            
        }
    }
  async getLotById(id){
    try {
      const lot = await Lot.findOne({where:{id},
        include:[{
          model:Bid,
          as:'LotBids',
          attributes:['bidAmount'],
          include:[
            {
              model:User,
              as:'BidUser'
            }
          ]
        }]
      })
      console.log(id);
        return lot
     } catch (error) {
      console.log(error);
       throw new Error('Lot tapilmadi.')
     }
  }
  async getLotBids(id){
    try {
      const lot = await Bid.findAll({where:{
        lotId:id
      },
    include:[
       {
        model:User,
        as:'BidUser',
        attributes:['full_name','email']
      }
    ]})
    return lot
     
    } catch (error) {
      throw new Error(error)
    }
    
  }
  async likeLot(userId,id){
    try {
        const user =await User.findOne({where:{id:userId}})
        const lot = await Lot.findOne({where:{id}})
         const userLikelot = await user.hasUserLikeLots(lot)
         console.log(userLikelot);
         let message =''
          if(!userLikelot){
            await user.addUserLikeLots(lot)
            message ='Like lot'
          }else{
            await user.removeUserLikeLots(lot)
            message ='DisLike lot'

          }
          return message
    } catch (error) {
        throw new Error(error)
    }
  }

    async getNextAvailableLot() {
        const lots = await Lot.findAll({
          attributes: ['lotNumber'],
          order: [['lotNumber', 'ASC']],
        });
    
        let nextLot = 1;
        for (const lot of lots) {
          if (lot.lotNumber === nextLot) {
            nextLot++;
          } else {
            break;
          }
        }
    
        return nextLot;
      }
}

export default new LotServices()