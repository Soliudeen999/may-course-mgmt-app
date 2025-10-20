const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
    title : {type: String, required : true},
    description : {type: String, required : false},
    duration : {type : Number, required : true},
    price : {type: Number, required : true},
    tutor : {type : String, required : false},
})

module.exports = mongoose.model('Course', courseSchema);