// ELEMENTS FROM HTML
let containerEl: HTMLElement|null = document.getElementById("container");
let countdownEl: HTMLElement|null = document.querySelector(".countdown");
let scoreAmountEl: HTMLElement|null = document.getElementById("score");
let modalEl: HTMLElement|null = document.getElementById("modal");
let overEl: HTMLElement|null = document.querySelector(".gameOver");
let playAgainEl: HTMLElement|null = document.querySelector(".playAgain");
let coinIconEl: HTMLElement|null = document.querySelector(".coinIcon");
let distanceEl: HTMLElement|null = document.querySelector(".distance");
let scoreEl: HTMLElement|null = document.getElementById("score");
let hearthsEl: NodeListOf<Element> = document.querySelectorAll(".hearth");

// LITERALS
const MIN_COIN_DELAY = 2000
const MAX_COIN_DELAY = 5000

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

//entity abstract factory
interface EntityFactory {
    MIN_DELAY: number;
    MAX_DELAY: number;
    CreateEntity(): AbstractEntity;
}

//enemy concrete factory
class EnemyFactory implements EntityFactory {
    MIN_DELAY: number;
    MAX_DELAY: number;
    constructor(MIN_DELAY: number, MAX_DELAY: number) {
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }
    public CreateEntity(): AbstractEntity {
        return new Enemy();
    }
}

//coin concrete facotry
class CoinFactory implements EntityFactory {
    MIN_DELAY: number;
    MAX_DELAY: number;
    constructor(MIN_DELAY: number, MAX_DELAY: number) {
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }
    CreateEntity(): AbstractEntity {
        return new Coin();
    }
}

//abstract entity
abstract class AbstractEntity {
    position: number;
    entityDiv: HTMLDivElement;
    ownSpeed: number

    constructor() {
        this.position = 750;
        this.ownSpeed = SPEED
    }

    public changePosition() {
        this.position += this.ownSpeed;
        this.entityDiv.style.left = this.position + 'px';
    }

    remove(){
        this.entityDiv.remove();
    }

    abstract checkCollision(playerPosition: number): boolean;

}

class Enemy extends AbstractEntity {

    constructor(){
        super()
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("enemy");
        containerEl!.appendChild(this.entityDiv);
    }

    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition <= 70
    }
}

class Coin extends AbstractEntity {
    constructor(){
        super()
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("coin");
        containerEl!.appendChild(this.entityDiv);
    }

    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition >= 60
    }
}

class GenerateEntity {
    factory: EntityFactory;

    constructor(factory: EntityFactory) {
        this.factory = factory;
    }

    public generateEntity(entityArray: AbstractEntity[]): { clear: () => void} {
        return setRandomInterval(() => {
          let containerList = containerEl!.children
          if( !(containerList[ containerList.length - 2 ].className == 'coin') && !(containerList[ containerList.length - 2 ].className == 'enemy') ){
            let newEntity = this.factory.CreateEntity();
            entityArray.push(newEntity)
          }
        },
        this.factory.MIN_DELAY, this.factory.MAX_DELAY)
      }

}

class Player {
    playerDiv: HTMLElement|null
    position: number
    lives: number
    immune: boolean
    distance: number
    coins: number

    constructor(){
        this.playerDiv = document.getElementById("hero");
        this.position = 0
        this.distance = 0
        this.coins = 0
        this.lives = LIVES_NUMBER
        this.immune = false
    }

    jump(): any {
      if ( !this.playerDiv!.classList.contains("goJump") ) {
          this.playerDiv!.classList.add("goJump");

          // dividing time to better collision wtih enemy managment
          setTimeout( () => {this.position = 100 }, 100);
          setTimeout(() => { this.position = 0 }, 500);
          setTimeout( () => {this.playerDiv!.classList.remove("goJump")} , 600);
        }    }

    getHit(): any {
      if (this.lives > 0 && this.position == 0 && !this.immune ) {
          this.immune = true
          setTimeout(() => this.immune = false, IMMUNITY_DURATION)

          --this.lives
          hearthsEl[this.lives].classList.add("grabItem");
          containerEl!.classList.add("hit");
          setTimeout(() => { hearthsEl[this.lives].remove(); containerEl!.classList.remove("hit") }, 200);
      }
    }

    grabCoin(coin: Coin): any{

          if( !coin.entityDiv.classList.contains("grabItem") ){
            coinIconEl!.classList.add("coinJump");
            this.coins++;
            scoreAmountEl!.innerHTML = String(this.coins);
          }
          coin.entityDiv.classList.add("grabItem")
          setTimeout(() => { coin.remove(); coinIconEl!.classList.remove("coinJump"); }, 200);
    }

}


class Controller {
    keysInput: { up: boolean }

    constructor() {
        this.keysInput = { up: false }
        window.addEventListener("keyup", this.keyUpHandler.bind(this), false)
        window.addEventListener("keydown", this.keyDownHandler.bind(this), false)
    }

    keyUpHandler(e) {
        if (e.keyCode == UP || e.keyCode == SPACE){
            e.preventDefault()    
           this.keysInput.up = false
        }
    }

    keyDownHandler(e) {
        if (e.keyCode == UP || e.keyCode == SPACE){
            e.preventDefault()    
           this.keysInput.up = true
        }
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
            coin.changePosition()
            if (coin.position <= -50) {
                this.coins.splice(index, 1)
                coin.remove()
            }

            // Check player hitbox
            if( coin.checkCollision(playerPosition) ) {
              this.player.grabCoin(coin)
            }

        })
    }

    enemiesUpdate(playerPosition: number): any {
        this.enemies.forEach((enemy, index) => {
            // Move each enemy to the left and remove if outside the box
            enemy.changePosition()
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

      // check game over
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
       distanceEl!.innerHTML = this.player.distance + "m";} } , 100);
    }

    startProcedure(): any{
      let count = 3;
      countdownEl!.innerHTML = String(count);
      count--;
      const countdownInterval = setInterval(function () {
        countdownEl!.innerHTML = String(count);
        count--;
        if (count == -1) {
          clearInterval(countdownInterval);
            countdownEl!.style.display = "none";
            modalEl!.style.display = "none";
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
          window.requestAnimationFrame(() => this.gameLoop(Date.now()));
          let coinFactory = new CoinFactory(MIN_COIN_DELAY, MAX_COIN_DELAY);
          this.coinGeneratorInterval = new GenerateEntity(coinFactory).generateEntity(this.coins);
          this.enemyGeneratorInterval = new GenerateEntity(new EnemyFactory(MIN_ENEMY_DELAY, MAX_ENEMY_DELAY)).generateEntity(this.enemies)
        }, 2000);

    }

    endGame() {
      GAME_ON = 0
      modalEl!.style.display = "block";
      countdownEl!.style.display = "block";
      overEl!.style.display = "block";
      playAgainEl!.style.display = "block";

      modalEl!.style.backgroundColor = "black";
      modalEl!.style.zIndex = "1000";
      coinIconEl!.style.display = "none";
      distanceEl!.style.display = "none";
      scoreEl!.style.display = "none";
      countdownEl!.style.fontSize = "40px";
      const finalDistance = this.player.distance;
      const finalScore = this.player.coins
      countdownEl!.innerHTML =
        `Final distance: ${finalDistance}m` +
        "<br />" +
        `Collected coins: ${finalScore}`;
      this.sendResultToDb(finalScore, finalDistance)
    }

    // push result to DB
    sendResultToDb(coins: number, distance: number): any{
      let xhr = new XMLHttpRequest()
      xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
          var coinValueSpan = document.getElementById("user-nav-coins")
          var resJson = JSON.parse(xhr.response)
          coinValueSpan!.textContent = resJson.points
        }
      }
      xhr.open("POST", `/game/${coins}/${distance}`)
      xhr.setRequestHeader('Content-Type', 'application/json');
      xhr.send(null);
    }

}

let startFlag = false
countdownEl!.onclick = function () {
  if (startFlag == false) {
      startFlag = true;
      let gameEngine = new GameEngine()
      gameEngine.init()
    }
  }

  playAgainEl!.onclick = function () {
  window.location.reload();
}
