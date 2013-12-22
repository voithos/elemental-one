var acquirePowergem = function(player, item) {
    player.powergem = item;
    player.element = item.element;
};

var elements = {
    air: {
        type: 'air',
        frameName: 'air.png',
        num: 200,
        gravity: 0.1,
        lifespan: 1000,
        particleScale: {
            min: 1.5,
            max: 2.0
        },
        angularVel: {
            min: -20,
            max: 20
        },
        speedX: {
            min: 100,
            max: 200
        },
        speedY: {
            min: -125,
            max: 125
        }
    },
    water: {
        type: 'water',
        frameName: 'water.png',
        num: 200,
        gravity: 6,
        lifespan: 1500,
        particleScale: {
            min: 0.5,
            max: 1.3
        },
        angularVel: {
            min: -20,
            max: 20
        },
        speedX: {
            min: 100,
            max: 250
        },
        speedY: {
            min: -150,
            max: 150
        }
    },
    earth: {
        type: 'earth',
        frameName: 'earth.png',
        num: 200,
        gravity: 2,
        lifespan: 2300,
        particleScale: {
            min: 1.2,
            max: 1.5
        },
        angularVel: {
            min: -50,
            max: 50
        },
        speedX: {
            min: 100,
            max: 300
        },
        speedY: {
            min: -100,
            max: 100
        }
    },
    fire: {
        type: 'fire',
        frameName: 'fire.png',
        num: 200,
        gravity: -5,
        lifespan: 1000,
        particleScale: {
            min: 1.0,
            max: 1.5
        },
        angularVel: {
            min: 800,
            max: 1200
        },
        speedX: {
            min: 100,
            max: 200
        },
        speedY: {
            min: -100,
            max: 100
        }
    }
};

var powergems = {
    air: {
        itemType: 'powergem',
        itemProps: {
            element: 'air',
            acquire: acquirePowergem
        },
        frameName: 'gemYellow.png',
        body: {
            x: 20,
            y: 20,
            width: 30,
            height: 30
        }
    },
    water: {
        itemType: 'powergem',
        itemProps: {
            element: 'water',
            acquire: acquirePowergem
        },
        frameName: 'gemBlue.png',
        body: {
            x: 20,
            y: 20,
            width: 30,
            height: 30
        }
    },
    earth: {
        itemType: 'powergem',
        itemProps: {
            element: 'earth',
            acquire: acquirePowergem
        },
        frameName: 'gemGreen.png',
        body: {
            x: 20,
            y: 20,
            width: 30,
            height: 30
        }
    },
    fire: {
        itemType: 'powergem',
        itemProps: {
            element: 'fire',
            acquire: acquirePowergem
        },
        frameName: 'gemRed.png',
        body: {
            x: 20,
            y: 20,
            width: 30,
            height: 30
        }
    }
};

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
            items: [
                Phaser.Utils.extend(powergems.water, {
                    x: 1085,
                    y: 580
                })
            ],
            elements: [
                elements.air,
                elements.water,
                elements.earth,
                elements.fire
            ]
        }
    }
};
