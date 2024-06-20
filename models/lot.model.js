import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";
import slugify from "slugify";

const Lot = db.define('lots',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
    slug:{
        type:DataTypes.TEXT,
        allowNull:false,
        unique:true
    },
    lotName:{
        type:DataTypes.STRING,
        allowNull: false, 
    },
    ownerId:{
        type:DataTypes.UUID,
        allowNull:false
    },
    ownerName:{
        type:DataTypes.STRING,
        allowNull: false, 
    },
    location:{
        type:DataTypes.STRING,
        allowNull:false
    },
    startPrice:{
        type:DataTypes.INTEGER,
        allowNull: false, 
    },
    interval:{
        type:DataTypes.INTEGER,
        defaultValue:null
    },
    image:{
        type:DataTypes.ARRAY(DataTypes.STRING),
        allowNull:false
    },
    startTime:{
        type:DataTypes.DATE,
        allowNull:false
    },

    status:{
        type:DataTypes.STRING,
        allowNull:false,
        defaultValue:'scheduled',
        validate: {
            isIn: [['scheduled', 'active', 'completed']] // Geçerli değerler
          }

    },
    detailsText:{
        type:DataTypes.TEXT,
        allowNull:false
    },
    featuresDeatils:{
        type:DataTypes.UUID,
        allowNull:false
    },
    lotNumber:{
        type:DataTypes.INTEGER,
        allowNull:false
    },
    winnerUserId:{
        type:DataTypes.UUID,
        defaultValue:null
    },
    winnerBidId:{
        type:DataTypes.UUID,
        defaultValue:null 
    },
    bidders:{
        type:DataTypes.ARRAY(DataTypes.UUID),
        defaultValue:[]
    }, 
    bidCounts:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    lotViews:{
        type:DataTypes.INTEGER,
        defaultValue:0
    },
    createdAt:{
        type:DataTypes.DATE,
        default:Date.now()
    },
    updatedAt:{
        type:DataTypes.DATE,
        default:Date.now()
    }
}, {timestamps:true},
// {
//     validate: {
//       startTimeBeforeEndTime() {
//         if (this.startTime >= this.endTime) {
//           throw new Error('Start time must be before end time');
//         }
//       }
//     }
//   },
  
)

Lot.addHook('beforeValidate',async(lot)=>{
    let slugData = slugify( `${lot.lotName}-${lot.lotNumber}`,{lower:true})
    lot.slug = slugData
})

export default Lot