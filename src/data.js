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
    player.hasElement = true;
};

var dropPowergem = function(player, item) {
    player.powergem = null;
    player.hasElement = false;
    player.elementWasDropped = true;
};

var checkAcquirablePowergem = function(player, item) {
    return !player.element;
};

var checkCollideParticlePowerblock = function(particle, block) {
    return particle.group.element === block.element;
};

var font = {
    style: {
        font: '18px "minecraftiaregular"',
        fill: 'slategray',
        align: 'center'
    }
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

var backgroundItems = {
    goalStar: {
        frameName: 'star.png',
        noGravity: true,
        tween: [
            { x: 0, y: -10, duration: 800, easing: Phaser.Easing.Quadratic.InOut },
            { x: 0, y: 10, duration: 800, easing: Phaser.Easing.Quadratic.InOut }
        ],
        tweenLoop: true
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
    levels: {
        level1: {
            nextState: 'level2',
            width: 2100,
            height: 840,
            background: '#d0f4f7',
            clouds: 15,
            player: {
                x: 150,
                y: 580
            },
            goal: {
                x: 1961,
                y: 490
            },
            text: [
                instance(font, {
                    x: 350,
                    y: 350,
                    msg: 'Hi! :D\nUse the arrow keys to move and jump about.\nTry to make it to the level exit!'
                }),
                instance(font, {
                    x: 1000,
                    y: 725,
                    msg: 'Grab a powergem with the "Z" key.\nThen use the spacebar to unleash your element!'
                }),
                instance(font, {
                    x: 1600,
                    y: 275,
                    msg: 'Use your power to remove obstacles.\nEach obstacle type matches one of your elements.'
                })
            ],
            items: [
                instance(powergems.water, {
                    x: 1085,
                    y: 580
                })
            ],
            backgroundItems: [
                instance(backgroundItems.goalStar, {
                    x: 1961,
                    y: 380
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
                elements.water
            ]
        },
        level2: {
            width: 2100,
            height: 1050,
            background: '#d0f4f7',
            clouds: 15,
            player: {
                x: 150,
                y: 780
            },
            goal: {
                x: 1960,
                y: 500
            },
            text: [
                instance(font, {
                    x: 250,
                    y: 650,
                    msg: 'Keep going!'
                }),
                instance(font, {
                    x: 1000,
                    y: 300,
                    msg: 'There are 4 types\nof powergems, but you\ncan only carry one at a time!'
                }),
                instance(font, {
                    x: 375,
                    y: 240,
                    msg: 'Use the "X" key to drop\nyour current powergem.\nThen, you can pick up a new one!'
                }),
                instance(font, {
                    x: 1800,
                    y: 550,
                    msg: 'From here on out,\nyou\'re on your own. :)'
                })
            ],
            items: [
                instance(powergems.water, {
                    x: 485,
                    y: 920
                }),
                instance(powergems.earth, {
                    x: 450,
                    y: 300
                }),
            ],
            backgroundItems: [
                instance(backgroundItems.goalStar, {
                    x: 1960,
                    y: 590
                })
            ],
            blocks: [
                // First barrier
                instance(powerblocks.water, {
                    x: 815,
                    y: 850
                }),
                instance(powerblocks.water, {
                    x: 815,
                    y: 750
                }),
                instance(powerblocks.water, {
                    x: 815,
                    y: 650
                }),

                // Second barrier
                instance(powerblocks.earth, {
                    x: 1415,
                    y: 650
                }),
                instance(powerblocks.earth, {
                    x: 1415,
                    y: 550
                }),
                instance(powerblocks.earth, {
                    x: 1415,
                    y: 450
                }),

                // Floating island barrier
                instance(powerblocks.water, {
                    x: 600,
                    y: 300
                }),
                instance(powerblocks.water, {
                    x: 600,
                    y: 200
                }),
                instance(powerblocks.water, {
                    x: 600,
                    y: 100
                })
            ],
            elements: [
                elements.water,
                elements.earth
            ]
        }
    }
};
