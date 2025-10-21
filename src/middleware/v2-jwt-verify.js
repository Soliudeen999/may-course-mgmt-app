const jwt = require('jsonwebtoken')
const UserModel = require('./../models/user')

const V2authMiddleware = async (req, res, next) => {
    let sec =  req.header('Authorization')
    const JWT_HASH_SECRET = process.env.JWT_HASH_SECRET

    if(!sec){
        return res.status(301).json({
            message : "Unauthenticated, Please login first"
        })
    }

    const split = sec.split(' ')

    if(split.length < 1){
        return res.status(301).json({
            message : "Unauthenticated, Please login first"
        })
    }

    sec = split[1];
    console.log(sec, JWT_HASH_SECRET)
    try{
        const jwtInfo = jwt.verify(sec, JWT_HASH_SECRET)

        const ide = jwtInfo.ide;

        const user = await UserModel.findById(ide);
        if(!user)
            return res.status(401).json({
                message : "You are not authenticated"
            })

        delete user.password
        
        req.user = user
        next()
    }catch(err){
        console.log(err)
        return res.status(400).json({
            message : "Invalid access secret"
        })
    }
}

module.exports = V2authMiddleware