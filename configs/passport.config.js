
import passport from 'passport'
import LocalStrategy from 'passport-local'
import GoogleStrategy from 'passport-google-oauth20'
import bcrypt from 'bcrypt'
import User from '../models/user.model.js'
import dotenv from "dotenv"
import Notifications from '../models/notifications.model.js'

dotenv.config
passport.use(
  new LocalStrategy(  
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ where: { email } })
        if (!user) {
          return done(null, false, { message: 'Incorrect email or password.' })
        }

        if (!user.confirmed) {
          return done(null, false, { message: 'Account not confirmed. Please check your email.' });
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password.' })
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }
  )
)

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:9000/auth/google/callback'
    },
    async (accessToken, refreshToken,profile, done) => {
      try {
        let user = await User.findOne({ where: { googleId: profile.id } })

        if (!user) {
          const newUser = {
            googleId: profile.id, 
            first_name: profile.name.givenName,
            last_name: profile.name.familyName,
            image:profile.photos[0].value,
            email: profile.emails[0].value
            }
            
            const notif = await Notifications.create({userId:user.id})
            user = await User.create(newUser)
        }
        return done(null, user)
      } catch (error) {
        console.log(error);
        return  done(error, false)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  console.log('Serializing user:', user)
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findByPk(id)
    console.log('Deserializing user:', user)
    done(null, user)
  } catch (error) {
    console.error('Error during deserialization:', error)
    done(error, null)
  }
})

export default passport
