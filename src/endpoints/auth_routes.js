const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user')
const bcrypt = require('bcrypt');
const V2authMiddleware = require('../middleware/v2-jwt-verify');

const app = express.Router();

app.post('/login', async (request, response) => {

    const {email, password} = request.body || {email : undefined, password : undefined};
    
    if(!email || !password) return response.status(400).json({
        status: false,
        message : "Invalid email or password"
    })

    const user = await UserModel.findOne({email : email}).exec();

    if(!user) 
        return response.status(400).json({message : "Invalid Login details"})

    try{

    const isCorrect = await bcrypt.compare(password, user.password)

    if(!isCorrect)
        return response.status(400).json({message : "Invalid Login details"})
        
    const token = jwt.sign({
        email : user.email,
        ide : user._id,
    }, process.env.JWT_HASH_SECRET)

    delete user.password

    return response.json({
        message : "Login Successful",
        data : {
            user : user,
            token 
        }
    })
    }catch(err){
        return response.status(400).json({
            message : "Login Failed"
        })
    }

})


app.post('/register', async (req, res) => {
    let first_name = req.body?.first_name
    let email = req.body?.email
    let phone = req.body?.phone
    let password = req.body?.password

    if(!first_name || !email || !phone || !password){
        return res.status(400).json({message : "Validation error, please check the form inputs"})
    }

    let isExist = await UserModel.findOne({email: email}).exec();
    if (isExist)
        return res.status(400).json({
            message : "Email already exists"
        })

    const newUser= new UserModel({
        email : email,
        first_name : first_name,
        phone : phone,
        role : 'student',
        password : await bcrypt.hash(password, 12)
    })

    await newUser.save();

    delete newUser.password

    return res.json({
        message : "Registeration successful, You can go to login now",
        newUser
    })
})


app.get('/me', V2authMiddleware, async (req, res) => {
    return res.json({
        message : "You arre active",
        data : req.user
    })
})

module.exports = app