import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import { Server } from 'socket.io'
import http from 'http'
import dotenv from 'dotenv'
import db from './configs/db.config.js'
import AuthRouter from './routers/auth.router.js'
import UserRouter from './routers/user.router.js'
import LotRouter from './routers/lot.router.js'
import BidRouter from './routers/bide.router.js'
import lotStatusControl from './middlewares/lot.schedule.status.js'
import ModelRelations from './middlewares/model.realtions.js'
import SalesRouter from './routers/sales.router.js'
import checkEmtyLot from './middlewares/checklotbidesisEmpty.js'
import session from 'express-session'
import passport from 'passport'
const app =express()

dotenv.config() 
// app.use('/lot/add-lot',  express.static(path.join('tempdirectory')))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
     saveUninitialized: true,
     cookie: { secure: false } //
  }));
  app.use(passport.initialize());
app.use(passport.session());

app.use(cors())
app.use(bodyParser.json({limit:"60mb"}))
app.use(bodyParser.urlencoded({limit:"60mb",extended:true}))


app.use('/auth',AuthRouter)
app.use('/users',UserRouter)
app.use('/lot',LotRouter)
app.use('/bid',BidRouter)
app.use('/agreements',SalesRouter)


app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });

const server =http.createServer(app)

export const io = new Server(server,{ 
    cors:{
        origin:'http://localhost:9000',
        methods:['GET','POST']
    }
})

io.on('connection',(socket)=>{
    console.log('Connection');
  
    socket.on('joinLot', (lotNumber) => {
        socket.join(`lot_${lotNumber}`);
        console.log(`İstemci ${socket.id} lot_${lotNumber} odasına katıldı`);
      });

      socket.on('newBid',(data)=>{
        console.log(data,"Bide geldi");
      })
      socket.on('disconnect', () => {
        console.log('İstemci bağlantısı kapandı:', socket.id);
      });
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
        lotStatusControl.start()
        checkEmtyLot.start()
        console.log(`Server is runing ${process.env.PORT} port...`);
        
    } catch (error) {
        console.log(error);
    } 
})
