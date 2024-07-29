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
    if(user.findOne({email: email})){
        res.status(400).json('User already exists!')}
    else{
    user.create(req.body.payload).then(
        users => {
        res.status(201).json({
            message: 'User registered successfully',
            data: {
                name: 'eff',
                email: 'req.body.payload.email'
            }
        })}
    ).catch(err=> res.status(400).json(err))}

})

router.get('/me', authenticateToken, (req,res)=>{
  user.findOne({_id: req.user.item.id}).then(
    (item) => res.status(200).json(item)
  ).catch(err=>res.status(404).json('user not found'))
})

module.exports = router;
