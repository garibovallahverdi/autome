import cron from 'node-cron'
import Lot from '../models/lot.model.js'
import { Op } from 'sequelize'
import User from '../models/user.model.js'
import notificationsService from '../services/notifications.service.js'
import { sendEmailStartLotToLotBidders } from '../configs/email.config.js'
import Bid from '../models/bide.model.js'

let checkEmtyLot = cron.schedule('* * * * *',async ()=>{
let date = new Date().toISOString()

try {
    const oneHourAgo = new Date(Date.now() - 3* 5 * 60 * 60 * 1000);
    const lots = await Lot.findAll({
        where: {
            startTime: {
                [Op.lt]: oneHourAgo // 1 saat önceki zamanı kontrol et
            },
            status:'active',
            bidCounts:0

        },
       
    });
     if(lots.length > 0 && lots){
         for(const lot of lots){
            let ownerMsg = `${lot.lotNumber} nomreli ${lot.lotName} lotunuz 3 gun erzinde teklif almadigi ucun bitmisdir`
                await notificationsService.salesAgreementNotif({userId:lot.ownerId,message:ownerMsg,detailId:lot.id,type:'lot'})
                lot.status= 'completed'
                await lot.save()
        }
     }
    // console.log(lots,"Emty lots");
}catch(err){
   console.log(err);
}

},{
    scheduled: false
})


export default  checkEmtyLot