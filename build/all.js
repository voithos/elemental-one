(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                throw new Error("Cannot find module '" + o + "'");
            }
            var f = n[o] = {
                exports: {}
            };
            t[o][0].call(f.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e);
            }, f, f.exports, e, t, n, r);
        }
        return n[o].exports;
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s;
})({
    1: [ function(require, module, exports) {
        module.exports = {
            GAME_WIDTH: 800,
            GAME_HEIGHT: 600,
            DOM_PARENT: "main",
            TILE_WIDTH: 70,
            TILE_HEIGHT: 70,
            GRAVITY: 20,
            MOVEMENT_VEL: 210,
            JUMP_VEL: 500,
            CLOUD_MOVE_OFFSET: 1e3,
            CLOUD_MOVE_TIME: 3e4,
            MAX_PARTICLES: 250,
            PARTICLE_X_OFFSET: 45,
            PARTICLE_Y_OFFSET: 10,
            ELEM_GRAVITY: 3,
            ITEM_FADE_TIME: 1e3,
            ITEM_ACQUIRE_OFFSET: 25,
            ITEM_DROP_VEL: -100,
            BLOCK_FADE_TIME: 1e3,
            LEVEL_FADEIN_TIME: 1e3,
            LEVEL_FADEOUT_TIME: 500,
            PLAYER_BOUND_WIDTH: 30,
            PLAYER_BOUND_HEIGHT: 75,
            PLAYER_BOUND_H_OFFSET: 10,
            FLOATING_TILES: [ 2, 14, 26, 41, 44, 46, 53, 56, 58, 65, 68, 70, 71, 75, 77, 80, 82, 87, 99, 111, 117, 119, 126, 145 ],
            UPWARD_SLOPE_TILES: [ 29, 32, 34, 42, 63, 105 ],
            DOWNWARD_SLOPE_TILES: [ 5, 8, 10, 30, 39, 95 ],
            BACKGROUND_TILES: [ 1, 6, 13, 18, 19, 21, 25, 31, 33, 37, 40, 45, 52, 57, 64, 69, 76, 81, 149 ],
            GOAL_TILE: 57
        };
    }, {} ],
    2: [ function(require, module, exports) {
        var instance = function() {
            var args = Array.prototype.slice.call(arguments);
            args.unshift({});
            return Phaser.Utils.extend.apply(null, args);
        };
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
                fill: "slategray",
                align: "center"
            }
        };
        var elements = {
            air: {
                element: "air",
                frameName: "air.png",
                num: 200,
                gravity: .1,
                lifespan: 1e3,
                particleScale: {
                    min: 1.5,
                    max: 2
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
                element: "water",
                frameName: "water.png",
                num: 200,
                gravity: 6,
                lifespan: 1500,
                particleScale: {
                    min: .5,
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
                element: "earth",
                frameName: "earth.png",
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
                element: "fire",
                frameName: "fire.png",
                num: 200,
                gravity: -5,
                lifespan: 1e3,
                particleScale: {
                    min: 1,
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
                elemType: "powergem",
                props: {
                    element: "air",
                    acquire: acquirePowergem,
                    drop: dropPowergem,
                    checkAcquirable: checkAcquirablePowergem
                },
                frameName: "gemYellow.png",
                body: {
                    x: 20,
                    y: 20,
                    width: 30,
                    height: 30
                }
            },
            water: {
                elemType: "powergem",
                props: {
                    element: "water",
                    acquire: acquirePowergem,
                    drop: dropPowergem,
                    checkAcquirable: checkAcquirablePowergem
                },
                frameName: "gemBlue.png",
                body: {
                    x: 20,
                    y: 20,
                    width: 30,
                    height: 30
                }
            },
            earth: {
                elemType: "powergem",
                props: {
                    element: "earth",
                    acquire: acquirePowergem,
                    drop: dropPowergem,
                    checkAcquirable: checkAcquirablePowergem
                },
                frameName: "gemGreen.png",
                body: {
                    x: 20,
                    y: 20,
                    width: 30,
                    height: 30
                }
            },
            fire: {
                elemType: "powergem",
                props: {
                    element: "fire",
                    acquire: acquirePowergem,
                    drop: dropPowergem,
                    checkAcquirable: checkAcquirablePowergem
                },
                frameName: "gemRed.png",
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
                frameName: "star.png",
                noGravity: true,
                tween: [ {
                    x: 0,
                    y: -10,
                    duration: 800,
                    easing: Phaser.Easing.Quadratic.InOut
                }, {
                    x: 0,
                    y: 10,
                    duration: 800,
                    easing: Phaser.Easing.Quadratic.InOut
                } ],
                tweenLoop: true
            }
        };
        var powerblocks = {
            air: {
                elemType: "powerblock",
                props: {
                    element: "air",
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
                elemType: "powerblock",
                props: {
                    element: "water",
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
                elemType: "powerblock",
                props: {
                    element: "earth",
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
                elemType: "powerblock",
                props: {
                    element: "fire",
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
            mainmenu: {
                player: {
                    x: 675,
                    y: 343
                }
            },
            levels: {
                level1: {
                    nextState: "level2",
                    width: 2100,
                    height: 840,
                    background: "#d0f4f7",
                    clouds: 15,
                    player: {
                        x: 150,
                        y: 580
                    },
                    goal: {
                        x: 1961,
                        y: 490
                    },
                    text: [ instance(font, {
                        x: 350,
                        y: 350,
                        msg: "Hi! :D\nUse the arrow keys to move and jump about.\nTry to make it to the level exit!"
                    }), instance(font, {
                        x: 1e3,
                        y: 725,
                        msg: 'Grab a powergem with the "Z" key.\nThen use the spacebar to unleash your element!',
                        style: {
                            font: '18px "minecraftiaregular"',
                            fill: "#2c2c2c",
                            align: "center"
                        }
                    }), instance(font, {
                        x: 1600,
                        y: 275,
                        msg: "Use your power to remove obstacles.\nEach obstacle type matches one of your elements."
                    }) ],
                    items: [ instance(powergems.water, {
                        x: 1085,
                        y: 580
                    }) ],
                    backgroundItems: [ instance(backgroundItems.goalStar, {
                        x: 1961,
                        y: 380
                    }) ],
                    blocks: [ instance(powerblocks.water, {
                        x: 1715,
                        y: 450
                    }), instance(powerblocks.water, {
                        x: 1715,
                        y: 350
                    }) ],
                    elements: [ elements.water ]
                },
                level2: {
                    nextState: "level3",
                    width: 2100,
                    height: 1050,
                    background: "#d0f4f7",
                    clouds: 15,
                    player: {
                        x: 150,
                        y: 780
                    },
                    goal: {
                        x: 1961,
                        y: 700
                    },
                    text: [ instance(font, {
                        x: 250,
                        y: 650,
                        msg: "Keep going!"
                    }), instance(font, {
                        x: 1e3,
                        y: 300,
                        msg: "There are 4 types\nof powergems, but you\ncan only carry one at a time!"
                    }), instance(font, {
                        x: 375,
                        y: 240,
                        msg: 'Use the "X" key to drop\nyour current powergem.\nThen, you can pick up a new one!'
                    }), instance(font, {
                        x: 1800,
                        y: 550,
                        msg: "From here on out,\nyou're on your own. :)"
                    }) ],
                    items: [ instance(powergems.water, {
                        x: 485,
                        y: 920
                    }), instance(powergems.earth, {
                        x: 450,
                        y: 300
                    }) ],
                    backgroundItems: [ instance(backgroundItems.goalStar, {
                        x: 1960,
                        y: 590
                    }) ],
                    blocks: [ instance(powerblocks.water, {
                        x: 815,
                        y: 850
                    }), instance(powerblocks.water, {
                        x: 815,
                        y: 750
                    }), instance(powerblocks.earth, {
                        x: 1415,
                        y: 650
                    }), instance(powerblocks.earth, {
                        x: 1415,
                        y: 550
                    }), instance(powerblocks.water, {
                        x: 600,
                        y: 300
                    }), instance(powerblocks.water, {
                        x: 600,
                        y: 200
                    }) ],
                    elements: [ elements.water, elements.earth ]
                },
                level3: {
                    nextState: null,
                    width: 3850,
                    height: 2170,
                    background: "#d0f4f7",
                    clouds: 35,
                    player: {
                        x: 150,
                        y: 1740
                    },
                    goal: {
                        x: 1890,
                        y: 420,
                        width: 140
                    },
                    items: [ instance(powergems.water, {
                        x: 705,
                        y: 1980
                    }), instance(powergems.earth, {
                        x: 3780,
                        y: 1840
                    }), instance(powergems.fire, {
                        x: 3745,
                        y: 610
                    }) ],
                    backgroundItems: [ instance(backgroundItems.goalStar, {
                        x: 1960,
                        y: 313
                    }), instance(backgroundItems.goalStar, {
                        x: 1890,
                        y: 313
                    }) ],
                    blocks: [ instance(powerblocks.water, {
                        x: 2615,
                        y: 1930
                    }), instance(powerblocks.water, {
                        x: 2615,
                        y: 1830
                    }), instance(powerblocks.earth, {
                        x: 1475,
                        y: 1700
                    }), instance(powerblocks.earth, {
                        x: 1475,
                        y: 1600
                    }), instance(powerblocks.earth, {
                        x: 3550,
                        y: 550
                    }), instance(powerblocks.earth, {
                        x: 3550,
                        y: 450
                    }), instance(powerblocks.fire, {
                        x: 1800,
                        y: 1400
                    }), instance(powerblocks.fire, {
                        x: 1800,
                        y: 1300
                    }) ],
                    elements: [ elements.water, elements.earth, elements.fire ]
                }
            }
        };
    }, {} ],
    3: [ function(require, module, exports) {
        function createSlopedTilemapCollider(upwardSlopes, downwardSlopes) {
            return function(sprite, tilemapLayer, collideCallback, processCallback, callbackContext) {
                this._mapData = tilemapLayer.getTiles(sprite.body.x, sprite.body.y, sprite.body.width, sprite.body.height, true);
                if (this._mapData.length === 0) {
                    return;
                }
                for (var i = 0; i < this._mapData.length; i++) {
                    var tile = this._mapData[i];
                    var slopeDistanceFromTileTop = 0;
                    if (upwardSlopes.indexOf(tile.tile.index) >= 0 && sprite.body.right < tile.right) {
                        slopeDistanceFromTileTop = Math.max(0, tile.right - sprite.body.right);
                    } else if (downwardSlopes.indexOf(tile.tile.index) >= 0 && sprite.body.x > tile.x) {
                        slopeDistanceFromTileTop = Math.max(0, sprite.body.x - tile.x);
                    }
                    var shouldSeparate = slopeDistanceFromTileTop === 0 || sprite.body.bottom > tile.y + slopeDistanceFromTileTop;
                    if (shouldSeparate && this.separateTile(sprite.body, this._mapData[i])) {
                        if (processCallback) {
                            if (processCallback.call(callbackContext, sprite, this._mapData[i])) {
                                this._total++;
                                if (collideCallback) {
                                    collideCallback.call(callbackContext, sprite, this._mapData[i]);
                                }
                            }
                        } else {
                            this._total++;
                            if (collideCallback) {
                                collideCallback.call(callbackContext, sprite, this._mapData[i]);
                            }
                        }
                        if (slopeDistanceFromTileTop > 0) {
                            sprite.body.y += slopeDistanceFromTileTop;
                            sprite.body.updateHulls();
                        }
                    }
                }
            };
        }
        module.exports.createSlopedTilemapCollider = createSlopedTilemapCollider;
    }, {} ],
    4: [ function(require, module, exports) {
        var _ = require("./overrides");
        var u = require("./utils");
        var extensions = require("./extensions");
        var cfg = require("./config");
        var data = require("./data");
        var game = new Phaser.Game(cfg.GAME_WIDTH, cfg.GAME_HEIGHT, Phaser.CANVAS, cfg.DOM_PARENT);
        var Main = {};
        var preloadbar, loaded, menubackground, logo, occluder, map, tileset, surface, background, backbackground, player, goal, clouds, items, backgroundItems, blocks, theme, musicdone, transitioning, gotoNext, sfx = {}, elemEmitters = {}, cursors, elemButton, acquireButton, dropButton;
        function boot() {
            game.physics.collideSpriteVsTilemapLayer = extensions.createSlopedTilemapCollider(cfg.UPWARD_SLOPE_TILES, cfg.DOWNWARD_SLOPE_TILES);
            game.input.maxPointers = 1;
            Main.boot = function() {};
            Main.boot.prototype = {
                preload: function() {
                    game.load.image("preloadbar", "assets/images/preloadbar.png");
                },
                create: function() {
                    game.state.start("preloader");
                }
            };
            game.state.add("boot", Main.boot, false);
            Main.preloader = function() {};
            Main.preloader.prototype = {
                preload: function() {
                    preloadbar = game.add.sprite(0, 0, "preloadbar");
                    preloadbar.x = (cfg.GAME_WIDTH - preloadbar.width) / 2;
                    preloadbar.y = cfg.GAME_HEIGHT / 2 - preloadbar.height / 2;
                    game.load.setPreloadSprite(preloadbar);
                    preload();
                },
                create: function() {
                    preloadbar.crop.width = preloadbar.width;
                    var tween = game.add.tween(preloadbar).to({
                        alpha: 0
                    }, 800, Phaser.Easing.Linear.None, true);
                    tween.onComplete.addOnce(function() {
                        game.state.start("mainmenu");
                    });
                }
            };
            game.state.add("preloader", Main.preloader, false);
            Main.mainmenu = function() {};
            Main.mainmenu.prototype = {
                create: function() {
                    game.level = "mainmenu";
                    theme = game.add.audio("theme");
                    theme.play("", 0, .3, true);
                    menubackground = game.add.sprite(0, 0, "menubackground");
                    menubackground.alpha = 0;
                    logo = game.add.text(game.world.centerX, game.world.centerY - 150, "ELEMENTAL ONE", {
                        font: '45px "minecraftiaregular"',
                        fill: "slategray",
                        align: "center"
                    });
                    logo.anchor.setTo(.5, .5);
                    var startText = game.add.text(game.world.centerX, game.world.centerY + 200, "press enter", {
                        font: '25px "minecraftiaregular"',
                        fill: "black",
                        align: "center"
                    });
                    startText.anchor.setTo(.5, .5);
                    game.add.tween(startText).to({
                        alpha: 0
                    }, 500, Phaser.Easing.Linear.None, true, 0, Infinity, true);
                    game.add.tween(menubackground).to({
                        alpha: 1
                    }, 2e3, Phaser.Easing.Quadratic.Out, true);
                    addPlayer(data.mainmenu.player.x, data.mainmenu.player.y);
                    player.body.gravity.y = 0;
                    player.animations.play("walk");
                    player.alpha = 0;
                    game.add.tween(player).to({
                        alpha: 1
                    }, 2e3, Phaser.Easing.Quadratic.Out, true);
                    var ptween = game.add.tween(player).to({
                        x: player.x - 80
                    }, 1350, Phaser.Easing.Linear.None, true, 0, Infinity, true);
                    ptween.onComplete.add(function() {
                        player.scale.x *= -1;
                    });
                    var key = game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
                    key.onDown.addOnce(function() {
                        game.add.tween(player).to({
                            alpha: 0
                        }, 2e3, Phaser.Easing.Linear.None, true);
                        game.add.tween(logo).to({
                            alpha: 0
                        }, 2e3, Phaser.Easing.Linear.None, true);
                        var tween = game.add.tween(menubackground).to({
                            alpha: 0
                        }, 2e3, Phaser.Easing.Linear.None, true);
                        tween.onComplete.addOnce(function() {
                            game.state.start("level1");
                        });
                    });
                }
            };
            game.state.add("mainmenu", Main.mainmenu, false);
            Main.Levels = {};
            Object.keys(data.levels).forEach(function(level) {
                Main.Levels[level] = function() {};
                Main.Levels[level].prototype = {
                    create: function() {
                        game.level = level;
                        game.nextState = data.levels[level].nextState;
                        create();
                    },
                    update: update,
                    render: render
                };
                game.state.add(level, Main.Levels[level], false);
            });
            game.state.start("boot");
        }
        function preload() {
            if (loaded) {
                return;
            }
            game.load.image("menubackground", "assets/images/menubackground.png");
            game.load.image("occluder", "assets/images/occluder.png");
            game.load.tilemap("level1", "assets/tilemaps/level1.json", null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap("level2", "assets/tilemaps/level2.json", null, Phaser.Tilemap.TILED_JSON);
            game.load.tilemap("level3", "assets/tilemaps/level3.json", null, Phaser.Tilemap.TILED_JSON);
            game.load.tileset("tiles", "assets/tilesets/tiles_spritesheet.png", cfg.TILE_WIDTH, cfg.TILE_HEIGHT);
            game.load.atlas("p1", "assets/sprites/p1_spritesheet.png", "assets/sprites/p1_spritesheet.json");
            game.load.atlasXML("items", "assets/sprites/items_spritesheet.png", "assets/sprites/items_spritesheet.xml");
            game.load.spritesheet("blocks", "assets/tilesets/tiles_spritesheet.png", cfg.TILE_WIDTH, cfg.TILE_HEIGHT);
            game.load.atlasXML("particles", "assets/sprites/particles.png", "assets/sprites/particles.xml");
            game.load.audio("theme", [ "assets/sounds/happy.mp3", "assets/sounds/happy.ogg" ], true);
            game.load.audio("jumpsound", "assets/sounds/jump.wav", true);
            game.load.audio("pickupsound", "assets/sounds/pickup.wav", true);
            game.load.audio("airsound", "assets/sounds/air.wav", true);
            game.load.audio("watersound", "assets/sounds/water.wav", true);
            game.load.audio("earthsound", "assets/sounds/earth.wav", true);
            game.load.audio("firesound", "assets/sounds/fire.wav", true);
            loaded = true;
        }
        function create() {
            game.stage.backgroundColor = data.levels[game.level].background;
            createAudio();
            map = game.add.tilemap(game.level);
            tileset = game.add.tileset("tiles");
            tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);
            tileset.tiles.forEach(function(t) {
                t.enableMaxOverlapCheck = true;
            });
            cfg.FLOATING_TILES.forEach(function(tile) {
                var t = tileset.getTile(tile);
                t.setCollision(false, false, true, false);
            });
            cfg.UPWARD_SLOPE_TILES.forEach(function(tile) {
                var t = tileset.getTile(tile);
                t.setCollision(false, false, true, false);
                t.enableMaxOverlapCheck = false;
            });
            cfg.DOWNWARD_SLOPE_TILES.forEach(function(tile) {
                var t = tileset.getTile(tile);
                t.setCollision(false, false, true, false);
                t.enableMaxOverlapCheck = false;
            });
            cfg.BACKGROUND_TILES.forEach(function(tile) {
                tileset.setCollision(tile, false, false, false, false);
            });
            createClouds();
            backbackground = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 0);
            background = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 1);
            surface = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 2);
            surface.resizeWorld();
            createBlocks();
            createBackgroundItems();
            createHelpText();
            addGoal();
            addPlayer();
            createItems();
            createEmitters();
            occluder = game.add.sprite(player.x, player.y, "occluder");
            occluder.anchor.setTo(.5, .5);
            occluder.scale.setTo(10, 10);
            game.add.tween(occluder).to({
                alpha: 0
            }, cfg.LEVEL_FADEIN_TIME, Phaser.Easing.Linear.None, true);
            game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);
            cursors = game.input.keyboard.createCursorKeys();
            elemButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            acquireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
            dropButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
            transitioning = false;
        }
        function createAudio() {
            if (musicdone) {
                return;
            }
            [ "jumpsound", "pickupsound" ].forEach(function(s) {
                sfx[s] = game.add.audio(s);
            });
            [ "airsound", "watersound", "earthsound", "firesound" ].forEach(function(s) {
                sfx[s] = game.add.audio(s, 1, true);
            });
            musicdone = true;
        }
        function createClouds() {
            if (data.levels[game.level].clouds) {
                clouds = game.add.group();
                u.range(10).forEach(function() {
                    var offset = cfg.CLOUD_MOVE_OFFSET * game.rnd.realInRange(.8, 1.2);
                    var c = clouds.create(game.rnd.integerInRange(0, data.levels[game.level].width), game.rnd.integerInRange(0, data.levels[game.level].height), "items");
                    c.animations.add("cloud", [ game.rnd.pick([ "cloud1.png", "cloud2.png", "cloud3.png" ]) ], 1, false, false);
                    c.animations.play("cloud");
                    game.add.tween(c).to({
                        x: c.x - offset
                    }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Linear.None).to({
                        x: c.x - offset - 100
                    }, 3e3, Phaser.Easing.Quadratic.Out).to({
                        x: c.x - offset
                    }, 3e3, Phaser.Easing.Quadratic.In).to({
                        x: c.x + offset
                    }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Linear.None).to({
                        x: c.x + offset + 100
                    }, 3e3, Phaser.Easing.Quadratic.Out).to({
                        x: c.x + offset
                    }, 3e3, Phaser.Easing.Quadratic.In).loop().start();
                });
            }
        }
        function createBlocks() {
            blocks = game.add.group();
            createLevelElements(data.levels[game.level].blocks, blocks, "blocks");
        }
        function createBackgroundItems() {
            backgroundItems = game.add.group();
            createLevelElements(data.levels[game.level].backgroundItems, backgroundItems, "items");
        }
        function createHelpText() {
            if (data.levels[game.level].text) {
                data.levels[game.level].text.forEach(function(text) {
                    var t = game.add.text(text.x, text.y, text.msg, text.style);
                    t.anchor.setTo(.5, .5);
                });
            }
        }
        function createItems() {
            items = game.add.group();
            createLevelElements(data.levels[game.level].items, items, "items");
        }
        function createLevelElements(elems, group, type) {
            var addLevelElement = function(el) {
                var e = group.create(el.x, el.y, type, el.frameName || el.frameId);
                e.elemType = el.elemType;
                e.body.allowGravity = !el.noGravity;
                e.body.gravity.y = cfg.ELEM_GRAVITY;
                e.body.collideWorldBounds = true;
                if (el.body) {
                    e.body.setSize(el.body.width || e.body.sourceWidth, el.body.height || e.body.sourceHeight, el.body.x || e.body.offset.x, el.body.y || e.body.offset.y);
                    e.body.immovable = el.body.immovable || e.body.immovable;
                    e.body.gravity.y = el.body.gravity || cfg.ELEM_GRAVITY;
                }
                if (el.props) {
                    for (var prop in el.props) {
                        if (el.props.hasOwnProperty(prop)) {
                            e[prop] = el.props[prop];
                        }
                    }
                }
                if (el.tween) {
                    var tween = game.add.tween(e);
                    el.tween.forEach(function(t) {
                        tween = tween.to({
                            x: e.x + t.x,
                            y: e.y + t.y
                        }, t.duration, t.easing);
                    });
                    if (el.tweenLoop) {
                        tween.loop();
                    }
                    tween.start();
                }
            };
            elems.forEach(addLevelElement);
        }
        function createEmitters() {
            data.levels[game.level].elements.forEach(function(elem) {
                var emitter = game.add.emitter(0, 0, cfg.MAX_PARTICLES);
                emitter.element = elem.element;
                emitter.makeParticles("particles", [ elem.frameName ], elem.num, true, true);
                emitter.gravity = elem.gravity || emitter.gravity;
                emitter.lifespan = elem.lifespan || emitter.lifespan;
                if (elem.particleScale) {
                    emitter.minParticleScale = elem.particleScale.min;
                    emitter.maxParticleScale = elem.particleScale.max;
                }
                if (elem.angularVel) {
                    emitter.setRotation(elem.angularVel.min, elem.angularVel.max);
                }
                if (elem.speedX) {
                    emitter.setXSpeed(elem.speedX.min, elem.speedX.max);
                }
                if (elem.speedY) {
                    emitter.setYSpeed(elem.speedY.min, elem.speedY.max);
                }
                emitter.forEach(function(child) {
                    child.kill();
                });
                elemEmitters[elem.element] = emitter;
            });
        }
        function addPlayer(x, y) {
            x = x || data.levels[game.level].player.x;
            y = y || data.levels[game.level].player.y;
            player = game.add.sprite(x, y, "p1");
            player.body.collideWorldBounds = true;
            player.body.blockable = true;
            player.body.gravity.y = cfg.GRAVITY;
            player.body.setSize(cfg.PLAYER_BOUND_WIDTH, cfg.PLAYER_BOUND_HEIGHT, 0, cfg.PLAYER_BOUND_H_OFFSET);
            player.anchor.setTo(.5, .5);
            player.animations.add("stand", [ "p1_stand" ], 1, false, false);
            player.animations.add("use", [ "p1_use" ], 1, false, false);
            player.animations.add("duck", [ "p1_duck" ], 1, false, false);
            player.animations.add("hurt", [ "p1_hurt" ], 1, false, false);
            player.animations.add("jump", [ "p1_jump" ], 1, false, false);
            player.animations.add("front", [ "p1_front" ], 1, false, false);
            player.animations.add("walk", Phaser.Animation.generateFrameNames("p1_walk", 1, 11, "", 2), 15, true, false);
            player.animations.play("stand");
        }
        function addGoal() {
            if (data.levels[game.level].goal) {
                var g = data.levels[game.level].goal;
                goal = game.add.sprite(g.x, g.y, "blocks", cfg.GOAL_TILE);
                if (g.width) {
                    goal.width = g.width;
                }
                goal.alpha = 0;
            }
        }
        function update() {
            if (gotoNext) {
                gotoNext = false;
                game.state.start(game.nextState);
            }
            var emitter = elemEmitters[player.element] || null;
            game.physics.overlap(player, goal, function() {
                if (!transitioning) {
                    transitioning = true;
                    occluder.x = player.x;
                    occluder.y = player.y;
                    var tween = game.add.tween(occluder).to({
                        alpha: 1
                    }, cfg.LEVEL_FADEOUT_TIME, Phaser.Easing.Linear.None, true);
                    tween.onComplete.addOnce(function() {
                        gotoNext = true;
                    });
                }
            });
            game.physics.collide(player, surface);
            game.physics.collide(player, blocks);
            game.physics.collide(items, surface);
            game.physics.collide(blocks, surface);
            game.physics.collide(blocks, blocks);
            if (emitter) {
                game.physics.collide(emitter, surface);
                game.physics.overlap(emitter, blocks, function(particle, block) {
                    if (block.collideParticle) {
                        block.collideParticle(particle, block);
                    }
                    block.isDisappearing = true;
                    block.lifespan = cfg.ITEM_FADE_TIME;
                }, function(particle, block) {
                    if (block.isDisappearing) {
                        return false;
                    }
                    if (block.checkCollideParticle) {
                        return block.checkCollideParticle(particle, block);
                    }
                    return false;
                });
                emitter.forEachAlive(function(p) {
                    p.alpha = p.lifespan / emitter.lifespan;
                });
                if (player.elementWasDropped && emitter.countLiving() === 0) {
                    player.element = null;
                    player.elementWasDropped = false;
                }
            }
            if (player.body.touching.down) {
                player.body.velocity.x = 0;
                if (player.airborne !== false) {
                    player.animations.play("stand");
                    player.facing = "idle";
                    player.airborne = false;
                }
            } else {
                player.airborne = true;
            }
            if (cursors.left.isDown) {
                player.body.velocity.x = -cfg.MOVEMENT_VEL;
                if (player.facing !== "left") {
                    if (!player.airborne) {
                        player.animations.play("walk");
                    }
                    player.facing = "left";
                    player.flipped = true;
                }
            } else if (cursors.right.isDown) {
                player.body.velocity.x = cfg.MOVEMENT_VEL;
                if (player.facing !== "right") {
                    if (!player.airborne) {
                        player.animations.play("walk");
                    }
                    player.facing = "right";
                    player.flipped = false;
                }
            } else if (cursors.down.isDown) {
                player.body.velocity.x = 0;
                if (player.facing !== "down") {
                    if (!player.airborne) {
                        player.animations.play("duck");
                    }
                    player.facing = "down";
                }
            } else if (!player.airborne) {
                if (player.facing !== "idle") {
                    player.animations.play("stand");
                    player.facing = "idle";
                }
            }
            if (cursors.up.isDown && player.body.touching.down) {
                player.body.velocity.y = -cfg.JUMP_VEL;
                player.animations.play("jump");
                player.airborne = true;
                sfx.jumpsound.play("", 0, .3);
            }
            if (acquireButton.isDown) {
                game.physics.overlap(player, items, function(player, item) {
                    player.currentItem = item;
                    if (item.acquire) {
                        item.acquire(player, item);
                    }
                    item.isBeingAcquired = true;
                    item.lifespan = cfg.ITEM_FADE_TIME;
                    sfx.pickupsound.play("", .6);
                }, function(player, item) {
                    if (item.isBeingAcquired) {
                        return false;
                    }
                    if (item.checkAcquirable) {
                        return item.checkAcquirable(player, item);
                    }
                    return false;
                });
            }
            if (dropButton.isDown && player.currentItem && player.currentItem.lifespan <= 0) {
                player.currentItem.revive();
                player.currentItem.isBeingAcquired = false;
                player.currentItem.alpha = 1;
                player.currentItem.body.x = player.body.x;
                player.currentItem.body.y = player.body.y + cfg.ITEM_ACQUIRE_OFFSET;
                player.currentItem.body.velocity.setTo(0, cfg.ITEM_DROP_VEL);
                if (player.currentItem.drop) {
                    player.currentItem.drop(player, player.currentItem);
                }
                player.currentItem = null;
            }
            items.forEachAlive(function(i) {
                if (i.isBeingAcquired) {
                    var t = (cfg.ITEM_FADE_TIME - i.lifespan) / cfg.ITEM_FADE_TIME;
                    i.alpha = -1 * t * t + 1;
                    game.physics.moveToXY(i, player.body.x, player.body.y + cfg.ITEM_ACQUIRE_OFFSET, null, i.lifespan);
                }
            });
            blocks.forEachAlive(function(b) {
                if (b.isDisappearing) {
                    b.alpha = b.lifespan / cfg.BLOCK_FADE_TIME;
                }
            });
            if (emitter) {
                if (player.hasElement && elemButton.isDown && player.facing === "idle" && !player.airborne) {
                    if (!player.isFiring) {
                        player.animations.play("use");
                        if (!player.flipped) {
                            emitter.emitX = player.x + cfg.PARTICLE_X_OFFSET;
                            emitter.emitY = player.y + cfg.PARTICLE_Y_OFFSET;
                            emitter.flipped = false;
                        } else {
                            emitter.emitX = player.x - cfg.PARTICLE_X_OFFSET;
                            emitter.emitY = player.y + cfg.PARTICLE_Y_OFFSET;
                            emitter.flipped = true;
                        }
                    }
                    player.isFiring = true;
                    if (!sfx[player.element + "sound"].isPlaying) {
                        sfx[player.element + "sound"].play();
                    }
                    emitter.emitParticle();
                } else {
                    if (player.isFiring && player.facing === "idle" && !player.airborne) {
                        player.animations.play("stand");
                    }
                    player.isFiring = false;
                    if (player.element && sfx[player.element + "sound"].isPlaying) {
                        sfx[player.element + "sound"].stop();
                    }
                }
            }
            if (player.flipped) {
                player.scale.x = -1;
            } else {
                player.scale.x = 1;
            }
        }
        function render() {}
        window.onload = boot;
    }, {
        "./config": 1,
        "./data": 2,
        "./extensions": 3,
        "./overrides": 5,
        "./utils": 6
    } ],
    5: [ function(require, module, exports) {
        if (typeof Phaser !== "undefined") {
            Phaser.Physics.Arcade.prototype.separateTileX = function(body, tile, separate) {
                if (body.immovable || body.deltaX() === 0 || Phaser.Rectangle.intersects(body.hullX, tile) === false) {
                    return false;
                }
                this._overlap = 0;
                this._maxOverlap = body.deltaAbsX() + this.OVERLAP_BIAS;
                if (body.deltaX() < 0) {
                    this._overlap = tile.right - body.hullX.x;
                    if (tile.tile.enableMaxOverlapCheck && this._overlap > this._maxOverlap || body.allowCollision.left === false || tile.tile.collideRight === false) {
                        this._overlap = 0;
                    } else {
                        body.touching.left = true;
                    }
                } else {
                    this._overlap = body.hullX.right - tile.x;
                    if (tile.tile.enableMaxOverlapCheck && this._overlap > this._maxOverlap || body.allowCollision.right === false || tile.tile.collideLeft === false) {
                        this._overlap = 0;
                    } else {
                        body.touching.right = true;
                    }
                }
                if (this._overlap !== 0) {
                    if (separate) {
                        if (body.deltaX() < 0) {
                            body.x = body.x + this._overlap;
                        } else {
                            body.x = body.x - this._overlap;
                        }
                        if (body.bounce.x === 0) {
                            body.velocity.x = 0;
                        } else {
                            body.velocity.x = -body.velocity.x * body.bounce.x;
                        }
                        body.updateHulls();
                    }
                    return true;
                } else {
                    return false;
                }
            };
            Phaser.Physics.Arcade.prototype.separateTileY = function(body, tile, separate) {
                if (body.immovable || body.deltaY() === 0 || Phaser.Rectangle.intersects(body.hullY, tile) === false) {
                    return false;
                }
                this._overlap = 0;
                this._maxOverlap = body.deltaAbsY() + this.OVERLAP_BIAS;
                if (body.deltaY() < 0) {
                    this._overlap = tile.bottom - body.hullY.y;
                    if (tile.tile.enableMaxOverlapCheck && this._overlap > this._maxOverlap || body.allowCollision.up === false || tile.tile.collideDown === false) {
                        this._overlap = 0;
                    } else {
                        body.touching.up = true;
                    }
                } else {
                    this._overlap = body.hullY.bottom - tile.y;
                    if (tile.tile.enableMaxOverlapCheck && this._overlap > this._maxOverlap || body.allowCollision.down === false || tile.tile.collideUp === false) {
                        this._overlap = 0;
                    } else {
                        body.touching.down = true;
                    }
                }
                if (this._overlap !== 0) {
                    if (separate) {
                        if (body.deltaY() < 0) {
                            body.y = body.y + this._overlap;
                        } else {
                            body.y = body.y - this._overlap;
                        }
                        if (body.bounce.y === 0) {
                            body.velocity.y = 0;
                        } else {
                            body.velocity.y = -body.velocity.y * body.bounce.y;
                        }
                        body.updateHulls();
                    }
                    return true;
                } else {
                    return false;
                }
            };
            Phaser.Physics.Arcade.prototype.moveToXY = function(displayObject, x, y, speed, maxTime) {
                if (typeof speed === "undefined") {
                    speed = 60;
                }
                if (typeof maxTime === "undefined") {
                    maxTime = 0;
                }
                this._angle = Math.atan2(y - displayObject.body.y, x - displayObject.body.x);
                if (maxTime > 0) {
                    speed = this.distanceToXY(displayObject, x, y) / (maxTime / 1e3);
                }
                displayObject.body.velocity.x = Math.cos(this._angle) * speed;
                displayObject.body.velocity.y = Math.sin(this._angle) * speed;
                return this._angle;
            };
            Phaser.Physics.Arcade.prototype.distanceToXY = function(displayObject, x, y) {
                this._dx = displayObject.body.x - x;
                this._dy = displayObject.body.y - y;
                return Math.sqrt(this._dx * this._dx + this._dy * this._dy);
            };
            Phaser.Physics.Arcade.prototype.angleToXY = function(displayObject, x, y) {
                this._dx = x - displayObject.body.x;
                this._dy = y - displayObject.body.y;
                return Math.atan2(this._dy, this._dx);
            };
            Phaser.Particles.Arcade.Emitter.prototype.emitParticle = function() {
                var particle = this.getFirstExists(false);
                if (particle == null) {
                    return;
                }
                if (this.width > 1 || this.height > 1) {
                    particle.reset(this.game.rnd.integerInRange(this.left, this.right), this.game.rnd.integerInRange(this.top, this.bottom));
                } else {
                    particle.reset(this.emitX, this.emitY);
                }
                particle.lifespan = this.lifespan;
                particle.body.bounce.setTo(this.bounce.x, this.bounce.y);
                if (this.minParticleSpeed.x != this.maxParticleSpeed.x) {
                    particle.body.velocity.x = this.game.rnd.integerInRange(this.minParticleSpeed.x, this.maxParticleSpeed.x);
                } else {
                    particle.body.velocity.x = this.minParticleSpeed.x;
                }
                if (this.minParticleSpeed.y != this.maxParticleSpeed.y) {
                    particle.body.velocity.y = this.game.rnd.integerInRange(this.minParticleSpeed.y, this.maxParticleSpeed.y);
                } else {
                    particle.body.velocity.y = this.minParticleSpeed.y;
                }
                particle.body.gravity.y = this.gravity;
                if (this.minRotation != this.maxRotation) {
                    particle.body.angularVelocity = this.game.rnd.integerInRange(this.minRotation, this.maxRotation);
                } else {
                    particle.body.angularVelocity = this.minRotation;
                }
                if (this.minParticleScale !== 1 || this.maxParticleScale !== 1) {
                    var scale = this.game.rnd.realInRange(this.minParticleScale, this.maxParticleScale);
                    particle.scale.setTo(scale, scale);
                }
                if (this.flipped) {
                    particle.body.velocity.x *= -1;
                    particle.body.angularVelocity *= -1;
                    particle.scale.x *= -1;
                }
                particle.body.drag.x = this.particleDrag.x;
                particle.body.drag.y = this.particleDrag.y;
                particle.body.angularDrag = this.angularDrag;
            };
            Phaser.Physics.Arcade.prototype.separateX = function(body1, body2) {
                if (body1.immovable && body2.immovable) {
                    return false;
                }
                this._overlap = 0;
                if (Phaser.Rectangle.intersects(body1, body2)) {
                    this._maxOverlap = body1.deltaAbsX() + body2.deltaAbsX() + this.OVERLAP_BIAS;
                    if (body1.deltaX() === 0 && body2.deltaX() === 0) {
                        body1.embedded = true;
                        body2.embedded = true;
                    } else if (body1.deltaX() > body2.deltaX()) {
                        this._overlap = body1.x + body1.width - body2.x;
                        if (this._overlap > this._maxOverlap || body1.allowCollision.right === false || body2.allowCollision.left === false) {
                            this._overlap = 0;
                        } else {
                            body1.touching.right = true;
                            body2.touching.left = true;
                        }
                    } else if (body1.deltaX() < body2.deltaX()) {
                        this._overlap = body1.x - body2.width - body2.x;
                        if (-this._overlap > this._maxOverlap || body1.allowCollision.left === false || body2.allowCollision.right === false) {
                            this._overlap = 0;
                        } else {
                            body1.touching.left = true;
                            body2.touching.right = true;
                        }
                    }
                    if (this._overlap !== 0) {
                        body1.overlapX = this._overlap;
                        body2.overlapX = this._overlap;
                        if (body1.customSeparateX || body2.customSeparateX) {
                            return true;
                        }
                        this._velocity1 = body1.velocity.x;
                        this._velocity2 = body2.velocity.x;
                        if (!body1.immovable && !body2.immovable) {
                            if (!body1.blockable && !body2.blockable) {
                                this._overlap *= .5;
                                body1.x = body1.x - this._overlap;
                                body2.x += this._overlap;
                                this._newVelocity1 = Math.sqrt(this._velocity2 * this._velocity2 * body2.mass / body1.mass) * (this._velocity2 > 0 ? 1 : -1);
                                this._newVelocity2 = Math.sqrt(this._velocity1 * this._velocity1 * body1.mass / body2.mass) * (this._velocity1 > 0 ? 1 : -1);
                                this._average = (this._newVelocity1 + this._newVelocity2) * .5;
                                this._newVelocity1 -= this._average;
                                this._newVelocity2 -= this._average;
                                body1.velocity.x = this._average + this._newVelocity1 * body1.bounce.x;
                                body2.velocity.x = this._average + this._newVelocity2 * body2.bounce.x;
                            } else if (body1.blockable) {
                                body1.x = body1.x - this._overlap;
                                body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                            } else if (body2.blockable) {
                                body2.x += this._overlap;
                                body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                            }
                        } else if (!body1.immovable) {
                            body1.x = body1.x - this._overlap;
                            body1.velocity.x = this._velocity2 - this._velocity1 * body1.bounce.x;
                        } else if (!body2.immovable) {
                            body2.x += this._overlap;
                            body2.velocity.x = this._velocity1 - this._velocity2 * body2.bounce.x;
                        }
                        body1.updateHulls();
                        body2.updateHulls();
                        return true;
                    }
                }
                return false;
            };
            Phaser.Physics.Arcade.prototype.separateY = function(body1, body2) {
                if (body1.immovable && body2.immovable) {
                    return false;
                }
                this._overlap = 0;
                if (Phaser.Rectangle.intersects(body1, body2)) {
                    this._maxOverlap = body1.deltaAbsY() + body2.deltaAbsY() + this.OVERLAP_BIAS;
                    if (body1.deltaY() === 0 && body2.deltaY() === 0) {
                        body1.embedded = true;
                        body2.embedded = true;
                    } else if (body1.deltaY() > body2.deltaY()) {
                        this._overlap = body1.y + body1.height - body2.y;
                        if (this._overlap > this._maxOverlap || body1.allowCollision.down === false || body2.allowCollision.up === false) {
                            this._overlap = 0;
                        } else {
                            body1.touching.down = true;
                            body2.touching.up = true;
                        }
                    } else if (body1.deltaY() < body2.deltaY()) {
                        this._overlap = body1.y - body2.height - body2.y;
                        if (-this._overlap > this._maxOverlap || body1.allowCollision.up === false || body2.allowCollision.down === false) {
                            this._overlap = 0;
                        } else {
                            body1.touching.up = true;
                            body2.touching.down = true;
                        }
                    }
                    if (this._overlap !== 0) {
                        body1.overlapY = this._overlap;
                        body2.overlapY = this._overlap;
                        if (body1.customSeparateY || body2.customSeparateY) {
                            return true;
                        }
                        this._velocity1 = body1.velocity.y;
                        this._velocity2 = body2.velocity.y;
                        if (!body1.immovable && !body2.immovable) {
                            if (!body1.blockable && !body2.blockable) {
                                this._overlap *= .5;
                                body1.y = body1.y - this._overlap;
                                body2.y += this._overlap;
                                this._newVelocity1 = Math.sqrt(this._velocity2 * this._velocity2 * body2.mass / body1.mass) * (this._velocity2 > 0 ? 1 : -1);
                                this._newVelocity2 = Math.sqrt(this._velocity1 * this._velocity1 * body1.mass / body2.mass) * (this._velocity1 > 0 ? 1 : -1);
                                this._average = (this._newVelocity1 + this._newVelocity2) * .5;
                                this._newVelocity1 -= this._average;
                                this._newVelocity2 -= this._average;
                                body1.velocity.y = this._average + this._newVelocity1 * body1.bounce.y;
                                body2.velocity.y = this._average + this._newVelocity2 * body2.bounce.y;
                            } else if (body1.blockable) {
                                body1.y = body1.y - this._overlap;
                                body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;
                                if (body2.active && body2.moves && body1.deltaY() > body2.deltaY()) {
                                    body1.x += body2.x - body2.lastX;
                                }
                            } else if (body2.blockable) {
                                body2.y += this._overlap;
                                body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;
                                if (body1.sprite.active && body1.moves && body1.deltaY() < body2.deltaY()) {
                                    body2.x += body1.x - body1.lastX;
                                }
                            }
                        } else if (!body1.immovable) {
                            body1.y = body1.y - this._overlap;
                            body1.velocity.y = this._velocity2 - this._velocity1 * body1.bounce.y;
                            if (body2.active && body2.moves && body1.deltaY() > body2.deltaY()) {
                                body1.x += body2.x - body2.lastX;
                            }
                        } else if (!body2.immovable) {
                            body2.y += this._overlap;
                            body2.velocity.y = this._velocity1 - this._velocity2 * body2.bounce.y;
                            if (body1.sprite.active && body1.moves && body1.deltaY() < body2.deltaY()) {
                                body2.x += body1.x - body1.lastX;
                            }
                        }
                        body1.updateHulls();
                        body2.updateHulls();
                        return true;
                    }
                }
                return false;
            };
        }
    }, {} ],
    6: [ function(require, module, exports) {
        module.exports = {
            range: function() {
                if (!arguments.length) {
                    return [];
                }
                var min, max, step;
                if (arguments.length == 1) {
                    min = 0;
                    max = arguments[0];
                    step = 1;
                } else {
                    min = arguments[0];
                    max = arguments[1];
                    step = arguments[2] || 1;
                }
                var a = [];
                for (var i = min; i < max; i += step) {
                    a.push(i);
                }
                return a;
            }
        };
    }, {} ]
}, {}, [ 4 ]);