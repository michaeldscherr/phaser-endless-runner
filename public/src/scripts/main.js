(function(Phaser, _) {

    let game = new Phaser.Game(window.innerWidth, 350, Phaser.CANVAS);
    let cursors = null;
    let bgParallax = {};

    const rootDir = '.';
    const assetsDir = rootDir + '/assets';
    const srcDir = rootDir + '/src';

    const Coin = function(x, y, speed) {
        Phaser.Sprite.call(this, game, x, y, 'coins');
        game.physics.enable(this, Phaser.Physics.ARCADE);
    };

    Coin.prototype = Object.create(Phaser.Sprite.prototype);
    Coin.prototype.constructor = Coin;

    Coin.prototype.update = function() {

    };

    const EndlessRunner = function() {
        this.player = null;
        this.coinGroup = null;
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
        moveBGParallax() {
            bgParallax.sky.tilePosition.x -= 1;
            bgParallax.clouds.tilePosition.x -= 2;
            bgParallax.hills.tilePosition.x -= 4;
        },
        preload() {
            this.load.spritesheet(
                'player',
                assetsDir + '/players/nimble-boy/nimble-boy.png',
                69,
                70
            );
            this.load.image(
                'hills',
                assetsDir + '/background/simple-hills/hills.png'
            );
            this.load.image(
                'sky',
                assetsDir + '/background/simple-hills/sky.png'
            );
            this.load.image(
                'clouds',
                assetsDir + '/background/simple-hills/clouds.png'
            );
            this.load.spritesheet(
                'coins',
                assetsDir + '/items/coins.png',
                366,
                250
            );
        },
        addEventBindings() {
            this.spacebar.onDown.add(this.checkDoubleJump, this);
        },
        addAnimations() {
            this.player.animations.add('dash', [0, 1, 2], 10, true);
        },
        addCoin() {
            let coin = new Coin();
            game.add.existing(coin);
            this.coinGroup.add(coin);
        },
        create() {
            // physics
            this.physics.startSystem(Phaser.Physics.Arcade);
            // stage
            this.stage.backgroundColor = '#A5D3EE';
            // background parallax elements
            bgParallax.sky = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'sky');
            bgParallax.clouds = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'clouds');
            bgParallax.hills = game.add.tileSprite(0, 0, this.world.width, this.world.height, 'hills');
            // player
            this.player = this.add.sprite(32, 50, 'player');
            this.physics.arcade.enable(this.player);
            this.player.body.collideWorldBounds = true;
            this.player.body.bounce.y = 0.2;
            this.player.body.gravity.y = 1000;
            // coins
            this.coinGroup = this.add.group();
            this.addCoin();
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
            // parallax
            this.moveBGParallax();
            // jumping
            if (this.player.body.onFloor()) {
                this.jumpCount = 0;
            }
        }
    };

    game.state.add('play', EndlessRunner, true);

})(window.Phaser, window._);
