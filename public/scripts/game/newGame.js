var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var containerEl = document.getElementById("container");
var MIN_COIN_DELAY = 2000;
var MAX_COIN_DELAY = 7000;
var MIN_ENEMY_DELAY = 1000;
var MAX_ENEMY_DELAY = 4000;
var LIVES_NUMBER = 3;
var IMMUNITY_DURATION = 2000;
var setRandomInterval = function (intervalFunction, minDelay, maxDelay) {
    var timeout;
    var runInterval = function () {
        var timeoutFunction = function () {
            intervalFunction();
            runInterval();
        };
        var delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        timeout = setTimeout(timeoutFunction, delay);
    };
    runInterval();
    return {
        clear: function () { clearTimeout(timeout); }
    };
};
//enemy concrete factory
var EnemyFactory = /** @class */ (function () {
    function EnemyFactory(MIN_DELAY, MAX_DELAY) {
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }
    EnemyFactory.prototype.CreateEntity = function () {
        return new Enemy();
    };
    return EnemyFactory;
}());
//coin concrete facotry
var CoinFactory = /** @class */ (function () {
    function CoinFactory(MIN_DELAY, MAX_DELAY) {
        this.MIN_DELAY = MIN_DELAY;
        this.MAX_DELAY = MAX_DELAY;
    }
    CoinFactory.prototype.CreateEntity = function () {
        return new Coin();
    };
    return CoinFactory;
}());
//abstract entity
var AbstractEntity = /** @class */ (function () {
    function AbstractEntity() {
        this.position = 750;
    }
    AbstractEntity.prototype.changePosition = function (change) {
        this.position += change;
        this.entityDiv.style.left = this.position + 'px';
    };
    AbstractEntity.prototype.remove = function () {
        this.entityDiv.remove();
    };
    return AbstractEntity;
}());
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy() {
        var _this = _super.call(this) || this;
        _this.entityDiv = document.createElement("div");
        _this.entityDiv.classList.add("enemy");
        containerEl.appendChild(_this.entityDiv);
        return _this;
    }
    Enemy.prototype.checkCollision = function (playerPosition) {
        return this.position < 70 && this.position > 20 && playerPosition <= 70;
    };
    return Enemy;
}(AbstractEntity));
var Coin = /** @class */ (function (_super) {
    __extends(Coin, _super);
    function Coin() {
        var _this = _super.call(this) || this;
        _this.entityDiv = document.createElement("div");
        _this.entityDiv.classList.add("coin");
        containerEl.appendChild(_this.entityDiv);
        return _this;
    }
    Coin.prototype.checkCollision = function (playerPosition) {
        return this.position < 70 && this.position > 20 && playerPosition >= 50;
    };
    return Coin;
}(AbstractEntity));
var GenerateEntity = /** @class */ (function () {
    function GenerateEntity(factory) {
        this.factory = factory;
    }
    GenerateEntity.prototype.generateEntity = function (entityArray) {
        var _this = this;
        return setRandomInterval(function () {
            var newEntity = _this.factory.CreateEntity();
            entityArray.push(newEntity);
        }, this.factory.MIN_DELAY, this.factory.MAX_DELAY);
    };
    return GenerateEntity;
}());
var Player = /** @class */ (function () {
    function Player() {
        this.playerDiv = document.getElementById("hero");
        this.position = 0;
        this.lives = LIVES_NUMBER;
        this.jumping = false;
        this.falling = false;
        this.immune = false;
    }
    Player.prototype.jump = function () {
        this.jumping = true;
    };
    Player.prototype.isInMotion = function () {
        return this.jumping || this.falling;
    };
    Player.prototype.updatePlayerPosition = function () {
        if (this.jumping) {
            this.position += 15;
            this.playerDiv.style.bottom = this.position + 'px';
            if (this.position >= 200) {
                this.jumping = false;
                this.falling = true;
            }
        }
        else if (this.falling) {
            this.position -= 5;
            this.playerDiv.style.bottom = this.position + 'px';
            if (this.position <= 40)
                this.falling = false;
        }
    };
    Player.prototype.getHit = function () {
        var _this = this;
        if (this.lives > 0 && !this.immune) {
            this.immune = true;
            --this.lives;
            setTimeout(function () { return _this.immune = false; }, IMMUNITY_DURATION);
        }
    };
    return Player;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        this.keysInput = { up: false };
        window.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    }
    Controller.prototype.keyUpHandler = function (e) {
        if (e.keyCode == '38')
            this.keysInput.up = false;
    };
    Controller.prototype.keyDownHandler = function (e) {
        if (e.keyCode == '38')
            this.keysInput.up = true;
    };
    return Controller;
}());
var GameEngine = /** @class */ (function () {
    function GameEngine() {
    }
    GameEngine.prototype.coinsUpdate = function (playerPosition) {
        var _this = this;
        this.coins.forEach(function (coin, index) {
            // Move each coin to the left and remove if outside the box
            coin.changePosition(-5);
            if (coin.position <= -50) {
                _this.coins.splice(index, 1);
                coin.remove();
            }
            // Check player hitbox
        });
    };
    GameEngine.prototype.enemiesUpdate = function (playerPosition) {
        var _this = this;
        this.enemies.forEach(function (enemy, index) {
            // Move each enemy to the left and remove if outside the box
            enemy.changePosition(-5);
            if (enemy.position <= -50) {
                _this.enemies.splice(index, 1);
                enemy.remove();
            }
            // Check hitbox
            if (enemy.checkCollision(playerPosition))
                _this.player.getHit();
        });
    };
    GameEngine.prototype.update = function (timeStamp) {
        // Jump on key press
        if (this.controller.keysInput.up && !this.player.isInMotion())
            this.player.jump();
        // Fall
        else if (this.player.isInMotion())
            this.player.updatePlayerPosition();
        this.coinsUpdate(this.player.position);
        this.enemiesUpdate(this.player.position);
    };
    GameEngine.prototype.gameLoop = function (timeStamp) {
        var _this = this;
        this.update(timeStamp);
        window.requestAnimationFrame(function () { return _this.gameLoop(Date.now()); });
    };
    GameEngine.prototype.init = function () {
        var _this = this;
        this.controller = new Controller();
        this.player = new Player();
        this.coins = [];
        this.enemies = [];
        window.requestAnimationFrame(function () { return _this.gameLoop(Date.now()); });
        var coinFactory = new CoinFactory(MIN_COIN_DELAY, MAX_COIN_DELAY);
        this.coinGeneratorInterval = new GenerateEntity(coinFactory).generateEntity(this.coins);
        this.enemyGeneratorInterval = new GenerateEntity(new EnemyFactory(MIN_ENEMY_DELAY, MAX_ENEMY_DELAY)).generateEntity(this.enemies);
    };
    return GameEngine;
}());
var gameEngine = new GameEngine();
gameEngine.init();
