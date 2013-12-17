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
}

var map, tileset, surface, background, player, clouds, items, cursors;

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

    // Add clouds
    if (data.levels.level1.clouds) {
        clouds = game.add.group();
        u.range(10).forEach(function() {
            var c = clouds.create(game.rnd.integerInRange(0, data.levels.level1.width), game.rnd.integerInRange(0, data.levels.level1.height), 'items');
            clouds.add(c);
            c.animations.add('cloud', [game.rnd.pick(['cloud1.png', 'cloud2.png', 'cloud3.png'])], 1, false, false);
            c.animations.play('cloud');
            game.add.tween(c).to({ x: c.x - cfg.CLOUD_MOVE_OFFSET }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Cubic.InOut)
                             .to({ x: c.x + cfg.CLOUD_MOVE_OFFSET }, cfg.CLOUD_MOVE_TIME, Phaser.Easing.Cubic.InOut).loop().start();
        });
    }

    // Layer 1 is the surface, layer 0 is the background
    surface = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 1);
    background = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 0);
    surface.resizeWorld();

    // Add player sprite
    player = game.add.sprite(data.levels.level1.player.x, data.levels.level1.player.y, 'p1');
    player.body.collideWorldBounds = true;
    player.body.gravity.y = cfg.GRAVITY;
    player.body.setSize(cfg.PLAYER_BOUND_WIDTH, cfg.PLAYER_BOUND_HEIGHT, 0, cfg.PLAYER_BOUND_H_OFFSET);

    player.anchor.setTo(0.5, 0.5);

    // Animations are used for still frames as well, for convenience
    player.animations.add('stand', ['p1_stand'], 1, false, false);
    player.animations.add('duck', ['p1_duck'], 1, false, false);
    player.animations.add('hurt', ['p1_hurt'], 1, false, false);
    player.animations.add('jump', ['p1_jump'], 1, false, false);
    player.animations.add('front', ['p1_front'], 1, false, false);
    player.animations.add('walk',
        Phaser.Animation.generateFrameNames('p1_walk', 1, 11, '', 2), 15, true, false);

    player.animations.play('stand');

    game.camera.follow(player, Phaser.Camera.FOLLOW_PLATFORMER);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.collide(player, surface);

    if (player.body.touching.down) {
        player.body.velocity.x = 0;
        if (player.airborne !== false) {
            player.animations.play('stand');
            player.facing = 'idle';
            player.airborne = false;
        }
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

    // Flip player sprite
    if (player.flipped) {
        player.scale.x = -1;
    } else {
        player.scale.x = 1;
    }
}

function render() {
    // game.debug.renderSpriteBody(player);
}
