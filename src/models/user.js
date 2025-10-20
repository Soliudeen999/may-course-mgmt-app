const mongoose = require('mongoose')

const userTable = mongoose.Schema({
    first_name : {type : String, required : true},
    email : {type : String},
    password : {type : String},
    phone : {type : String},
    role : {type : String}, // Role [user/admin]
    created_at : {type : Date, default : Date.now()}
})

const model = mongoose.Model('User', userTable);

module.exports = model