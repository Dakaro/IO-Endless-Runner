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
const START_POSITION_50px = 750

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
abstract class EntityFactory {

    protected MIN_DELAY: number;
    protected MAX_DELAY: number;
    
    public getMinDelay() {
        return this.MIN_DELAY;
    }
    public getMaxDelay() {
        return this.MAX_DELAY;
    }

    abstract CreateEntity(): AbstractEntity;
}

//enemy concrete factory
class EnemyFactory extends EntityFactory {

    constructor(MIN_DELAY: number, MAX_DELAY: number) {
        super()
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }

    public CreateEntity(): AbstractEntity {
        return new Enemy(SPEED);
    }
}

//coin concrete facotry
class CoinFactory extends EntityFactory {

    constructor(MIN_DELAY: number, MAX_DELAY: number) {
        super()
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }

    public CreateEntity(): AbstractEntity {
        return new Coin(SPEED);
    }
}

//abstract entity
abstract class AbstractEntity {

    protected position: number;
    protected entityDiv: HTMLDivElement;
    protected ownSpeed: number

    constructor() {
        this.position = START_POSITION_50px;
    }

    public changePosition() {
        this.position += this.ownSpeed;
        this.entityDiv.style.left = this.position + 'px';
    }

    public remove(){
        this.entityDiv.remove();
    }

    public getPosition() {
        return this.position;
    }

    public getEntityDiv() {
        return this.entityDiv;
    }

    abstract checkCollision(playerPosition: number): boolean;

}

class Enemy extends AbstractEntity {

    constructor(SPEED: number){
        super()
        this.ownSpeed = SPEED
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("enemy");
        containerEl!.appendChild(this.entityDiv);
    }

    public checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition <= 70
    }
}

class Coin extends AbstractEntity {

    constructor(SPEED: number){
        super()
        this.ownSpeed = SPEED;
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("coin");
        containerEl!.appendChild(this.entityDiv);
    }

    public checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition >= 60
    }
}

class GenerateEntity {

    private factory: EntityFactory;

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
        this.factory.getMinDelay(), this.factory.getMaxDelay())
      }
}

class Player {

    private playerDiv: HTMLElement|null
    private position: number
    private lives: number
    private immune: boolean
    private distance: number
    private coins: number

    constructor(){
        this.playerDiv = document.getElementById("hero");
        this.position = 0
        this.distance = 0
        this.coins = 0
        this.lives = LIVES_NUMBER
        this.immune = false
    }

    public getPosition() {
        return this.position;
    }

    public getLives() {
        return this.lives;
    }

    public takeLife(): any {
        this.lives -= 1;
    }

    public getDistance() {
        return this.distance;
    }

    public increaseDistance() {
        this.distance++;
    }

    public getCoins() {
        return this.coins;
    }

    public jump(): any {
      if ( !this.playerDiv!.classList.contains("goJump") ) {
          this.playerDiv!.classList.add("goJump");

          // dividing time to better collision wtih enemy managment
          setTimeout( () => {this.position = 100 }, 100);
          setTimeout(() => { this.position = 0 }, 500);
          setTimeout( () => {this.playerDiv!.classList.remove("goJump")} , 600);
        }    }

    public getHit(): any {
      if (this.lives > 0 && this.position == 0 && !this.immune ) {
          this.immune = true
          setTimeout(() => this.immune = false, IMMUNITY_DURATION)

          --this.lives
          hearthsEl[this.lives].classList.add("grabItem");
          containerEl!.classList.add("hit");
          setTimeout(() => { if( this.lives >= 0) {hearthsEl[this.lives].remove();} containerEl!.classList.remove("hit") }, 200);
      }
    }

    public grabCoin(coin: Coin): any{

          if( !coin.getEntityDiv().classList.contains("grabItem") ){
            coinIconEl!.classList.add("coinJump");
            this.coins++;
            scoreAmountEl!.innerHTML = String(this.coins);
          }
          coin.getEntityDiv().classList.add("grabItem")
          setTimeout(() => { coin.remove(); coinIconEl!.classList.remove("coinJump"); }, 200);
    }

}


class Controller {
    private keysInput: { up: boolean }

    constructor() {
        this.keysInput = { up: false }
        window.addEventListener("keyup", this.keyUpHandler.bind(this), false)
        window.addEventListener("keydown", this.keyDownHandler.bind(this), false)
    }

    public isKeyUp(): boolean {
        if(this.keysInput.up) return true;
        return false;
    }

    public keyUpHandler(e) {
        if (e.keyCode == UP || e.keyCode == SPACE){
            e.preventDefault()    
           this.keysInput.up = false
        }
    }

    public keyDownHandler(e) {
        if (e.keyCode == UP || e.keyCode == SPACE){
            e.preventDefault()    
           this.keysInput.up = true
        }
    }
}


class GameEngine {
    private controller: Controller
    private player: Player
    private coins: Coin[]
    private enemies: Enemy[]
    private coinGeneratorInterval: {clear: () => void}
    private enemyGeneratorInterval: {clear: () => void}

    private coinsUpdate(playerPosition: number): any {
        this.coins.forEach((coin, index) => {
            // Move each coin to the left and remove if outside the box
            coin.changePosition()
            if (coin.getPosition() <= -50) {
                this.coins.splice(index, 1)
                coin.remove()
            }

            // Check player hitbox
            if( coin.checkCollision(playerPosition) ) {
              this.player.grabCoin(coin)
            }

        })
    }

    private enemiesUpdate(playerPosition: number): any {
        this.enemies.forEach((enemy, index) => {
            // Move each enemy to the left and remove if outside the box
            enemy.changePosition()
            if (enemy.getPosition() <= -50) {
                this.enemies.splice(index, 1)
                enemy.remove()
            }

            // Check hitbox
            if(enemy.checkCollision(playerPosition)) this.player.getHit()
        })
    }

    private update(timeStamp: number): any{
      // Jump on key press
      if(this.controller.isKeyUp()) this.player.jump()

      // check game over
      if( this.player.getLives() == 0 ){
        this.endGame();
        this.player.takeLife();
      }

      this.coinsUpdate(this.player.getPosition())
      this.enemiesUpdate(this.player.getPosition())

      setInterval( () =>  {  if ( SPEED >= MAX_SPEED ) SPEED += ACCELERATION; } , 3000);
    }

    private gameLoop(timeStamp: number): any{
        this.update(timeStamp)
        window.requestAnimationFrame(() => this.gameLoop(Date.now()))
    }

    private countDistance(): any{
      setInterval( () => { if( GAME_ON ){
       this.player.increaseDistance();
       distanceEl!.innerHTML = this.player.getDistance() + "m";} } , 100);
    }

    private startProcedure(): any{
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

    public init(): any {
        this.controller = new Controller()
        this.player = new Player()
        this.coins = []
        this.enemies = []

        this.startProcedure()
        setTimeout( () => {this.countDistance() } , 3000);

          setTimeout(() => {
          window.requestAnimationFrame(() => this.gameLoop(Date.now()));
          let coinFactory = new CoinFactory(MIN_COIN_DELAY, MAX_COIN_DELAY);
          let enemyFactory = new EnemyFactory(MIN_ENEMY_DELAY, MAX_ENEMY_DELAY)
          this.coinGeneratorInterval = new GenerateEntity(coinFactory).generateEntity(this.coins);
          this.enemyGeneratorInterval = new GenerateEntity(enemyFactory).generateEntity(this.enemies)
        }, 2000);

    }

    private endGame() {
      GAME_ON = 0
      this.coinGeneratorInterval.clear()
      this.enemyGeneratorInterval.clear()
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
      const finalDistance = this.player.getDistance();
      const finalScore = this.player.getCoins();
      countdownEl!.innerHTML =
        `Final distance: ${finalDistance}m` +
        "<br />" +
        `Collected coins: ${finalScore}`;
      this.sendResultToDb(finalScore, finalDistance)
    }

    // push result to DB
    private sendResultToDb(coins: number, distance: number): any{
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
