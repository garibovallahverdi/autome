import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const Notifications = db.define('notifications',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    userId:{
        type:DataTypes.UUID,
        allowNull: false, 
    }, 
    content:{
        type:DataTypes.ARRAY(DataTypes.UUID),
        defaultValue:[]
    }
 
}
)

export default Notifications