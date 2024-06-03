import db from "../configs/db.config.js";
import Bid from "../models/bide.model.js";
import Lot from "../models/lot.model.js";
import User from "../models/user.model.js";


class BidServices{

    async addBid (bid){
      const transaction = await db.transaction();
        try { 
            const lot = await Lot.findOne({where:{id:bid.lotId}})
              if(lot.status!=='active'){throw new Error("Lot activ deyil")}
             let lotBidders = [...lot.bidders]

              if(lotBidders.includes(bid.userId)){
                    
                const maxBid = await Bid.findOne({
                  where:{
                    lotId:lot.id,
                  },
                  order:[['bidAmount','DESC']]
                })
                if(!maxBid || maxBid.bidAmount<bid.bidAmount){

                 const [numOfupdatedbides,updatedBidesData] = await Bid.update(
                  {status:'invalid'},
                  {
                    where:{
                      lotId:lot.id,
                      status:'valid'
                      
                    },
                    returning: true, 
                    transaction
                  }
                )
                const newBid = await Bid.create({
                  ...bid 
               })
               await transaction.commit();
                return {newBid ,updatedBidesData}
              }else {
                throw new Error(`Ən yüksək təklif məbləğindən aşağı təklif verə bilməzsiniz. Ən yuksək təklif ${maxBid.bidAmount}`)
              }
              }else {
                throw new Error(`Təklif verə bilməyiniz üçün ${lot.lotName} lotunda iştirakçı formunu doldurmalsız`)
              }
        } catch (error) {
            await transaction.rollback();
            throw new Error(error)
        }

    }
    // async toCancelTheBid (id,userId){
    //   try {
    //      const bid = await Bid.findOne({where:{id:id,status:'valid'}})
    //      if(!bid){ throw new Error('Təklif tapilmadi!')}

    //       const lot = await Lot.findOne({where:{id:bid.lotId}})
    //       console.log("AAA",bid.status);
    //       if(bid.userId != userId){throw new Error('Bu təklifi silə bilməzsiz!') }
    //       if(bid.status ==='valid'  && lot){
    //          const newValidBid = await Bid.findOne({
    //           where:{
    //             lotId:lot.id,
    //             removed:false,
    //             status:'invalid'
    //           },
    //           order:[['createdAt', 'DESC']]
    //          })
    //          if(newValidBid){
    //            newValidBid.status='valid'
    //            await newValidBid.save()
    //          }
    //          bid.status='invalid'
    //          bid.removed = true
    //          await bid.save()
    //          return {bid,newValidBid}
    //       }else {
    //       }
    //   } catch (error) {
    //      throw new Error(error.message)
    //   }
    // }

    async getUserBids(id){
      try {
          const user = await User.findOne({where:{id}})
          if(user){
            const userBids = await Bid.findAll({
              where:{userId:user.id},
              include:[{
                model:Lot,
                as:'LotBids',
                attributes:['lotName','lotNumber','status']
              }]
            })
            return userBids
          }else {
            throw new Error('İstifadəçi tapılmadı.')
          }
      } catch (error) {
        throw new Error(error)
      }
    }
}

export default new BidServices()