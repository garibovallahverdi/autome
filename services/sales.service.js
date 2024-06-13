import SalesAgreement from "../models/sales.agreement.model.js";
import Bid from "../models/bide.model.js";
import User from "../models/user.model.js";
import notificationsService from "./notifications.service.js";



class SalesService{

    async signAgreementForSaller(id,userId,answer){
        try {
            let messagetext =''
             const findSalesAgreement = await SalesAgreement.findOne({where:{id}})
             const findBuyer = await User.findOne({where:{id:findSalesAgreement.buyer},include:'Balance'})
             const findSaller = await User.findOne({where:{id:findSalesAgreement.saller},include:'Balance'})
             if(findSalesAgreement.status !== "pending"){throw new Error("Aktiv gozlemede olan satis yoxdur")}
              if(findSalesAgreement.sallerResponse !=null){throw new Error("Satisi artiq imzalamisiz")}
             if(userId == findSaller.id){
                 if(answer){
                     findSalesAgreement.sallerResponse = true
                        if(findSalesAgreement.buyerResponse == true){
                            findSalesAgreement.status='completed'
                        }
                        messagetext ='Satici satisi tesdqiledi'
                 }else {
                       const giveBackBidChanceCoount = await Bid.count({
                        where:{
                            lotId:findSalesAgreement.lotId,
                            userId:findBuyer.id
                        }
                       })
                       messagetext = 'Satici satisdan imtina etmisdir'
                       findSalesAgreement.sallerResponse =false
                       findSaller.Balance.fail =findSaller.Balance.fail +1
                       findSalesAgreement.status='canceled'
                       findBuyer.Balance.bidChance = findBuyer.Balance.bidChance + giveBackBidChanceCoount
                    }
                    findSalesAgreement.text =messagetext
                  const notfyToSaller = await notificationsService.salesAgreementNotif({userId:findBuyer.id,message:messagetext,detailId:findSalesAgreement.id,type:'sale-agreement'})

                    await findBuyer.Balance.save()
                    await findSaller.Balance.save()
                    await findSalesAgreement.save()
                    return findSalesAgreement
             }else {
                throw new Error("Xeta bas verdi")
             }

            
         } catch (error) {
            throw new Error(error)
         }

    }
    async signAgreementForBuyer(id,userId,answer){
        try {
            let messagetext = ''
            const findSalesAgreement = await SalesAgreement.findOne({where:{id}})
            const findBuyer = await User.findOne({where:{id:findSalesAgreement.buyer},include:'Balance'})
            const findSaller = await User.findOne({where:{id:findSalesAgreement.saller},include:'Balance'})
            if(findSalesAgreement.buyerResponse !=null){throw new Error("Satisi artiq imzalamisiz")}
            if(findSalesAgreement.status !== "pending"){throw new Error("Aktiv gozlemede olan satis yoxdur")}

            if(userId == findBuyer.id){
                if(answer){
                    findSalesAgreement.buyerResponse = true
                       if(findSalesAgreement.sallerResponse == true){
                           findSalesAgreement.status='completed'
                       }
                       messagetext ='Alici alisi tesdqiledi'
                }else {
                    messagetext = 'Alici alisdan imtina etmisdir'
                    findSalesAgreement.buyerResponse =false
                    findSalesAgreement.status='canceled'
                    findSalesAgreement.text =messagetext
                    findSaller.Balance.balanceMoney = findSaller.Balance.balanceMoney + 10
                    findBuyer.Balance.fail =findSaller.Balance.fail +1

                   

                }
                const notfyToSaller = await notificationsService.salesAgreementNotif({userId:findSaller.id,message:messagetext,detailId:findSalesAgreement.id,type:'sale-agreement'})

                await findSaller.Balance.save()
                await findBuyer.Balance.save()
                await findSalesAgreement.save()
                return findSalesAgreement
            }else {
                throw new Error("Xeta bas verdi")
             }
        } catch (error) {
            throw new Error(error)
        }
    }
    async getSalesAgreementById(id){
        try {
            const findSalesAgreement = await SalesAgreement.findOne({where:{id}})
            return findSalesAgreement
        } catch (error) {
            throw new Error(error)
        }

    }
}

export default new SalesService()