const { apiResponse } = require("../utils/helper")

const mustBeAdmin = (req, res, next) => {

    if(!req?.user?.role || req.user.role !== 'admin')
        return apiResponse(res, {status_code: 401, message : "Unauthorized : Only admin is allowed"})

    next()
}

module.exports = mustBeAdmin