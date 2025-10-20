const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const courseEndpoints = require('./endpoints/course');
const studentEndpoints = require('./endpoints/student');
const notFoundHandler = require('./middleware/notFoundHandler')


dotenv.config();
const expressApp = express();

process.env.PORT
// Applying Middlewares
expressApp.use(
    express.json()
);

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
