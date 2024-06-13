import { Sequelize, DataTypes } from "sequelize";
import db from "../configs/db.config.js";
import UserBalance from "./user.balance.js";

const User = db.define('users',
    {
        id: {
          type: DataTypes.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: false
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fullname: {
            type: DataTypes.STRING,
            allowNull:true
          
          },
        phoneNumber: {
          type: DataTypes.STRING,
          default: null
        },
        location: {
          type: DataTypes.STRING,
          defaultValue: null
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING,
          allowNull: true
        },
        resetPasswordToken: {
          type: DataTypes.STRING,
          allowNull: true
        },
        googleId: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: true
        },
        resetPasswordExpires: {
          type: DataTypes.DATE,
          allowNull: true
        },
        confirmed: {
          type: DataTypes.BOOLEAN,
          default: false
        },
        verifyToken: {
          type: DataTypes.STRING,
          allowNull: true
        },
        verifyTokenExpires: {
          type: DataTypes.DATE,
          allowNull: true
        }
      },
      {
        hooks: {
          beforeCreate: user => {
            user.fullname = `${user.first_name} ${user.last_name}`;
            user.verifyTokenExpires  = new Date(new Date().getTime() + 2 * 60000) // 2 dəqiqə
          }
        }
      }
)

User.afterCreate(async (user, options) => {
    await UserBalance.create({ userId: user.id });
  });

export default User