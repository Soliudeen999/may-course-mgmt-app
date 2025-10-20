const fs = require('fs')

const isAuthenticated = (req, res, next) => {
    let sec =  req.header('Authorization')

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

    console.log(split)
    sec = split[1];

    let authSecrets = fs.readFileSync(__dirname + '/../data/auth_keys.json', 'utf8')
    authSecrets = JSON.parse(authSecrets);

    const user = authSecrets.secrets.find((secret) => secret.sec === sec)

    if(!user)
        return res.status(400).json({
            message : "Invalid access secret"
        })

    req.user_email = user.email

    next()
}

module.exports = isAuthenticated