const apiResponse = (res, details = {}) => {
    status_code = details?.status_code || 200
    message = details?.message || 'Request Completed',
    data = details?.data || undefined
    errors = details?.errors || undefined

    return res.status(status_code).json({
        status : status_code >= 200 && status_code <= 299,
        message,
        data, 
        errors
    })
}

const validationResponse = (res, errors, msg = null) => {
    let status_code = 422
    let message = msg || 'Validation Error',
    errs = errors.array().map((error) => {
        return {
            field : error.path,
            msg : error.msg
        };
    })

    return res.status(status_code).json({
        status : status_code,
        message, 
        errors : errs
    })
}

module.exports = {
    apiResponse,
    validationResponse
}