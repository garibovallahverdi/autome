import salesService from "../services/sales.service.js"

export const signAgreementForSaller= async (req,res,next)=>{
    const {id} =req.params
    const {userId,answer} = req.body

    try {
         const result = await salesService.signAgreementForSaller(id,userId,answer)
         res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const signAgreementForBuyer= async (req,res,next)=>{
    const {id} =req.params
    const {userId,answer} = req.body

    try {
         const result = await salesService.signAgreementForBuyer(id,userId,answer)
         res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}

export const getSalesAgreementById  =async (req,res,next)=>{
    const {id} =req.params
    try {
        const result = await salesService.getSalesAgreementById(id)
        res.status(200).json({result})
    } catch (error) {
        next(error)
    }
}