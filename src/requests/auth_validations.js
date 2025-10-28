const { body } = require("express-validator");
const UserModel = require('./../models/user')
const courseModel = require('./../models/course')

const LoginRequestValidator = [
    body('email').notEmpty().isEmail().withMessage('Invalid email address'), 
    body('password').notEmpty().isLength({min: 8}).withMessage('Password must be at least 8 characters'),
]

const RegisterRequestValidator = [
    body('email').notEmpty().isEmail().custom( async (email) => {
        const user = await UserModel.findOne({email : email}).exec();
        if(user) {
            return Promise.reject('E-mail already in use');
        }
    }).withMessage('Invalid email address'), 
    body('course_id').notEmpty().custom(async (course_id) => {
        const course = await courseModel.findById(course_id).exec();
        if(!course) {
            return Promise.reject('Invalid Course Id');
        }
    }).withMessage('Invalid course ID'), 
    body('first_name').notEmpty().isLength({min : 2}).withMessage('First name is required and should be at least 2 characters'), 
    body('last_name').notEmpty().isLength({min : 2}).withMessage('Last name is required and should be at least 2 characters'), 
    body('phone').optional().isLength({min : 9, max : 20}).withMessage('Invalid phone number'), 
    body('password').notEmpty().isStrongPassword().withMessage('Password must be at least 8 characters, include an uppercase letter, a number, and a special character'), 
    
]

module.exports = {
    LoginRequestValidator,
    RegisterRequestValidator
}