const apiResponse = (res, details = {}) => {
    status_code = details?.status_code || 200
    message = details?.message || 'Request Completed',
    data = details?.data || undefined

    return res.status(status_code).json({
        status : status_code >= 200 && status_code <= 299,
        message,
        data
    })
}

module.exports = {
    apiResponse
}