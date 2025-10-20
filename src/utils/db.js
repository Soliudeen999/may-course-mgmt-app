const mongo = require('mongoose'); 

const connectToDB = async () => {
    try{
        const dbName = process.env.DB_NAME;

        await mongo.connect(`mongodb://localhost:27017/${dbName}`,{
            autoIndex: true,
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        
    }catch(err){
        console.log("Error while connecting to DB", err);
    }
}

exports.connectToDB = connectToDB;
