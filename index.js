import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import db from './configs/db.config.js'
import UserRouter from './routers/user.router.js'
import LotRouter from './routers/lot.router.js'
import BidRouter from './routers/bide.router.js'
import task from './middlewares/lot.schedule.status.js'
import ModelRelations from './middlewares/model.realtions.js'
import { fileDelete } from './middlewares/upload.file.js'
const app =express()

dotenv.config() 

app.use(cors())
app.use(bodyParser.json({limit:"60mb"}))
app.use(bodyParser.urlencoded({limit:"60mb",extended:true}))
app.use('/users',UserRouter)
app.use('/lot',LotRouter)
app.use('/bid',BidRouter)

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

const server =http.createServer(app)

const io = new Server(server,{ 
    cors:{
        origin:'http://localhost:3000',
        methods:['GET','POST']
    }
})
app.set('io', io);

io.on('connection',(socket)=>{
    console.log('Connection');
  
    socket.on('newLot',(newLot)=>{ 
        console.log( newLot);
    })
})

server.listen(process.env.PORT,async()=>{
    try {
        await db.authenticate()
        ModelRelations() 
        db.sync({
            // force:true   
        }).then(()=>{ 
            console.log("Sync");
        }) 
        task.start()
        console.log(`Server is runing ${process.env.PORT} port...`);
        
    } catch (error) {
        console.log(error);
    }
})
