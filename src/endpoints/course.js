const courseModel = require('./../models/course');
const express = require('express')

const expressApp = express.Router();

expressApp.get('/courses', async (req, res) => {
    const courses = await courseModel.find();
    return res.json(courses)
})

expressApp.post('/courses', async(req, res) => {
    const { title, description, duration, price, tutor} = req.body;

    const newCourse = new courseModel({
        title, description, duration, price, tutor
    })

    await newCourse.save();

    return res.json({
        newCourse
    });
})

expressApp.get('/get-course/:course_id', async (req, res) => {
    const courseId = req.params?.course_id;

    if(!courseId) return res.status(404).json({
        message : "Invalid Course ID"
    })

    const course = await courseModel.findById(courseId)
    if(!course) return res.status(404).json({
        message : "Course not found"
    })

    return res.json(course)
})

module.exports = expressApp