var instance = function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift({});
    return Phaser.Utils.extend.apply(null, args);
};

/**
 * Item methods
 */
var acquirePowergem = function(player, item) {
    player.powergem = item;
    player.element = item.element;
};

var dropPowergem = function(player, item) {
    player.powergem = null;
    player.element = null;
};

var checkAcquirablePowergem = function(player, item) {
    return !player.element;
};

var checkCollideParticlePowerblock = function(particle, block) {
    return particle.group.element === block.element;
};

var elements = {
    air: {
        element: 'air',
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
        element: 'water',
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
        element: 'earth',
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
        element: 'fire',
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
        elemType: 'powergem',
        props: {
            element: 'air',
            acquire: acquirePowergem,
            drop: dropPowergem,
            checkAcquirable: checkAcquirablePowergem
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
        elemType: 'powergem',
        props: {
            element: 'water',
            acquire: acquirePowergem,
            drop: dropPowergem,
            checkAcquirable: checkAcquirablePowergem
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
        elemType: 'powergem',
        props: {
            element: 'earth',
            acquire: acquirePowergem,
            drop: dropPowergem,
            checkAcquirable: checkAcquirablePowergem
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
        elemType: 'powergem',
        props: {
            element: 'fire',
            acquire: acquirePowergem,
            drop: dropPowergem,
            checkAcquirable: checkAcquirablePowergem
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

var powerblocks = {
    air: {
        elemType: 'powerblock',
        props: {
            element: 'air',
            checkCollideParticle: checkCollideParticlePowerblock
        },
        frameId: 54,
        body: {
            x: 0,
            y: 0,
            width: 70,
            height: 70
        }
    },
    water: {
        elemType: 'powerblock',
        props: {
            element: 'water',
            checkCollideParticle: checkCollideParticlePowerblock
        },
        frameId: 90,
        body: {
            x: 0,
            y: 0,
            width: 70,
            height: 70
        }
    },
    earth: {
        elemType: 'powerblock',
        props: {
            element: 'earth',
            checkCollideParticle: checkCollideParticlePowerblock
        },
        frameId: 97,
        body: {
            x: 0,
            y: 0,
            width: 70,
            height: 70
        }
    },
    fire: {
        elemType: 'powerblock',
        props: {
            element: 'fire',
            checkCollideParticle: checkCollideParticlePowerblock
        },
        frameId: 66,
        body: {
            x: 0,
            y: 0,
            width: 70,
            height: 70
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
                instance(powergems.water, {
                    x: 1085,
                    y: 580
                })
            ],
            blocks: [
                instance(powerblocks.water, {
                    x: 1715,
                    y: 450
                }),
                instance(powerblocks.water, {
                    x: 1715,
                    y: 350
                }),
                instance(powerblocks.water, {
                    x: 1715,
                    y: 250
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
