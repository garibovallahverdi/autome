import authService from "../services/auth.service.js"


export const authLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err)
    }
    if (!user) {
      return res.status(400).json({ message: 'Incorrect email or password.' })
    }
    req.login(user, err => {
      if (err) {
        return next(err)
      }
      return res.status(200).json({ message: 'Login successful', user })
    })
  })(req, res, next)
}


export const register = async (req,res,next) => {
    const {first_name,last_name,email,password} =req.body
    try {
        const user ={
            first_name,
            last_name, 
            email,
            password
        }
        if(!first_name || !last_name || !email || !password){
          throw new Error("Butun inputlari doldurun")
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
            let user = result.user
             req.login(user, (err) => {
                    if (err) return console.log(err,"AAAAAAAAAAAAAAAAAA");
                    res.redirect(process.env.FRONTEND_URL+'/');
                    // res.status(200).json("Session tapildi")
                });
            // res.status(200).json({user:result.user})
        }

    } catch (error) {
        next(error)
    }
    
}


export const forgotPasspowrd = async (req, res, next) => {
  const { email } = req.body
    try {
      const result = await authService.forgotPassword(email)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
  
  export const verifyForgetPassword  = async (req, res, next) => {
    const { token } = req.params
  
    try {
      const user = await authService.verifyForgetPassword(token)
      res.redirect(process.env.FRONTEND_URL+`/reset-pass/${token}`)
    } catch (error) {
      next(error)
    }
  }
   

  export const resetPassword = async (req,res,next)=>{
    const {token} =req.params
    const {password} = req.body
    try {
       const resetPass = await authService.resetPassword(token,password)

       res.status(200).json(resetPass)
    } catch (error) {
      next(error)
    }
  }

  