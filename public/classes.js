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

class Map {
    constructor(scene){
        this.mapLength = scene.width;
        this.mapHeight = scene.height;

        scene.background = scene.add.image(0,0,'background').setOrigin(0,0);

        scene.ground = scene.physics.add.staticGroup();
        scene.ground.create(640, 710, 'ground');

        scene.wall = scene.physics.add.staticGroup();
        scene.wall.create(640, 610, 'wall');

        scene.tanks  = scene.physics.add.group();
        scene.shells = scene.physics.add.group();

        //Global physics.
        scene.physics.add.collider(scene.tanks, scene.ground);
        scene.physics.add.collider(scene.tanks, scene.wall);

        scene.physics.add.collider(scene.shells, scene.ground, function(shell, ground) {
            shell.destroy();
        });
        scene.physics.add.collider(scene.shells, scene.wall);
    }
}


class GameManager {
    constructor(scene) {

        //Items related to game state.
        this.map = new Map(scene);
        this.state = GameState['Player1Turn'];
        this.turnLength = 30;
        this.timeLeft = 30;
        this.currentTank = null;

        //Input related.
        this.pointer  = scene.input.mousePointer;
        this.key = {
            'A': scene.input.keyboard.addKey('A'),
            'D': scene.input.keyboard.addKey('D'),
            'Z': scene.input.keyboard.addKey('Z'),
            'X': scene.input.keyboard.addKey('X'),
            'C': scene.input.keyboard.addKey('C'),
            'W': scene.input.keyboard.addKey('W'),
            'S': scene.input.keyboard.addKey('S')
        };
        this.keyPress = {
            'W': false
        };

        //Related to firing.
        this.fireState = FireState['SettingAngle'];
        this.fireAngle = 0;
        this.firePower = 0;

        //Text.
        this.timeText  = scene.add.text(10,10, "Time left: " + this.timeLeft,{fontSize: '24px', fill:'#000'});
        this.angleText = scene.add.text(10,34, "Angle: ",{fontSize: '24px', fill:'#000'});
        this.powerText = scene.add.text(10,58, "Power: ",{fontSize: '24px', fill:'#000'});
        this.shellText = scene.add.text(10,82, "Shell: Light",{fontSize: '24px', fill:'#000'});
    }

    notify() {
        
    }

    handleInput() {
        
        /*Controls for moving the tank.*/
        if(this.key['A'].isDown) {
            this.currentTank.moveLeft();
        } else if(this.key['D'].isDown) {
            this.currentTank.moveRight();
        } else {
            this.currentTank.moveStop();
        }

        /*Controls for switching shells.*/
        if(this.key['Z'].isDown) {
            this.shellText.setText("Shell: Light");
        } else if(this.key['X'].isDown) {
            this.shellText.setText("Shell: Heavy")
        } else if(this.key['C'].isDown) {
            this.shellText.setText("Shell: Explosive");
        }

        /*Controls for firing.*/

        //Make sure W key has come up before checking
        //if the key is down again.
        if(this.key['W'].isUp) {
            this.keyPress['W'] = false;
        }

        //Selecting angle.
        if(this.fireState == FireState['SettingAngle']){
            if(this.key['W'].isDown && this.keyPress['W'] == false){
                this.fireState = FireState['SettingPower'];
                this.keyPress['W'] = true;
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
            if(this.key['S'].isDown) {
                this.fireState = FireState['SettingAngle'];
            }

            if(this.key['W'].isDown && this.keyPress['W'] == false) {
                this.fireState = FireState['SettingAngle'];
                this.keyPress['W'] = true;
                this.currentTank.fire(this.fireAngle, this.firePower);
            }

            //Only allow power between 0 and 1000.
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

class Tank {
    constructor(scene, image, x, y) {
        this.scene = scene;
        this.image = image;
        this.shell = new NormalShell(scene);

        this.ref = scene.physics.add.image(x,y,image);
        this.ref.setCollideWorldBounds(true);
        this.scene.tanks.add(this.ref);
    }

    fire(angle, power) {
        this.shell.fire(this.ref.x, this.ref.y, angle, power);
    }
    moveRight(){
        this.ref.setVelocityX(this.speed);
    }

    moveLeft(){
        this.ref.setVelocityX(-this.speed);
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

class LightTank extends Tank {
    constructor(scene, image, x, y) {
        super(scene, image, x, y);
        this.health = 100;
        this.armor = 5;
        this.speed = 100;

        //Set physics properties.
        this.ref.setCollideWorldBounds(true);
        this.ref.setGravityY(200);
    }

    selectTankShell(){

    }
}

class HeavyTank extends Tank {
    constructor(scene, image, x, y) {
        super(scene, image, x, y);
    }

    selectTankShell(){}
}

class TankShell {
    constructor(scene) {
        this.scene = scene;
    }

    fire(x, y, angle, power) {
        //Add shell to game.
        let shell = this.scene.physics.add.image(x,y,this.image);
        this.scene.shells.add(shell);

        //Convert angle to radians and grab velocities.
        angle = angle*(Math.PI/180);
        let xVel  = Math.cos(angle)*power;
        let yVel  = (-1)*Math.sin(angle)*power;

        //Fire shell.
        shell.setCollideWorldBounds(true);
        shell.setBounce(0.5);
        shell.setGravityY(this.weight);
        shell.setVelocityX(xVel);
        shell.setVelocityY(yVel);
    }
}

class NormalShell extends TankShell{
    constructor(scene) {
        super(scene);
        this.weight = 300;
        this.image = 'red-shell';
    }
}

class HeavyShell extends TankShell{
    constructor(scene) {

    }
}

class ExplosiveShell extends TankShell{
    constructor(scene) {

    }
}