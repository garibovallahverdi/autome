import authService from "../services/auth.service.js"


export const register = async (req,res,next) => {
    const {first_name,last_name,email,password} =req.body
    try {
        const user ={
            first_name,
            last_name,
            email,
            password
        }
        const result = await authService.register(user)
        res.status(200).json({result})

    } catch (error) {
        next(error)
    }
   
}

export const accountConfirmed = async (req,res,next)=>{

    const {token} =req.params
    try {
        
        const result = await authService.accountConfirmed(token)
        if(result && result.status == true){
            // let user = result.user
            // console.log(user);
            //  req.login(user, (err) => {
            //         if (err) return console.log(err,"AAAAAAAAAAAAAAAAAA");
            //         res.redirect(process.env.BACKEND_URL + '/auth/profile');
            //         // res.status(200).json("Session tapildi")
            //     });
            res.status(200).json({user:result.user})
        }

    } catch (error) {
        next(error)
    }
    
}
