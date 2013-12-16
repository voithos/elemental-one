var GAME_WIDTH = 800,
    GAME_HEIGHT = 600,
    TILE_WIDTH = 70,
    TILE_HEIGHT = 70,
    BACKGROUND = '#d0f4f7',
    MOVEMENT_VEL = 150,
    JUMP_VEL = 250;

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, '', {
    preload: preload,
    create: create,
    update: update,
    render: render
});

function preload() {
    game.load.tilemap('level1', 'assets/tilemaps/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.tileset('tiles', 'assets/tilesets/tiles_spritesheet.png', TILE_WIDTH, TILE_HEIGHT);

    game.load.atlas('p1', 'assets/sprites/p1_spritesheet.png', 'assets/sprites/p1_spritesheet.json');
}

var map, tileset, surface, background, player, cursors;

function create() {
    game.stage.backgroundColor = BACKGROUND;

    map = game.add.tilemap('level1');
    tileset = game.add.tileset('tiles');

    // Set tiles to collide on all four sides
    tileset.setCollisionRange(0, tileset.total - 1, true, true, true, true);

    // Layer 1 is the surface, layer 0 is the background
    surface = game.add.tilemapLayer(0, 0, GAME_WIDTH, GAME_HEIGHT, tileset, map, 1);
    background = game.add.tilemapLayer(0, 0, GAME_WIDTH, GAME_HEIGHT, tileset, map, 0);
    surface.resizeWorld();

    player = game.add.sprite(50, 510, 'p1');
    player.body.collideWorldBounds = true;
    player.body.gravity.y = 6;

    player.anchor.setTo(0.5, 0.5);

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
        if (player.jumping != false) {
            player.animations.play('stand');
            player.facing = 'idle';
            player.jumping = false;
        }
    }

    // Movement detection
    if (!player.jumping) {
        if (cursors.left.isDown) {
            player.body.velocity.x = -MOVEMENT_VEL;
            if (player.facing != 'left') {
                player.animations.play('walk');
                player.facing = 'left';
                player.flipped = true;
            }
        } else if (cursors.right.isDown) {
            player.body.velocity.x = MOVEMENT_VEL;
            if (player.facing != 'right') {
                player.animations.play('walk');
                player.facing = 'right';
                player.flipped = false;
            }
        } else {
            if (player.facing != 'idle') {
                player.animations.play('stand');
                player.facing = 'idle';
            }
        }
    }

    // Jump detection
    if (cursors.up.isDown && player.body.touching.down) {
        player.body.velocity.y = -JUMP_VEL;
        player.animations.play('jump');
        player.jumping = true;
    }

    if (player.flipped) {
        player.scale.x = -1;
    } else {
        player.scale.x = 1;
    }
}

function render() {
}
