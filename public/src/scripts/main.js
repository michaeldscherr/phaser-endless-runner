(function(Phaser, _) {

    let game = new Phaser.Game(1000, 350, Phaser.CANVAS);
    let cursors = null;

    const rootDir = '.';
    const assetsDir = rootDir + '/assets';
    const srcDir = rootDir + '/src';

    const EndlessRunner = function() {
        this.player = null;
    };

    EndlessRunner.prototype = {
        jump() {
            this.player.body.velocity.y = -450;
        },
        checkDoubleJump() {
            if (this.jumpCount < this.jumpMax) {
                this.jump();
                this.jumpCount++;
            }
        },
        preload() {
            this.load.spritesheet(
                'player',
                assetsDir + '/players/nimble-boy/nimble-boy.png',
                69,
                70
            );
        },
        addEventBindings() {
            this.spacebar.onDown.add(this.checkDoubleJump, this);
        },
        addAnimations() {
            this.player.animations.add('dash', [0, 1, 2], 10, true);
        },
        create() {
            // physics
            this.physics.startSystem(Phaser.Physics.Arcade);
            // stage
            this.stage.backgroundColor = '#8F9E6F';
            // player
            this.player = this.add.sprite(32, 50, 'player');
            this.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.bounce.y = 0.2;
            this.player.body.gravity.y = 1000;
            // jumping
            this.jumpMax = 2;
            this.jumpCount = 0;
            // spacebar
            this.spacebar = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
            this.addEventBindings();
            this.addAnimations();
        },
        update() {
            cursors = game.input.keyboard.createCursorKeys();
            // animation
            this.player.animations.play('dash');
            // jumping
            if (this.player.body.onFloor()) {
                this.jumpCount = 0;
            }
        }
    };

    game.state.add('play', EndlessRunner, true);

})(window.Phaser, window._);
