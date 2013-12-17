var extensions = require('./extensions');
var cfg = require('./config');

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
}

var map, tileset, surface, background, player, cursors;

function create() {
    game.stage.backgroundColor = cfg.BACKGROUND;

    map = game.add.tilemap('level1');
    tileset = game.add.tileset('tiles');

    // Set tiles to collide on all four sides
    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    // Set collisions to top-only
    (cfg.FLOATING_TILES.concat(
        cfg.UPWARD_SLOPE_TILES).concat(
        cfg.DOWNWARD_SLOPE_TILES)
    ).forEach(function(tile) {
        tileset.setCollision(tile, false, false, true, false);
    });

    // Layer 1 is the surface, layer 0 is the background
    surface = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 1);
    background = game.add.tilemapLayer(0, 0, cfg.GAME_WIDTH, cfg.GAME_HEIGHT, tileset, map, 0);
    surface.resizeWorld();

    // Add player sprite
    player = game.add.sprite(50, 510, 'p1');
    player.body.collideWorldBounds = true;
    player.body.gravity.y = cfg.GRAVITY;
    player.body.setSize(40, 75, 0, 10);

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

    game.camera.follow(player);

    cursors = game.input.keyboard.createCursorKeys();
}

function update() {
    game.physics.collide(player, surface);

    if (player.body.touching.down) {
        player.body.velocity.x = 0;
        if (player.airborne != false) {
            player.animations.play('stand');
            player.facing = 'idle';
            player.airborne = false;
        }
    }

    // Movement detection
    if (cursors.left.isDown) {
        player.body.velocity.x = -cfg.MOVEMENT_VEL;
        if (player.facing != 'left') {
            if (!player.airborne) {
                player.animations.play('walk');
            }
            player.facing = 'left';
            player.flipped = true;
        }
    } else if (cursors.right.isDown) {
        player.body.velocity.x = cfg.MOVEMENT_VEL;
        if (player.facing != 'right') {
            if (!player.airborne) {
                player.animations.play('walk');
            }
            player.facing = 'right';
            player.flipped = false;
        }
    } else if (cursors.down.isDown) {
        player.body.velocity.x = 0;
        if (player.facing != 'down') {
            if (!player.airborne) {
                player.animations.play('duck');
            }
            player.facing = 'down';
        }
    } else if (!player.airborne) {
        if (player.facing != 'idle') {
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
