const express = require('express')
const router  = express.Router()
const jwt = require('jsonwebtoken')
const secretKey = 'secretkey'

require('dotenv').config();


const user = require('../models/userModel')

const passport = require('passport');
const authenticateToken = require('../middlewares/authMiddleware');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/api/auth/google/callback'
  },
  (accessToken, refreshToken, profile, done) => {

    User.findOne({ googleId: profile.id })
      .then(user => {
        if (user) {
          return done(null, user);
        } else {
          // Create a new user
          const newUser = new User({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails[0].value
          });
          newUser.save()
            .then(user => done(null, user))
            .catch(err => done(err, null));
        }
      })
      .catch(err => done(err, null));
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => done(null, user))
    .catch(err => done(err, null));
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/home');
});


router.post('/login',(req,res)=>{

    const {email,password} = req.body

    user.findOne({email: email})
    .then(item=>{
        if (item){
            if(item.comparePassword(password)){
                jwt.sign({item}, secretKey,{expiresIn: '5h'},(err,token) => {
                    console.log(item)
                    res.status(201).json({
                        message: 'User logged in successfully',
                        data: {
                            name: item.name,
                            email: item.email,
                            token: token
                        }
                    })
                })
            }
            else{
                res.status(400).json("Incorrect Password")
            }
        }
        else{
            res.status(400).json("No record found")
        }
    })
})

router.post('/register',(req,res)=>{
    const email = req.body.email
   
    user.create(req.body.payload).then(
        users => {
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                name: 'eff',
                email: 'req.body.payload.email'
            }
        })}
    ).catch(err=> res.status(400).json(err))

})

router.get('/me', authenticateToken, (req, res) => {
  const userId = req.user.item._id;
  user.findById(userId)
    .then(user => {
      if (user) {
        res.status(200).json({
          name: `${user.firstName} ${user.lastName}`,
          email: user.email
        });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    })
    .catch(err => res.status(500).json({ message: 'Server error', error: err }));
});


module.exports = router;
