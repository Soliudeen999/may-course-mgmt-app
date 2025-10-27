const NdleaCheckpointCheck = (request, response, next) => {
        const IP = request.query?.ip || '127.0.0.1'
        let list = IP.split('.')
        let final = 0;

        if(list.length > 0){
            list.forEach(element => {
                if(Number.parseInt(element)){
                    final += Number(element);
                }
            });
        }

        console.log(final, 182+987+1+999, 182+987+999+999);

        if (final >= 182+987+1+999 && final <= 182+987+999+999) {
            const possibleStates = ['Lagos', 'Abuja', 'Rivers', 'Kano'];

            const randomState = possibleStates[Math.floor(Math.random() * possibleStates.length)];

            request.locationInfo = {
                country: 'Nigeria',
                checkpoint: 'NDLEA',
                state : randomState
            }

            console.log('NDLEA Checkpoint Passed');
            next();
        }
        return response.status(403).json({ message: 'Access denied: Unauthorized IP address' });
    }

    module.exports = NdleaCheckpointCheck