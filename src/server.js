const dotenv = require('dotenv');
const express = require('express');
const mongoose = require('mongoose');
const courseEndpoints = require('./endpoints/course');
const V2authEndpoints = require('./endpoints/auth_routes');
const notFoundHandler = require('./middleware/notFoundHandler');
const morgan = require('morgan');
const V2authMiddleware = require('./middleware/v2-jwt-verify');
const { seed } = require('./seed');

dotenv.config();
const expressApp = express();

expressApp.use(express.json());
expressApp.use(morgan())

expressApp.get('/api/health', async (req,res) => respons)


expressApp.use('/api', V2authEndpoints);

expressApp.use('/api', courseEndpoints);


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


// This seeds data into db
seed()
const PORT = 4000;
expressApp.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
