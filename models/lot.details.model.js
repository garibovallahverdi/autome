import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const LotFeaturesDetails = db.define('lot-features-details',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      manufacturer :{// istehsalci *****
        type:DataTypes.STRING,
         allowNull:false
       }, 
      brand:{ //****** */
        type:DataTypes.STRING,  
        allowNull:false 
      },
      model:{//*********** */
        type:DataTypes.STRING,
         allowNull:false
       },
       year:{//******** */
        type:DataTypes.STRING,
         allowNull:false
       },
       vehicleType:{//sedan/jeep, ve.s ******
        type:DataTypes.STRING,
         allowNull:false
       },
       color:{ // rengi ******
        type:DataTypes.STRING,
         allowNull:false
       },
       mileage:{ // qet edilen mesafe ***
        type:DataTypes.STRING,
         allowNull:false
       },
      engineCapacity:{// mator hecmi ***
         type:DataTypes.STRING,
          allowNull:false
        },
      carSegments:{// keyfiyet gostericilerine gore masinin categoriyasi, luks, ekonom, ve.s ***
         type:DataTypes.STRING,
          allowNull:false
        }, 
      driveType:{// on ceker yoxsa arxa ceker oldugu, ***
         type:DataTypes.STRING,
          allowNull:false
        }, 
      engine:{// mator gucu ***
         type:DataTypes.STRING,
          allowNull:false
        },
      transmission:{// kecirici muherrikin novu, skoros/ ***
         type:DataTypes.STRING,
          allowNull:false
        }, 
      fuelType:{//yanacaq novu ***************
         type:DataTypes.STRING,
          allowNull:false
        },
     
      brakeSystem:{// eylec sistemi
         type:DataTypes.STRING,
          allowNull:false
        },
},{timestamps:false}
)

export default LotFeaturesDetails