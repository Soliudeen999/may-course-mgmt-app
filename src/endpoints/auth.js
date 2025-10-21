const express = require('express');
const fs = require('fs');
const isAuthenticated = require('../middleware/authSecurity');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/jwt-verify');

const expressApp = express.Router();

expressApp.post('/login', (req, res) => {
    const {email, password} = req.body || {email : undefined, password : undefined};
    
    if(!email || !password) return res.status(400).json({
        status: false,
        message : "Invalid email or password"
    })
    
    if(!(email == 'admin@email.com' && password == 'admin1234')){
        return res.status(400).json({
            status : false,
            message : "Incorrect login Details"
        })
    }

    if(!fs.existsSync('./../data/auth_keys.json')){
        fs.writeFileSync(__dirname + '/../data/auth_keys.json', JSON.stringify({secrets : []}))
    }

    let authSecrets = fs.readFileSync(__dirname + '/../data/auth_keys.json', 'utf8');

    if(!authSecrets){
        authSecrets = {}
    }else{
        authSecrets = JSON.parse(authSecrets); 
    }

    const newSecret = `${email}.${Date.now()}`

    if(!authSecrets?.secrets){
        authSecrets = {secrets : []}
    }

    authSecrets.secrets.push({email : email, sec : newSecret});

    fs.writeFileSync(__dirname + '/../data/auth_keys.json', JSON.stringify({secrets : authSecrets.secrets}))

    return res.json({
        status : true,
        message : "Login Successfull",
        data: {
            email, access_secret : newSecret
        }
    })
})

expressApp.post('/jwt-login', (req, res) => {
    const {email, password} = req.body || {email : undefined, password : undefined};
    
    if(!email || !password) return res.status(400).json({
        status: false,
        message : "Invalid email or password"
    })
    
    if(!(email == 'admin@email.com' && password == 'admin1234')){
        return res.status(400).json({
            status : false,
            message : "Incorrect login Details"
        })
    }
    const JWT_HASH_SECRET = process.env.JWT_HASH_SECRET

    const token = jwt.sign({email, role: 'student', sch: 'AppClick-009'}, JWT_HASH_SECRET);

    return res.json({
        message : 'Login Successful',
        email,
        token
    })
})

expressApp.get('/me', isAuthenticated, (req, res) => {
    return res.json({
        message : "You are active",
        data : {
            email : req.user_email
        }
    })
})

expressApp.get('/jwt-me', authMiddleware, (req, res) => {
    return res.json({
        message: "User token is valid and active",
        data : req.user
    })
})

module.exports = expressApp