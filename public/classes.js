const GameState = {
    'WaitingForPlayers': 0,
    'Player1Turn': 1,
    'Player2Turn': 2,
    'Finished': 3
}

class InputManager {
    constructor() {

    }
}

class GameManager {
    constructor(scene) {
        scene.background = scene.add.image(0,0,"background");
        scene.background.setOrigin(0,0);
    }
}

class Map {
    constructor(){

    }
}

class Tank {
    constructor() {

    }
}

class LightTank extends Tank {
    constructor(name, image, ref) {
        super(name, image, ref);
    }
}

class HeavyTank extends Tank {

}

class TankShell {
    constructor() {

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