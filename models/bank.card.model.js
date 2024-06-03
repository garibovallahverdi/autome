import { DataTypes, Sequelize } from "sequelize";
import db from "../configs/db.config.js";
import dotenv from 'dotenv'
import crypto from 'crypto'

dotenv.config()
const secretKey =crypto.randomBytes(32)
const encrypt = (text) => {
    const iv = crypto.randomBytes(16); // Initialization vector
    const cipher = crypto.createCipheriv(process.env.BANK_CARD_HASH_ALGORITM_KEY, Buffer.from(secretKey), iv);
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex');
  };

const decrypt = (hash) => {
    const parts = hash.split(':');
    const iv = Buffer.from(parts.shift(), 'hex');
    const encryptedText = Buffer.from(parts.join(':'), 'hex');
    const decipher = crypto.createDecipheriv(process.env.BANK_CARD_HASH_ALGORITM_KEY, Buffer.from(secretKey), iv);
    const decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
  };
const BankCard = db.define('bankcards',{
    id: {
        type: DataTypes.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

    userId:{
        type:DataTypes.UUID,
        allowNull: false, 
    },
    cardHolderName: {
        type: DataTypes.STRING,
        allowNull: false
      },
    cardNumber:{
        type:DataTypes.STRING,
        allowNull:false,
        set(value) {
            const encryptedValue = encrypt(value);
            this.setDataValue('cardNumber', encryptedValue);
          }

    },
    CVV:{
        type:DataTypes.STRING,
        allowNull:false,
        set(value) {
            const encryptedValue = encrypt(value);
            this.setDataValue('CVV', encryptedValue);
          }

    },
     expiryDate: {
        type: DataTypes.STRING,
        allowNull: false
      },

 
},
{
    instanceMethods: {
      getDecryptedCardNumber() {
        return decrypt(this.cardNumber);
      },
      getDecryptedCardCVV() {
        return decrypt(this.CVV);
      }
    }
}
)

export default BankCard