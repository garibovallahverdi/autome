    import cron from 'node-cron'
    import Lot from '../models/lot.model.js'
    import { Op } from 'sequelize'

   let task = cron.schedule('* * * * *',async ()=>{
    let date = new Date().toISOString()
        try {
          //Gozlemekde olan lotlarin activ edilmesi  
         let changeStatusToActiveLots =await Lot.findAll(
            { where:
                {
             status:'scheduled',
             startTime:{ [Op.lte]:date},
             endTime:{[Op.gt]:date}
                
            }})

          const updatedActiveLots = changeStatusToActiveLots.map(async(lot)=>{
           const updatedLot = {
                lotId:lot.id,
                lotStatus:'active'
             }
             lot.status='active'
             return lot.save()
          })
      const activeLots = await Promise.all(updatedActiveLots)


        //   Vaxti bitmis activ lotlarin deactiv edilmesi

        let changeStatusToCompletedLots =await Lot.findAll(
            { where:
                {
             status:'active',
             endTime:{ [Op.lte]:date},
            }})

            const updatedCOmpletedLots = changeStatusToCompletedLots.map(async(lot)=>{
                const updatedLot = {
                     lotId:lot.id,
                     lotStatus:'completed'
                  }
                  lot.status='completed'
                  return lot.save()
               })
             const completeLots = await Promise.all(updatedCOmpletedLots)

        } catch (error) {
           console.log(error);
        }
    },{
        scheduled: false
    })


export default  task