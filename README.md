# Battle Tanks

## Description:
An assignment completed by me and Ryan Russel for SENG 350 Software Architecture and Design at UVic.

The game was built using HTML, the [Phaser](http://phaser.io/) framework, [Express](https://expressjs.com/), and [Socket.io](https://socket.io/).

## Rules:
The goal is to destroy your opponent's tank. Each player has 100 health and can choose from three shells to fire:

1. A heavy shell which takes more power to fire but deals more damage
2. A light shell which deals less damage but takes less power to fire
3. An explosive shell that consists of multiple smaller shells each do the least amount of damage

Each player takes turns; on a player's turn they can move and adjust the angle and power of their shot.
Once the player fires, their turn ends and the other player's turn begins.

## Starting A Game:
To start a game follow these steps after cloning the repo:

1. Navigate to the `battle-tanks` directory
2. Start the game server using `node server.js` or `heroku local` if Heroku is installed
3. Make note of the port number printed in the console. It will look like `Listening on port [port#]`
4. Open two browser windows `window A` and `window B` in the browser of you choosing
5. In `window A` navigate to `http://localhost:[port#]/` where `[port#]` is the port number printed in the console
6. In `window B` navigate to `http://localhost:[port#]/`

The game will have started now and the player using `window A` should be able to move and fire. 
