window.onload = function () {
    var config = {
        type: Phaser.AUTO,
        width: 1280,
        height: 720,
        scene: {
            preload: preload,
            create: create,
            update: update
        },
        physics: {
            default: "arcade",
            arcade: {
                debug: false
            }
        }
    };

    var game = new Phaser.Game(config);
    var gm;       //GameManager
    var player;   //Player's tank.
    var opponent; //Opponent's tank.

    function preload () {
        //Load Map Images
        this.load.image("background", "/assets/background.png");
        this.load.image("ground"    , "/assets/ground.png");
        this.load.image("wall"      , "/assets/wall.png");

        //Load Tank images.
        this.load.image("red-tank"   , "/assets/red.png");
        this.load.image("blue-tank"  , "/assets/blue.png");
        this.load.image("green-tank" , "/assets/green.png");
        this.load.image("purple-tank", "/assets/purple.png");
        this.load.image("yellow-tank", "/assets/yellow.png");

        //Load TankShell images.
        this.load.image("red-shell"   , "/assets/red-bullet.png");
        this.load.image("blue-shell"  , "/assets/blue-bullet.png");
        this.load.image("green-shell" , "/assets/green-bullet.png")
    }

    function create () {
        //Add the background.
        this.background = this.add.image(0,0,'background').setOrigin(0,0);

        //Add the ground.
        this.ground = this.physics.add.staticGroup();
        this.ground.create(640, 710, 'ground');

        //Add the wall.
        this.wall = this.physics.add.staticGroup();
        this.wall.create(640, 610, 'wall');

        //Physics groups for tanks and shells.
        this.tanks = this.physics.add.group();
        this.shells = this.physics.add.group();

        //Tanks collide with ground and walls.
        this.physics.add.collider(this.tanks, this.ground);
        this.physics.add.collider(this.tanks, this.wall);

        //Shells are destroyed when colliding with the ground, not on walls.
        this.physics.add.collider(this.shells, this.wall);
        this.physics.add.collider(this.shells, this.ground, function(shell, ground) {
            shell.destroy();
        });

        //Shell and tank collide, deal damage and destroy shell.
        this.physics.add.overlap(this.tanks, this.shells, function(tank, shell) {
            tank.myref.damage(shell.myref.getDamage());
            shell.destroy();
        });

        gm       = new GameManager(this);
        player   = new LightTank(this, 'player', 'green-tank', 100, 540);
        opponent = new LightTank(this, 'opponent', 'purple-tank', 1280-100, 540);

        //This sets the current tank to be controlled.
        gm.setCurrentTank(player);
    }

    function update () {
        gm.handleInput();
        if(player.checkUpdate()) {
            gm.notifyTankChange(player);
        }
        if(opponent.checkUpdate) {
            gm.notifyTankChange(opponent);
        }
    }
}