import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const Bid = db.define('bides',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    userId:{
        type:DataTypes.UUID,
        allowNull: false, 
    },
    lotId:{
        type:DataTypes.UUID,
        allowNull: false, 
    },
    bidAmount:{
        type:DataTypes.DOUBLE,
        allowNull:false
    },
    removed:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    },
    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'valid',
        validate: {
            isIn: [['valid', 'invalid','winner']] // Geçerli değerler
          }

    },
    createdAt:{
        type:DataTypes.DATE,
        default:Date.now()
    },
    updatedAt:{
        type:DataTypes.DATE,
        default:Date.now()
    }
}
)

export default Bid