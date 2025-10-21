const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const courseEndpoints = require('./endpoints/course');
const studentEndpoints = require('./endpoints/student');
const authEndpoints = require('./endpoints/auth');
const V2authEndpoints = require('./endpoints/auth_routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const isAuthenticated = require('./middleware/authSecurity');


dotenv.config();
const expressApp = express();

process.env.PORT
// Applying Middlewares
expressApp.use(
    express.json()
);

expressApp.use('/api', authEndpoints);
expressApp.use('/api/v2', V2authEndpoints);
expressApp.use(isAuthenticated)
expressApp.use('/api', courseEndpoints);
expressApp.use('/api', studentEndpoints);


expressApp.use(notFoundHandler);
const databaseName = process.env.DB_NAME;
try{
    mongoose.connect(`mongodb://localhost:27017/${databaseName}`, {
        autoIndex : true,
    })
    console.log('Connection Successful');
}catch(err){
    console.log('ERror Connecting: ', err )
}

const PORT = 4000;
expressApp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
