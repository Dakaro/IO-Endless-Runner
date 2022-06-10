let containerEl = document.getElementById("container");
const MIN_COIN_DELAY = 2000
const MAX_COIN_DELAY = 7000
const MIN_ENEMY_DELAY = 1000
const MAX_ENEMY_DELAY = 4000
const LIVES_NUMBER = 3
const IMMUNITY_DURATION = 2000

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
    
    constructor(){
        this.position = 750
    }
    
    setPosition(change: number){
        this.position += change
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
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("coin");
        containerEl.appendChild(this.entityDiv);
    }
    
    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition >= 50
    }
}


class Enemy extends Entity{
    position: number
    entityDiv: HTMLDivElement
    
    constructor(){
        super()
        this.entityDiv = document.createElement("div");
        this.entityDiv.classList.add("enemy");
        containerEl.appendChild(this.entityDiv);
    }
    
    checkCollision(playerPosition: number): boolean{
        return this.position < 70 && this.position > 20 && playerPosition <= 70
    }
}


class CoinsGenerator {
    static generateCoins(coinsArray): {clear: () => void}{
        return setRandomInterval(() => {
            let newCoin = new Coin()
            coinsArray.push(newCoin)
        }, MIN_COIN_DELAY, MAX_COIN_DELAY)
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
    playerDiv: HTMLElement
    position: number
    lives: number
    jumping: boolean
    falling: boolean
    immune: boolean
    
    constructor(){
        this.playerDiv = document.getElementById("hero");
        this.position = 0
        this.lives = LIVES_NUMBER
        this.jumping = false
        this.falling = false
        this.immune = false
    }
    
    jump(): any {
        this.jumping = true
    }
    
    isInMotion(): boolean{
        return this.jumping || this.falling
    }
    
    updatePlayerPosition(): any {
        if(this.jumping){
            this.position += 15
            this.playerDiv.style.bottom = this.position + 'px'
            if (this.position >= 200) {
                this.jumping = false
                this.falling = true
            }
        }
        else if(this.falling){
            this.position -= 5
            this.playerDiv.style.bottom = this.position + 'px'
            if(this.position <= 40) this.falling = false
        }
    }
    
    getHit(): any {
        if (this.lives > 0 && !this.immune) {
            this.immune = true
            --this.lives
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
        if (e.keyCode == '38') this.keysInput.up = false
    }
    
    keyDownHandler(e){
        if (e.keyCode == '38') this.keysInput.up = true
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
            coin.setPosition(-5)
            if (coin.position <= -50) {
                this.coins.splice(index, 1)
                coin.remove()
            }
            
            // Check player hitbox
            
        })
    }
    
    enemiesUpdate(playerPosition: number): any {
        this.enemies.forEach((enemy, index) => {
            // Move each enemy to the left and remove if outside the box
            enemy.setPosition(-5)
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
        if(this.controller.keysInput.up && !this.player.isInMotion()) this.player.jump()
        // Fall
        else if(this.player.isInMotion()) this.player.updatePlayerPosition()
        
        this.coinsUpdate(this.player.position)
        this.enemiesUpdate(this.player.position)        
    }
    
    gameLoop(timeStamp: number): any{
        this.update(timeStamp)
        window.requestAnimationFrame(() => this.gameLoop(Date.now()))
    }
    
    init(): any {
        this.controller = new Controller()
        this.player = new Player()
        this.coins = []
        this.enemies = []
        
        window.requestAnimationFrame(() => this.gameLoop(Date.now()))
        this.coinGeneratorInterval = CoinsGenerator.generateCoins(this.coins)
        this.enemyGeneratorInterval = EnemyGenerator.generateEnemies(this.enemies)
    }
}

let gameEngine = new GameEngine()
gameEngine.init()