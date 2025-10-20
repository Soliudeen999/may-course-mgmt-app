const students = require('./../data/students');
const express = require('express');

const expressApp = express.Router();

// Get all students
expressApp.get('/students', (req, res) => {
    res.json({
        status: 'success',
        data: students
    });
});

expressApp.post('/students', (request, response) => {
    const formData = request.body;
    const name = formData?.name;
    const age = formData?.age;

    if(!name || !age || !parseInt(age)){
        return response.status(400).json({
            status : 'error',
            message : "Invalid Form Inputs"
        })
    }
    const lastStudent = students[students.length-1];

    const newStudent = {
        id : lastStudent.id + 1,
        name : name,
        age : age
    }
    students.push(newStudent)

    return response.status(201).json({
        status : 'success',
        message : "New User Added Successfully",
        data : newStudent
    })
});

// Get a student by ID
expressApp.get('/students/:student_id', (request, response) => {
    const id = request.params.student_id;
    const student = students.find((student)=> student.id == id)

    if(!student) return response.status(404).json({
        status: 'error',
        message: 'Student not found'
    });
    
    return response.json({
        status: 'success',
        data: student
    });
})

// Update Student
expressApp.put('/students/:student_id', (request, response) => {
    const id = request.params.student_id;
    const student = students.find((student)=> student.id == id)

    if(!student) return response.status(404).json({
        status: 'error',
        message: 'Student not found'
    });

    const name = request.body?.name;
    const age = request.body?.age;

    if(!name || !age) return response.status(400).json({
        status : 'error',
        message : 'Invalid Form Inputs'
    });
    
    student.name = name;
    student.age = age;

    const studentIndexOnTheList = students.findIndex((stud) => stud.id == student.id);

    students[studentIndexOnTheList] = student

    return response.json({
        status: 'success',
        data: student
    });
})

// Get One Student
expressApp.get('/students/:student_id', (request, response) => {
    const id = request.params.student_id;
    const student = students.find((student)=> student.id == id)

    if(!student) return response.status(404).json({
        status: 'error',
        message: 'Student not found'
    });
    
    return response.json({
        status: 'success',
        data: student
    });
})

module.exports = expressApp