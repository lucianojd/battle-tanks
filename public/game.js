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
    var scene;    //Reference to the scene.
    var gm;       //GameManager
    var player;   //Player's tank.
    var opponent; //Opponent's tank.
    var socket;   //Socket.
    var ids = {
        'player': '',
        'opponent': ''
    }; //Place to store socket ids. Not currently used but may be useful.

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
        //Save scene reference.
        scene = this;

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

        //Create GameManager and Player.
        socket = io();
        gm     = new GameManager(this, socket);
        player = new LightTank(this, 'player', 'red-tank', 100, 540);

        //Get my socket id.
        socket.on('connect', (id) => {
            ids['player'] = id;
        });

        //Handles connecting the two players.
        socket.on('playerJoined', (params) => {
            if(params['firstToJoin'] == false) {
                gm.setState('PlayerTurn');
                socket.emit('playerJoined', {'firstToJoin': true, 'id': ids['player']});
            } else {
                gm.setState('OpponentTurn');
            }

            ids['opponent'] = params['id'];
            opponent = new LightTank(scene, 'opponent', 'blue-tank', 1180, 540);
        })

        //Incoming tank moves are handled here.
        socket.on('sendTankMove', (move) => {
            console.log(move);
            gm.handleBroadcast('sendTankMove', move);
        });

        //Handle opponent firing shell.
        socket.on('fireTankShell', (move) => {

        });

        //Recevies time update from other player.
        socket.on('sendTimeUpdate', (time) => {

        });
    }

    function update () {
        if(gm.getState() == GameState['WaitingForPlayers']) 
        {
            //Do nothing.
        } 
        else if(gm.getState() == GameState['PlayerTurn'])
        {
            gm.setCurrentTank(player);
            gm.handleInput();
        }
        else if(gm.getState() == GameState['OpponentTurn'])
        {
            gm.setCurrentTank(opponent);
        }
        else if(gm.getState() == GameState['Finished'])
        {

        }

        //Check for updates from tanks.
        if(opponent != null) {
            if(opponent.checkUpdate()) {
                gm.notifyTankChange(opponent);
            }
        }
        if(player.checkUpdate()) {
            gm.notifyTankChange(player);
        }
    }
}