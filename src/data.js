module.exports = {
    state: {
        level: 'level1'
    },
    levels: {
        level1: {
            width: 2100,
            height: 840,
            clouds: 15,
            player: {
                x: 150,
                y: 580
            },
            items: [{
                type: 'powergem',
                frameName: 'gemBlue.png',
                x: 1085,
                y: 580,
                body: {
                    x: 20,
                    y: 20,
                    width: 30,
                    height: 30
                }
            }],
            elements: [{
                type: 'air',
                frameName: 'air.png',
                num: 200,
                gravity: 2,
                lifespan: 1000,
                particleScale: {
                    min: 1.0,
                    max: 1.5
                },
                angularVel: {
                    min: -20,
                    max: 20
                },
                speedX: {
                    min: 100,
                    max: 300
                },
                speedY: {
                    min: -150,
                    max: 150
                }
            }]
        }
    }
};
