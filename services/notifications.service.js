import Notifications from "../models/notifications.model.js";
import NotificationDetail from "../models/notificattion.details.js";


class NotificationService {

  async salesAgreementNotif({userId,message,detailId,type}){
    try {
        const notification = await  Notifications.findOne({where:{userId}})
        let details = notification.content.length>0?[...notification.content]:[]
        let newDetail =''
                newDetail = await NotificationDetail.create({
                notificationId:notification.id,
                type,
                detailId,
                message
            })
        details.push(newDetail.id)
        notification.content=[...details]
        await notification.save()

        return newDetail
         
    } catch (error) {
         throw new Error(error)
    }
  }
}

export default new NotificationService()