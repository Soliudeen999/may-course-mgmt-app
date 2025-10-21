const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
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

        req.user = {
            email : jwtInfo.email,
            role : jwtInfo.role,
            school : jwtInfo.sch
        }

        next()
    }catch(err){
        console.log(err)
        return res.status(400).json({
            message : "Invalid access secret"
        })
    }
}

module.exports = authMiddleware