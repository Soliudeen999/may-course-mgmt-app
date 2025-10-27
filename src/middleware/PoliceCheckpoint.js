const PoliceCheckpointMiddleware = (request, response, next) => {
        const load = request?.loadOntransit
        if (load && load.weight > 300){
            return response.status(403).json({
                message : 'You are not allowed to carry more than 600KG of items into our state'
            })
        }

        console.log('You just passed POLICE Checkpoint')

        next()
    }

    module.exports = PoliceCheckpointMiddleware