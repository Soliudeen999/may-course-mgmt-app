const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user')
const courseModel = require('./../models/course')
const bcrypt = require('bcrypt');
const V2authMiddleware = require('../middleware/v2-jwt-verify');
const { apiResponse } = require("./../utils/helper")

const app = express.Router();

app.post('/login', async (request, response) => {

    const {email, password} = request.body || {email : undefined, password : undefined};
    
    if(!email || !password) 
        return apiResponse(response, {status_code : 400, message : "Invalid email or password"})

    const user = await UserModel.findOne({email : email}).exec();

    if(!user) 
        return apiResponse(response, {message : "Invalid Login details"})

    try{

    const isCorrect = await bcrypt.compare(password, user.password)

    if(!isCorrect)
        return apiResponse(response, {message : "Invalid Login details"})
        
    const token = jwt.sign({
        email : user.email,
        ide : user._id,
    }, process.env.JWT_HASH_SECRET)

    delete user.password

    return apiResponse(response,{
        message : "Login Successful",
        data : {
            user : user,
            token 
        }
    })
    }catch(err){
        return apiResponse(response,{
            message : "Login Failed",
            status_code : 400
        })
    }

})


app.post('/register', async (req, res) => {
    let first_name = req.body?.first_name
    let email = req.body?.email
    let phone = req.body?.phone
    let password = req.body?.password
    let course_id = req.body?.course_id

    if(!first_name || !email || !phone || !password || !course_id){
        return res.status(400).json({message : "Validation error, please check the form inputs"})
    }

    let isExist = await UserModel.findOne({email: email}).exec();
    if (isExist)
        return res.status(400).json({
            message : "Email already exists"
        })

    const course = await courseModel.findById(course_id)

    if(!course){
        return apiResponse(res, {
            message : "Invalid Course Id",
            status_code : 422
        })
    }
    
    const newUser= new UserModel({
        email : email,
        first_name : first_name,
        phone : phone,
        role : 'student',
        password : await bcrypt.hash(password, 12),
        course
    })

    await newUser.save();

    delete newUser.password

    return res.json({
        message : "Registeration successful, You can go to login now",
        newUser
    })
})


app.get('/me', V2authMiddleware, async (req, res) => {
    const userFullDetails = await UserModel.findById(req.user._id).populate('course')
    return res.json({
        message : "You arre active",
        data : userFullDetails
    })
})

module.exports = app