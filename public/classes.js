const GameState = {
    'WaitingForPlayers': 0,
    'Player1Turn': 1,
    'Player2Turn': 2,
    'Finished': 3
}

const FireState = {
    'SettingAngle': 0,
    'SettingPower': 1,
}

class InputManager {
    constructor(scene) {
    }

    handleInput() {

    }
}

class GameManager {
    constructor(scene) {
        this.map = new Map(scene, 'background', 'ground');
        this.state = GameState['Player1Turn'];
        this.fireState = FireState['SettingAngle'];
        this.turnLength = 30;
        this.timeLeft = 30;
        this.currentTank = null;

        this.AKey     = scene.input.keyboard.addKey('A');
        this.DKey     = scene.input.keyboard.addKey('D');
        this.ZKey     = scene.input.keyboard.addKey('Z');
        this.XKey     = scene.input.keyboard.addKey('X');
        this.CKey     = scene.input.keyboard.addKey('C');
        this.WKey     = scene.input.keyboard.addKey('W');
        this.WKeyPres = false;
        this.SKey     = scene.input.keyboard.addKey('S');

        this.pointer  = scene.input.mousePointer;

        this.fireAngle;
        this.firePower;

        this.timeText = scene.add.text(10,10, "Time left: " + this.timeLeft,{fontSize: '24px', fill:'#000'});
        this.angleText = scene.add.text(10,34,"Angle: ",{fontSize: '24px', fill:'#000'});
        this.powerText = scene.add.text(10, 58, "Power: 0",{fontSize: '24px', fill:'#000'});
        this.shellText = scene.add.text(10, 82, "Shell: Light",{fontSize: '24px', fill:'#000'});
    }

    notify() {
        
    }

    handleInput() {
        
        //Controls for moving the tank.
        if(this.AKey.isDown) {
            this.currentTank.moveLeft();
        } else if(this.DKey.isDown) {
            this.currentTank.moveRight();
        } else {
            this.currentTank.moveStop();
        }

        //Controls for switching shells.
        if(this.ZKey.isDown) {
            this.shellText.setText("Shell: Light");
        } else if(this.XKey.isDown) {
            this.shellText.setText("Shell: Heavy")
        } else if(this.CKey.isDown) {
            this.shellText.setText("Shell: Explosive");
        }

        //Controls for firing.

        if(this.WKey.isUp) {
            this.WKeyPres = false;
        }

        //Selecting angle.
        if(this.fireState == FireState['SettingAngle']){
            if(this.WKey.isDown && this.WKeyPres == false){
                this.fireState = FireState['SettingPower'];
                this.WKeyPres = true;
            }

            let x = this.pointer.x - this.currentTank.getX();
            let y = (720 - this.pointer.y) - (720 - this.currentTank.getY());
            if(x != 0) {
                this.fireAngle = Math.atan(y/x)*180/(Math.PI)
            
                if(this.fireAngle < 0) {
                    this.fireAngle = (-1)*this.fireAngle + 90;
                }

                if(this.fireAngle > 100) {
                    this.angleText.setText("Angle: " + this.fireAngle.toPrecision(3));
                } else {
                    this.angleText.setText("Angle: " + this.fireAngle.toPrecision(2));
                }
            }
        }

        //Setting power and firing.
        if(this.fireState == FireState['SettingPower']) {
            if(this.SKey.isDown) {
                this.fireState = FireState['SettingAngle'];
            }

            if(this.WKey.isDown && this.WKeyPres == false) {
                this.fireState = FireState['SettingAngle'];
                this.WKeyPres = true;
            }

            if(this.pointer.x > 0 && this.pointer.x < 1000) {
                this.firePower = this.pointer.x;
                this.powerText.setText("Power: " + this.firePower.toPrecision(3));
            }
        }
    }

    setCurrentTank(tank) {
        this.currentTank = tank;
    }

    broadcastInput() {

    }

    broadcastState() {

    }
}

class Map {
    constructor(scene, background, ground){
        this.mapLength = scene.width;
        this.mapHeight = scene.height;

        scene.background = scene.add.image(0,0,background).setOrigin(0,0);

        scene.ground = scene.physics.add.staticGroup();
        scene.ground.create(640, 710, 'ground');

        scene.wall = scene.physics.add.staticGroup();
        scene.wall.create(640, 610, 'wall');
    }
}

class Tank {
    constructor(scene, image, x, y) {
        this.image = image;
        this.ref = scene.physics.add.image(x,y,image);
        scene.physics.add.collider(this.ref, scene.ground);
        scene.physics.add.collider(this.ref, scene.wall);
    }

    fire(x,y) {}

    moveRight(){}

    moveLeft(){}

    moveStop(){}

    getX() {}

    getY() {}

    selectTankShell(){}
}

class LightTank extends Tank {
    constructor(scene, image, x, y) {
        super(scene, image, x, y);

        this.ref.setCollideWorldBounds(true);
        this.ref.setGravityY(200);
    }

    fire(x,y) {}

    moveRight(){
        this.ref.setVelocityX(100);
    }

    moveLeft(){
        this.ref.setVelocityX(-100);
    }

    moveStop(){
        this.ref.setVelocityX(0);
    }

    getX() {
        return this.ref.x;
    }

    getY() {
        return this.ref.y;
    }

    selectTankShell(){}
}

class HeavyTank extends Tank {
    constructor(scene, image, x, y) {
        super(scene, image, x, y);
    }

    fire(x,y) {}

    moveRight(){}

    moveLeft(){}

    getX() {

    }

    getY() {
        
    }

    selectTankShell(){}
}

class TankShell {
    constructor(scene) {

    }
}

class NormalShell extends TankShell{
    constructor() {

    }
}

class HeavyShell extends TankShell{
    constructor() {

    }
}

class ExplosiveShell extends TankShell{
    constructor() {

    }
}