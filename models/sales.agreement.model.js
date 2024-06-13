import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const SalesAgreement = db.define('sales-agreement',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    lotId:{
        type:DataTypes.UUID,
        allowNull: false, 
    }, 

    saller:{
        type:DataTypes.UUID,
        allowNull:false
    },
    sallerResponse:{
      type:DataTypes.BOOLEAN,
      defaultValue:null
    },
    buyer:{
        type:DataTypes.UUID,
        allowNull:false
    },
    buyerResponse:{
        type:DataTypes.BOOLEAN,
        defaultValue:null
      },
    status:{
        type:DataTypes.STRING,
        defaultValue:'pending',
        validate: {
            isIn: [['pending', 'canceled', 'completed']] // Geçerli değerler
          },
  
    },
    endPrice:{
      type:DataTypes.STRING,
      allowNull:false
    },
    text:{
      type:DataTypes.TEXT,
      defaultValue:'Satis gozlemededir'
    }
 
}
)

export default SalesAgreement