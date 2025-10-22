const mongoose = require('mongoose');

const userTable = mongoose.Schema({
    first_name : {type : String, required : true},
    last_name : String,
    email : {type : String},
    password : {type : String},
    phone : {type : String},
    role : {type : String}, // Role [user/admin]
    course : {type : mongoose.Schema.Types.ObjectId, ref : 'Course', required : false},
    created_at : {type : Date, default : Date.now()}
});

const model = mongoose.model('User', userTable);

module.exports = model