import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";

const User = db.define('users',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    first_name:{
        type:DataTypes.STRING,
        allowNull: false, 
    }, 
    last_name:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    location:{
        type:DataTypes.STRING,
        defaultValue:null
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false, 
        unique:true
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false
    },
    phone_number:{
        type:DataTypes.STRING,
        allowNull: false, 
    },
}
)

export default User