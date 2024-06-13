import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const NotificationDetail = db.define('notifications-detais',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    notificationId:{
        type:DataTypes.UUID,
        allowNull: false, 
    }, 
    type:{
        type:DataTypes.STRING,
        allowNull:false
    },
    detailId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    message:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    isRead:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }
 
}
)

export default NotificationDetail