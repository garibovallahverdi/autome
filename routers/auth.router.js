import express from 'express'
import { accountConfirmed, register } from '../controller/auth.controller.js'
import passport from '../configs/passport.config.js'

const router = express.Router()

router.post('/register',register)
router.get('/account-confirmed/:token',accountConfirmed)

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login-failure' }),
    (req, res) => {
      res.redirect(process.env.FRONTEND_URL + '/profile');
    }
  );

  router.get('/google',
    passport.authenticate('google',{ scope: ['profile', 'email'] })
  );
  router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
      // res.redirect(process.env.BACKEND_URL + '/profile');
      res.status(200).json("Done")
    }
  )

  router.get('/profile', (req, res) => {
    if (!req.isAuthenticated()) {
      return res.redirect('/');
    } 
    res.json(req.user);
  });

  router.get('/logout', (req, res) => {
    req.logout(() => {
      res.redirect(process.env.FRONTEND_URL);
    });
  });
  

export default router 