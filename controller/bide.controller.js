import bideService from "../services/bide.service.js"



export const addBid = async (req,res,next)=>{
     const {userId,bidAmount} =req.body
     const {id} =req.params
     let bide = {
        lotId:id,
        userId,
        bidAmount
     }
     try {
        const newBide = await bideService.addBid(bide)
        res.status(200).json({newBide})
        
     } catch (error) { 
        next(error)
     }
}

// export const toCancelTheBid =async (req,res,next)=>{
//     const {id} =req.params
//     const {userId} =req.body

//     try {
//         const canceledBid = await bideService.toCancelTheBid(id,userId)

//         res.status(200).json({canceledBid})
//     } catch (error) {
//         next(error)
//     }
// }

export const getUserBids = async (req,res,next)=>{
    const {id} =req.params

    try {
        const userAllBids =await bideService.getUserBids(id)
        res.status(200).json({userAllBids})
    } catch (error) {
        next(error)
    }
}