import { io } from "../index.js";
import { localToUTC } from "../middlewares/timezone.js";
import { fileDelete, resizeFiles } from "../middlewares/upload.file.js";
import lotService from "../services/lot.service.js";

export const addLot =async (req,res,next)=>{
    const files =[]
    let delfiles = []
    const io =req.app.get('io')
    // console.log(req.processedFiles);
    req.files.lotImages.forEach(element => {
        files.push(element.filename)
        });
    const result = await resizeFiles(files)
     console.log(result);
           try {
            const today = new Date()
          const startTime = localToUTC(req.body.startTime)
          const startDate = new Date(startTime)

       if(today.getTime()> startDate.getTime() ) {throw new Error("Wrong date ")}
        const lot = { 
            lotName:req.body.lotName, 
            ownerId:req.body.ownerId,
            ownerName:req.body.ownerName,  
            location:req.body.location, 
            startPrice:req.body.startPrice,  
            interval:req.body.interval,
            image:[...result],
            startTime:startTime, 
            detailsText:req.body.detailsText
        }
        const featuresDeatils = JSON.parse(req.body.featuresDeatils)
        const newLot = await lotService.addLot(lot,featuresDeatils)
        //   fileDelete(delfiles)
        res.status(200).json({newLot})
 
        
    } catch (error) {
        fileDelete(result)
        next(error)
    }

}

export const joinToLotBidders = async (req,res,next)=>{
    const {id} =req.params
    const {userId} =req.body

    try { 
        const lotBidders = await lotService.joinToLotBidders(id,userId)
        res.status(200).json({ lotBidders })
    } catch (error) {
        next(error)
    }
}

export const leaveTheLotBidders = async (req,res,next)=>{
    const {id} =req.params
    const {userId} =req.body
    try {
        const result = await lotService.leaveTheLotBidders(id,userId)

       res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const getLotById = async(req,res,next)=>{
    const {id} =req.params
    try {
        const result = await lotService.getLotById(id)
        
        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}
export const getLotBids = async(req,res,next)=>{
    const {id} =req.params
    try {
        const result = await lotService.getLotBids(id)        
        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}
export const getAllLot =async (req,res,next)=>{
    const {offset, limit} =req.query
        try {
          const lots = await  lotService.getAllLots(limit,offset)
          res.status(200).json(lots)
    } catch (error) {
        next(error)
    }
}

export const likeLot =async (req,res,next)=>{
     const {id} =req.params
     const {userId} =req.body
     try {
        const result =await lotService.likeLot(userId,id)

        res.status(200).json({result})
     } catch (error) {
        next(error)

     }
}

// export const sellLot =async (req,res,next)=>{
//     const {lotId,winnerBid} = req.body
//     try {
//          const result = await lotService.sellLot(lotId,winnerBid)
//          res.status(200).json(result)
//     } catch (error) {
//         next(error)
//     }
// }
