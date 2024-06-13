    import cron from 'node-cron'
    import Lot from '../models/lot.model.js'
    import { Op } from 'sequelize'
import User from '../models/user.model.js'
import notificationsService from '../services/notifications.service.js'
import { sendEmailStartLotToLotBidders } from '../configs/email.config.js'

   let lotStatusControl = cron.schedule('* * * * *',async ()=>{
    let date = new Date().toISOString()
        try { 
          //Gozlemekde olan lotlarin activ edilmesi  
         let changeStatusToActiveLots =await Lot.findAll(
            { where:
                {
             status:'scheduled',
             startTime:{ [Op.lte]:date},
            },
            include:[
                {
                    model:User,
                    as:"OwnLots",
                    attributes:["id",'email',"first_name","last_name"]
                }
            ]
        })
        if(changeStatusToActiveLots){

            const updatedActiveLots = changeStatusToActiveLots.map(async(lot)=>{
                
                lot.status='active'
                let ownerMsg = 'Sahibi olldugunuz lot artiq baslamisdir'
                await notificationsService.salesAgreementNotif({userId:lot.ownerId,message:ownerMsg,detailId:lot.id,type:'lot'})
                console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
                const findLotBidders = await User.findAll({where:{id:{[Op.in]:lot.bidders}}})
                if(findLotBidders.length > 0){
                    findLotBidders.forEach(async bidder=>{
                        let biddersMessage = `Qosludugunuz #${lot.lotNumber} nomreli  ${lot.lotName} lotu baslamisdir.`
                        await notificationsService.salesAgreementNotif({userId:bidder.id,message:biddersMessage,detailId:lot.id,type:'lot'})
                        await sendEmailStartLotToLotBidders({lot,user:bidder})
                        })
                        }
                        
                return lot.save()
            })

        const activeLots = await Promise.all(updatedActiveLots)
    }

        } catch (error) {
        //    console.log(error);
           throw new Error(error)
        }
    },{
        scheduled: false
    })


export default  lotStatusControl