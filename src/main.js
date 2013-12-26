var _ = require('./overrides');
var u = require('./utils');
var extensions = require('./extensions');
var cfg = require('./config');
var data = require('./data');

/**
 * Game code
 */
var game = new Phaser.Game(cfg.GAME_WIDTH, cfg.GAME_HEIGHT, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    /**
     * Custom configuration
     */
    game.physics.collideSpriteVsTilemapLayer = extensions.createSlopedTilemapCollider(
        cfg.UPWARD_SLOPE_TILES,
        cfg.DOWNWARD_SLOPE_TILES);

    game.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/tilesets/tiles_spritesheet.png', cfg.TILE_WIDTH, cfg.TILE_HEIGHT);

    game.load.atlas('p1', 'assets/sprites/p1_spritesheet.png', 'assets/sprites/p1_spritesheet.json');

    game.load.atlasXML('items', 'assets/sprites/items_spritesheet.png', 'assets/sprites/items_spritesheet.xml');
    game.load.spritesheet('blocks', 'assets/tilesets/tiles_spritesheet.png', cfg.TILE_WIDTH, cfg.TILE_HEIGHT);
    game.load.atlasXML('particles', 'assets/sprites/particles.png', 'assets/sprites/particles.xml');
}

var map, tileset, surface, background,
    player, clouds, items, blocks,
    elemEmitters = {},
    cursors, elemButton, acquireButton, dropButton;

function create() {
    game.stage.backgroundColor = cfg.BACKGROUND;

    map = game.add.tilemap('level1');
    tileset = game.add.tileset('tiles');

    // Set tiles to collide on all four sides
    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    // Set tile collisions
    cfg.FLOATING_TILES.forEach(function(tile) {
        var t = tileset.getTile(tile);
        t.setCollision(false, false, true, false);
        t.disableMaxOverlapCheck = false;
    });
    cfg.UPWARD_SLOPE_TILES.forEach(function(tile) {
        var t = tileset.getTile(tile);
        t.setCollision(false, false, true, false);
        t.disableMaxOverlapCheck = true;
    });
    cfg.DOWNWARD_SLOPE_TILES.forEach(function(tile) {
        var t = tileset.getTile(tile);
        t.setCollision(false, false, true, false);
        t.disableMaxOverlapCheck = true;
    });
    cfg.BACKGROUND_TILES.forEach(function(tile) {
        tileset.setCollision(tile, false, false, false, false);
    });

    createClouds();

    // Layer 1 is the surface, layer 0 is the background
    background = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 0);
    surface = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 1);
    surface.resizeWorld();

    createBlocks();
    addPlayer();
    createItems();
    createEmitters();

    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    cursors = game.input.keyboard.createCursorKeys();
    elemButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    acquireButton = game.input.keyboard.addKey(Phaser.Keyboard.Z);
    dropButton = game.input.keyboard.addKey(Phaser.Keyboard.X);
}

function createClouds() {
    if (data.levels.level1.clouds) {
        clouds = game.add.group();
        u.range(10).forEach(function() {
            var offset = cfg.CLOUD_MOVE_OFFSET * game.rnd.realInRange(0.8, 1.2);
            var c = clouds.create(game.rnd.integerInRange(0, data.levels.level1.width), game.rnd.integerInRange(0, data.levels.level1.height), 'items');
            c.animations.add('cloud', [game.rnd.pick(['cloud1.png', 'cloud2.png', 'cloud3.png'])], 1, false, false);
            c.animations.play('cloud');
            game.add.tween(c).to({ x: c.x - offset }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Linear.None)
                             .to({ x: c.x - offset - 100 }, 3000, Phaser.Easing.Quadratic.Out)
                             .to({ x: c.x - offset }, 3000, Phaser.Easing.Quadratic.In)
                             .to({ x: c.x + offset }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Linear.None)
                             .to({ x: c.x + offset + 100 }, 3000, Phaser.Easing.Quadratic.Out)
                             .to({ x: c.x + offset }, 3000, Phaser.Easing.Quadratic.In)
                             .loop().start();
        });
    }
}

function createItems() {
    items = game.add.group();
    createLevelElements(data.levels.level1.items, items, 'items');
}

function createBlocks() {
    blocks = game.add.group();
    createLevelElements(data.levels.level1.blocks, blocks, 'blocks');
}

function createLevelElements(elems, group, type) {
    var addLevelElement = function(el) {
        var e = group.create(el.x, el.y, type, el.frameName || el.frameId);
        e.elemType = el.elemType;

        e.body.gravity.y = cfg.ELEM_GRAVITY;
        e.body.collideWorldBounds = true;

        if (el.body) {
            e.body.setSize(el.body.width || e.body.sourceWidth,
                           el.body.height || e.body.sourceHeight,
                           el.body.x || e.body.offset.x,
                           el.body.y || e.body.offset.y);
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
    };

    elems.forEach(addLevelElement);
}

function createEmitters() {
    data.levels.level1.elements.forEach(function(elem) {
        var emitter = game.add.emitter(0, 0, cfg.MAX_PARTICLES);
        emitter.element = elem.element;
        emitter.makeParticles('particles', [elem.frameName], elem.num, true, true);

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

        elemEmitters[elem.element] = emitter;
    });
}

function addPlayer() {
    player = game.add.sprite(data.levels.level1.player.x, data.levels.level1.player.y, 'p1');
    player.body.collideWorldBounds = true;
    player.body.blockable = true;
    player.body.gravity.y = cfg.GRAVITY;
    player.body.setSize(cfg.PLAYER_BOUND_WIDTH, cfg.PLAYER_BOUND_HEIGHT, 0, cfg.PLAYER_BOUND_H_OFFSET);

    player.anchor.setTo(0.5, 0.5);

    // Animations are used for still frames as well, for convenience
    player.animations.add('stand', ['p1_stand'], 1, false, false);
    player.animations.add('use', ['p1_use'], 1, false, false);
    player.animations.add('duck', ['p1_duck'], 1, false, false);
    player.animations.add('hurt', ['p1_hurt'], 1, false, false);
    player.animations.add('jump', ['p1_jump'], 1, false, false);
    player.animations.add('front', ['p1_front'], 1, false, false);
    player.animations.add('walk',
        Phaser.Animation.generateFrameNames('p1_walk', 1, 11, '', 2), 15, true, false);

    player.animations.play('stand');

}

function update() {
    var emitter = elemEmitters[player.element] || null;

    // Collisions
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

        // Fade out particles as time goes on
        emitter.forEachAlive(function(p) {
            p.alpha = p.lifespan / emitter.lifespan;
        });
    }


    // Reset player movement if touching ground
    // Otherwise, mark as airborne (when player hasn't jumped, but falls)
    if (player.body.touching.down) {
        player.body.velocity.x = 0;
        if (player.airborne !== false) {
            player.animations.play('stand');
            player.facing = 'idle';
            player.airborne = false;
        }
    } else {
        player.airborne = true;
    }

    // Movement detection
    if (cursors.left.isDown) {
        player.body.velocity.x = -cfg.MOVEMENT_VEL;
        if (player.facing !== 'left') {
            if (!player.airborne) {
                player.animations.play('walk');
            }
            player.facing = 'left';
            player.flipped = true;
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = cfg.MOVEMENT_VEL;
        if (player.facing !== 'right') {
            if (!player.airborne) {
                player.animations.play('walk');
            }
            player.facing = 'right';
            player.flipped = false;
        }
    } else if (cursors.down.isDown) {
        player.body.velocity.x = 0;
        if (player.facing !== 'down') {
            if (!player.airborne) {
                player.animations.play('duck');
            }
            player.facing = 'down';
        }
    } else if (!player.airborne) {
        if (player.facing !== 'idle') {
            player.animations.play('stand');
            player.facing = 'idle';
        }
    }

    // Jump detection
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -cfg.JUMP_VEL;
        player.animations.play('jump');
        player.airborne = true;
    }


    // Detect item acquisition
    if (acquireButton.isDown) {
        game.physics.overlap(player, items, function(player, item) {
            player.currentItem = item;
            if (item.acquire) {
                item.acquire(player, item);
            }
            item.isBeingAcquired = true;
            item.lifespan = cfg.ITEM_FADE_TIME;
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

    // Item fading
    items.forEachAlive(function(i) {
        if (i.isBeingAcquired) {
            // Fade with quadratic easing
            var t = (cfg.ITEM_FADE_TIME - i.lifespan) / cfg.ITEM_FADE_TIME;
            i.alpha = -1 * t * t + 1;

            // Move toward player
            game.physics.moveToXY(i, player.body.x, player.body.y + cfg.ITEM_ACQUIRE_OFFSET, null, i.lifespan);
        }
    });

    // Block fading
    blocks.forEachAlive(function(b) {
        if (b.isDisappearing) {
            b.alpha = b.lifespan / cfg.BLOCK_FADE_TIME;
        }
    });


    // Elemental emission
    if (emitter) {
        if (elemButton.isDown && player.facing === 'idle' && !player.airborne) {

            // Setup emitter properties if the player is starting to fire
            if (!player.isFiring) {
                player.animations.play('use');

                // Flip the position if needed
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

            emitter.emitParticle();
        } else {
            if (player.isFiring && player.facing === 'idle' && !player.airborne) {
                player.animations.play('stand');
            }
            player.isFiring = false;
        }
    }

    // Flip player sprite
    if (player.flipped) {
        player.scale.x = -1;
    } else {
        player.scale.x = 1;
    }
}

function render() {
    // game.debug.renderSpriteBody(player);
    // game.debug.renderSpriteBody(items.getAt(0));
    // game.debug.renderSpriteInfo(player, 150, 150);
    // game.debug.renderSpriteInfo(items.getAt(0), 450, 150);
}
