const FRSCCheckpointMiddleware = require('../middleware/FRSCCheckpoint');
const mustBeAdmin = require('../middleware/mustBeAdmin');
const NdleaCheckpointCheck = require('../middleware/ndleaCheckpoint');
const PoliceCheckpointMiddleware = require('../middleware/PoliceCheckpoint');
const V2authMiddleware = require('../middleware/v2-jwt-verify');
const courseModel = require('./../models/course');
const express = require('express')

const expressApp = express.Router();


expressApp.get('/courses', async (req, res) => {
    const courses = await courseModel.find();
    return res.json(courses)
})

expressApp.get('/courses/:course_id', async (req, res) => {
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

// expressApp.use(mustBeAdmin)
// expressApp.use(V2authMiddleware)

expressApp.post('/courses', mustBeAdmin, async(req, res) => {
    const { title, description, duration, price, tutor} = req.body;

    const newCourse = new courseModel({
        title, description, duration, price, tutor
    })

    await newCourse.save();

    return res.json({
        newCourse
    });
})

// Nigeria IPS (182.987.001.999 - 182.987.200.999)
expressApp.get('/my-class-info', 
    NdleaCheckpointCheck,  // NDLEA Checkpoint  // IP Address Checker Middleware
    FRSCCheckpointMiddleware, // FRSC Checkpoint // Location Info Middleware
    PoliceCheckpointMiddleware, // Police Checkpoint | CheckLoadWeight Middleware
    (request, response) => {
        const classInfo = {
            name : "Senior Dev",
            alias : 'Fullstack',
            duration : '4 months',
        }

        return response.status(200).json({
            classInfo,
            requestChecks : {
                load : request?.loadOntransit || 'No Load because he is not a Lagosian',
                locationInfo : request.locationInfo
            }
        });
    }, // What i want to do in my final destination
)

module.exports = expressApp