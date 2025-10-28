const express = require('express');
const jwt = require('jsonwebtoken');
const UserModel = require('./../models/user')
const courseModel = require('./../models/course')
const bcrypt = require('bcrypt');
const V2authMiddleware = require('../middleware/v2-jwt-verify');
const { apiResponse, validationResponse } = require("./../utils/helper");
const { body, validationResult } = require('express-validator');
const { LoginRequestValidator, RegisterRequestValidator } = require('../requests/auth_validations');

const app = express.Router();

app.post('/login', 
    LoginRequestValidator,
    async (request, response) => {
    
    const errors = validationResult(request);

    if(!errors.isEmpty()){
        return validationResponse(res, errors)
    } 

    const {email, password} = request.body
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


app.post('/register',
    RegisterRequestValidator,
    async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return validationResponse(res, errors)
    } 

    const { email, first_name, last_name, phone, password, course_id } = req.body;

    const course = await courseModel.findById(course_id)
    
    const newUser= new UserModel({
        email : email,
        first_name : first_name,
        last_name : last_name,
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