// ELEMENTS FROM HTML
let containerEl = document.getElementById("container");
let countdownEl = document.querySelector(".countdown");
let scoreAmountEl = document.getElementById("score");
let modalEl = document.getElementById("modal");
let overEl = document.querySelector(".gameOver");
let playAgainEl = document.querySelector(".playAgain");
let coinIconEl = document.querySelector(".coinIcon");
let distanceEl = document.querySelector(".distance");
let scoreEl = document.getElementById("score");
let hearthsEl = document.querySelectorAll(".hearth");

// LITERALS
const MIN_COIN_DELAY = 2000
const MAX_COIN_DELAY = 7000

const MIN_ENEMY_DELAY = 1000
const MAX_ENEMY_DELAY = 4000

const LIVES_NUMBER = 3
const IMMUNITY_DURATION = 200

const MAX_SPEED = -19
const ACCELERATION = -0.001
let SPEED = -6
let GAME_ON = 1
// KEYS
const SPACE = 32
const UP = 38

let coins = 0


const setRandomInterval = (intervalFunction, minDelay, maxDelay) => {
    let timeout;
    const runInterval = () => {
        const timeoutFunction = () => {
            intervalFunction();
            runInterval();
        };
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        timeout = setTimeout(timeoutFunction, delay);
    };
    runInterval();
    return {
        clear() { clearTimeout(timeout) },
    };
};


abstract class Entity {
    position: number
    entityDiv: HTMLDivElement
    entityArray: Array
    ownSpeed: number

    constructor(){
        this.position = 750
        this.ownSpeed = SPEED
    }

    setPosition(){
        this.position += this.ownSpeed
        this.entityDiv.style.left = this.position + 'px'
    }

    remove(){
        this.entityDiv.remove()
    }

    abstract checkCollision(playerPosition: number): boolean
}


class Coin extends Entity{
    position: number
    entityDiv: HTMLDivElement

    constructor(){
        super()
        this.entityDiv = document.createElement("div")
        this.entityDiv.classList.add("coin")
        containerEl.appendChild(this.entityDiv)
    }

    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition >= 60
    }

    grabCoin(): any{

          if( !this.entityDiv.classList.contains("grabItem") ){
            coinIconEl.classList.add("coinJump");
            coins++;
            scoreAmountEl.innerHTML = coins;
          }
          this.entityDiv.classList.add("grabItem")
          setTimeout(() => { this.remove(); coinIconEl.classList.remove("coinJump"); }, 200);
    }

}

class CoinsGenerator{
    static generateCoins(coinsArray): {clear: () => void}{
        return setRandomInterval(() => {
            let newCoin = new Coin()
            coinsArray.push(newCoin)
        }, MIN_COIN_DELAY, MAX_COIN_DELAY)
    }
}

class Enemy extends Entity{
    position: number
    entityDiv: HTMLDivElement

    constructor(){
        super()
        this.entityDiv = document.createElement("div")
        this.entityDiv.classList.add("enemy")
        containerEl.appendChild(this.entityDiv)
    }

    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition <= 70
    }
}

class EnemyGenerator {
    static generateEnemies(enemyArray): {clear: () => void}{
        return setRandomInterval(() => {
            let newEnemy = new Enemy()
            enemyArray.push(newEnemy)
        }, MIN_ENEMY_DELAY, MAX_ENEMY_DELAY)
    }
}

class Player {
    playerDiv: HTMLDivElement
    position: number
    lives: number
    immune: boolean
    distance: number

    constructor(){
        this.playerDiv = document.getElementById("hero");
        this.position = 0
        this.distance = 0
        this.lives = LIVES_NUMBER
        this.immune = false
    }



    jump(): any {
      if ( !this.playerDiv.classList.contains("goJump") ) {
          this.playerDiv.classList.add("goJump");
          setTimeout( () => {this.position = 100 }, 100);
          setTimeout(() => { this.position = 0 }, 500);
          setTimeout( () => {this.playerDiv.classList.remove("goJump")} , 600);
        }
    }

    getHit(): any {

        if (this.lives > 0 && this.position == 0 && !this.immune ) {
            this.immune = true
            --this.lives

            hearthsEl[this.lives].classList.add("grabItem");
            containerEl.classList.add("hit");
            setTimeout(() => { hearthsEl[this.lives].remove(); containerEl.classList.remove("hit") }, 200);


            setTimeout(() => this.immune = false, IMMUNITY_DURATION)
        }
    }
}


class Controller {
    keysInput: {up: boolean}

    constructor(){
        this.keysInput = { up: false }
        window.addEventListener("keyup", this.keyUpHandler.bind(this), false)
        window.addEventListener("keydown", this.keyDownHandler.bind(this), false)
    }

    keyUpHandler(e){
        if ( e.keyCode == UP || e.keyCode == SPACE ) this.keysInput.up = false
    }

    keyDownHandler(e){
        if ( e.keyCode == UP || e.keyCode == SPACE ) this.keysInput.up = true
    }
}


class GameEngine {
    controller: Controller
    player: Player
    coins: Coin[]
    enemies: Enemy[]
    coinGeneratorInterval: {clear: () => void}
    enemyGeneratorInterval: {clear: () => void}

    coinsUpdate(playerPosition: number): any {
        this.coins.forEach((coin, index) => {
            // Move each coin to the left and remove if outside the box
            coin.setPosition()
            if (coin.position <= -50) {
                this.coins.splice(index, 1)
                coin.remove()
            }

            // Check player hitbox
            if( coin.checkCollision(playerPosition) ) {
              coin.grabCoin()
            }

        })
    }

    enemiesUpdate(playerPosition: number): any {
        this.enemies.forEach((enemy, index) => {
            // Move each enemy to the left and remove if outside the box
            enemy.setPosition()
            if (enemy.position <= -50) {
                this.enemies.splice(index, 1)
                enemy.remove()
            }

            // Check hitbox
            if(enemy.checkCollision(playerPosition)) this.player.getHit()
        })
   }


    update(timeStamp: number): any{

        // Jump on key press
        if(this.controller.keysInput.up ) this.player.jump()

        if( this.player.lives == 0 ){
          this.endGame();
          this.player.lives = -1
        }

        this.coinsUpdate(this.player.position)
        this.enemiesUpdate(this.player.position)

      setInterval( () =>  {  if ( SPEED >= MAX_SPEED ) SPEED += ACCELERATION; } , 3000);


    }

    gameLoop(timeStamp: number): any{
        this.update(timeStamp)
        window.requestAnimationFrame(() => this.gameLoop(Date.now()))
    }

    countDistance(): any{
      setInterval( () => { if( GAME_ON ){
       this.player.distance++;
       distanceEl.innerHTML = this.player.distance + "m";} } , 100);
    }

    startProcedure(): any{
      let count = 3;
      countdownEl.innerHTML = count;
      count--;
      const countdownInterval = setInterval(function () {
        countdownEl.innerHTML = count;
        count--;
        if (count == -1) {
          clearInterval(countdownInterval);
            countdownEl.style.display = "none";
            modal.style.display = "none";
        }
      }, 1000);
    }

    init(): any {
        this.controller = new Controller()
        this.player = new Player()
        this.coins = []
        this.enemies = []

        this.startProcedure()
        setTimeout( () => {this.countDistance() } , 3000);
        setTimeout(() => {
          window.requestAnimationFrame(() => this.gameLoop(Date.now()))
          this.coinGeneratorInterval = CoinsGenerator.generateCoins(this.coins)
          this.enemyGeneratorInterval = EnemyGenerator.generateEnemies(this.enemies)

        }, 3000);
    }

    endGame() {
      GAME_ON = 0
      modalEl.style.display = "block";
      countdownEl.style.display = "block";
      overEl.style.display = "block";
      playAgainEl.style.display = "block";

      modalEl.style.backgroundColor = "black";
      modalEl.style.zIndex = "1000";
      coinIconEl.style.display = "none";
      distanceEl.style.display = "none";
      scoreEl.style.display = "none";
      countdownEl.style.fontSize = "40px";
      const finalDistance = this.player.distance;
      const finalScore = coins
      countdownEl.innerHTML =
        `Final distance: ${finalDistance}m` +
        "<br />" +
        `Collected coins: ${finalScore}`;
      this.sendResultToDb(finalScore, finalDistance)
    }

    // post request with coins and points update after game over
    // updates sidenav coin value
    sendResultToDb(coins, distance): any{
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          var coinValueSpan = document.getElementById("user-nav-coins")
          var resJson = JSON.parse(xhr.response)
          coinValueSpan.textContent = resJson.points
        }
      }
      xhr.open("POST", `/game/${coins}/${distance}`)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(null);
    }

}

startFlag = false
countdownEl.onclick = function () {
  if (startFlag == false) {
      startFlag = true;
      let gameEngine = new GameEngine()
      gameEngine.init()
    }
  }

  playAgainEl.onclick = function () {
  window.location.reload(true);
};
