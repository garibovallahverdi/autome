import { Sequelize } from "sequelize";
import dotenv from "dotenv"
dotenv.config()
const db = new Sequelize(process.env.DB_CONNECTION_STRING)

export default db 