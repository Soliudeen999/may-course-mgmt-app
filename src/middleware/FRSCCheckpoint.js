const FRSCCheckpointMiddleware = (request, response, next) => {
        const locationInfo = request.locationInfo;
        if (locationInfo && locationInfo.state === 'Lagos') {
            console.log('Verifying Your Loads...')

            request.loadOntransit = {
                items : 'books',
                weight : Math.floor(Math.random() * 1000)
            }

            console.log('FRSC Checkpoint Passed');

            next()
        }

        return response.status(403).json({
            message : "You are not a Lagosian"
        })
    }

    module.exports = FRSCCheckpointMiddleware