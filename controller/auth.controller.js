import User from "../models/user.model.js";


export const register = async (req,res) => {

    console.log(req.body);
    const { first_name,last_name,email,password, phone_number} = req.body
    try {
         const newUser = await User.create({first_name,last_name,email,password,phone_number})

         res.status(200).json({newUser})
    } catch (error) {
        res.status(400).json({error}) 
    } 

}

export const getuserLots = async (req,res,next)=>{
    const {id} =req.params
    try {
        const user = await User.findOne({where:{id}})
        const lots = await user.getJoinedLots()
        res.status(200).json(lots)
    } catch (error) {
        res.status(400).json({error}) 

    }
}
