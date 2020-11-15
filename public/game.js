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
    var gm;

    function preload () {
        //Load Map Images
        this.load.image("background", "/assets/background.png");
        this.load.image("ground"    , "/assets/ground.png");

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
    }

    function update () {

    }
}