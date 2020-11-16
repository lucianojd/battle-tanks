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
    var date = new Date();
    var gm;       //GameManager
    var im;       //InputManager
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
        gm = new GameManager(this);
        im = new InputManager(this);
        player = new LightTank(this, 'green-tank', 100, 540);
        opponent = new LightTank(this, 'purple-tank', 1280-100, 540);

        gm.setCurrentTank(player);
    }

    function update () {
        gm.handleInput();
    }
}