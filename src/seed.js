const UserModel = require('./models/user')
const CourseModel = require('./models/course')
const bcrypt = require('bcrypt')
const { model } = require('mongoose')

const seed = async () => {
    if(! await UserModel.findOne({email : "admin@gmail.com"}).exec()){

        const newAdmin = new UserModel({
            first_name : "Super Admin",
            last_name : "001",
            email : "admin@gmail.com",
            phone : "09089674532",
            password : bcrypt.hashSync('password', 12),
            role : 'admin'
        })

        newAdmin.save();
    }

}
module.exports = {seed}