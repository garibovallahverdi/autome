import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const UserBalance = db.define('user-balance',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    userId:{
        type:DataTypes.UUID,
        allowNull: false, 
    }, 
    bidChance:{
        type:DataTypes.INTEGER,
        defaultValue:100,
    },
    balanceMoney:{
        type:DataTypes.STRING,
        defaultValue:100
    },
    fail:{
        type:DataTypes.INTEGER,
        defaultValue:0
    }
 
}
)

export default UserBalance