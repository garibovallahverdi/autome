import express from 'express'
import { accountConfirmed, forgotPasspowrd, register, resetPassword, verifyForgetPassword } from '../controller/auth.controller.js'
import passport from 'passport'
import  '../configs/passport.config.js'
// import passport from 'passport'
const router = express.Router()

router.post('/register',register)
router.get('/account-confirmed/:token',accountConfirmed)

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login-failure' }),
    (req, res) => {
      res.redirect(process.env.FRONTEND_URL + '/');
    }
  );

  router.get('/google',
    passport.authenticate('google',{ scope: ['profile', 'email'] })
  );
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      res.redirect(process.env.FRONTEND_URL + '/');
      // res.status(200).json("Done")
    }
  )

  router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      console.log("not auth");
      return res.redirect('/');
    } 
    res.json(req.user);
  });

  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.status(200).json({message:'Log out'})
    });
  });
  
  router.post('/forgot-password', forgotPasspowrd);
  router.get('/verify-resetpass-token/:token', verifyForgetPassword);
  router.post('/reset-password/:token', resetPassword);
export default router 