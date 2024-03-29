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
// ELEMENTS FROM HTML
var containerEl = document.getElementById("container");
var countdownEl = document.querySelector(".countdown");
var scoreAmountEl = document.getElementById("score");
var modalEl = document.getElementById("modal");
var overEl = document.querySelector(".gameOver");
var playAgainEl = document.querySelector(".playAgain");
var coinIconEl = document.querySelector(".coinIcon");
var distanceEl = document.querySelector(".distance");
var scoreEl = document.getElementById("score");
var hearthsEl = document.querySelectorAll(".hearth");
// LITERALS
var MIN_COIN_DELAY = 2000;
var MAX_COIN_DELAY = 5000;
var MIN_ENEMY_DELAY = 1000;
var MAX_ENEMY_DELAY = 4000;
var LIVES_NUMBER = 3;
var IMMUNITY_DURATION = 200;
var MAX_SPEED = -19;
var ACCELERATION = -0.001;
var START_POSITION_50px = 750;
var SPEED = -6;
var GAME_ON = 1;
// KEYS
var SPACE = 32;
var UP = 38;
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
//entity abstract factory
var EntityFactory = /** @class */ (function () {
    function EntityFactory() {
    }
    EntityFactory.prototype.getMinDelay = function () {
        return this.MIN_DELAY;
    };
    EntityFactory.prototype.getMaxDelay = function () {
        return this.MAX_DELAY;
    };
    return EntityFactory;
}());
//enemy concrete factory
var EnemyFactory = /** @class */ (function (_super) {
    __extends(EnemyFactory, _super);
    function EnemyFactory(MIN_DELAY, MAX_DELAY) {
        var _this = _super.call(this) || this;
        _this.MIN_DELAY = MIN_DELAY;
        _this.MAX_DELAY = MAX_DELAY;
        return _this;
    }
    EnemyFactory.prototype.CreateEntity = function () {
        return new Enemy(SPEED);
    };
    return EnemyFactory;
}(EntityFactory));
//coin concrete facotry
var CoinFactory = /** @class */ (function (_super) {
    __extends(CoinFactory, _super);
    function CoinFactory(MIN_DELAY, MAX_DELAY) {
        var _this = _super.call(this) || this;
        _this.MIN_DELAY = MIN_DELAY;
        _this.MAX_DELAY = MAX_DELAY;
        return _this;
    }
    CoinFactory.prototype.CreateEntity = function () {
        return new Coin(SPEED);
    };
    return CoinFactory;
}(EntityFactory));
//abstract entity
var AbstractEntity = /** @class */ (function () {
    function AbstractEntity() {
        this.position = START_POSITION_50px;
    }
    AbstractEntity.prototype.changePosition = function () {
        this.position += this.ownSpeed;
        this.entityDiv.style.left = this.position + 'px';
    };
    AbstractEntity.prototype.remove = function () {
        this.entityDiv.remove();
    };
    AbstractEntity.prototype.getPosition = function () {
        return this.position;
    };
    AbstractEntity.prototype.getEntityDiv = function () {
        return this.entityDiv;
    };
    return AbstractEntity;
}());
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(SPEED) {
        var _this = _super.call(this) || this;
        _this.ownSpeed = SPEED;
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
    function Coin(SPEED) {
        var _this = _super.call(this) || this;
        _this.ownSpeed = SPEED;
        _this.entityDiv = document.createElement("div");
        _this.entityDiv.classList.add("coin");
        containerEl.appendChild(_this.entityDiv);
        return _this;
    }
    Coin.prototype.checkCollision = function (playerPosition) {
        return this.position < 70 && this.position > 20 && playerPosition >= 60;
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
            var containerList = containerEl.children;
            if (!(containerList[containerList.length - 2].className == 'coin') && !(containerList[containerList.length - 2].className == 'enemy')) {
                var newEntity = _this.factory.CreateEntity();
                entityArray.push(newEntity);
            }
        }, this.factory.getMinDelay(), this.factory.getMaxDelay());
    };
    return GenerateEntity;
}());
var Player = /** @class */ (function () {
    function Player() {
        this.playerDiv = document.getElementById("hero");
        this.position = 0;
        this.distance = 0;
        this.coins = 0;
        this.lives = LIVES_NUMBER;
        this.immune = false;
    }
    Player.prototype.getPosition = function () {
        return this.position;
    };
    Player.prototype.getLives = function () {
        return this.lives;
    };
    Player.prototype.takeLife = function () {
        this.lives -= 1;
    };
    Player.prototype.getDistance = function () {
        return this.distance;
    };
    Player.prototype.increaseDistance = function () {
        this.distance++;
    };
    Player.prototype.getCoins = function () {
        return this.coins;
    };
    Player.prototype.jump = function () {
        var _this = this;
        if (!this.playerDiv.classList.contains("goJump")) {
            this.playerDiv.classList.add("goJump");
            // dividing time to better collision wtih enemy managment
            setTimeout(function () { _this.position = 100; }, 100);
            setTimeout(function () { _this.position = 0; }, 500);
            setTimeout(function () { _this.playerDiv.classList.remove("goJump"); }, 600);
        }
    };
    Player.prototype.getHit = function () {
        var _this = this;
        if (this.lives > 0 && this.position == 0 && !this.immune) {
            this.immune = true;
            setTimeout(function () { return _this.immune = false; }, IMMUNITY_DURATION);
            --this.lives;
            hearthsEl[this.lives].classList.add("grabItem");
            containerEl.classList.add("hit");
            setTimeout(function () { if (_this.lives >= 0) {
                hearthsEl[_this.lives].remove();
            } containerEl.classList.remove("hit"); }, 200);
        }
    };
    Player.prototype.grabCoin = function (coin) {
        if (!coin.getEntityDiv().classList.contains("grabItem")) {
            coinIconEl.classList.add("coinJump");
            this.coins++;
            scoreAmountEl.innerHTML = String(this.coins);
        }
        coin.getEntityDiv().classList.add("grabItem");
        setTimeout(function () { coin.remove(); coinIconEl.classList.remove("coinJump"); }, 200);
    };
    return Player;
}());
var Controller = /** @class */ (function () {
    function Controller() {
        this.keysInput = { up: false };
        window.addEventListener("keyup", this.keyUpHandler.bind(this), false);
        window.addEventListener("keydown", this.keyDownHandler.bind(this), false);
    }
    Controller.prototype.isKeyUp = function () {
        if (this.keysInput.up)
            return true;
        return false;
    };
    Controller.prototype.keyUpHandler = function (e) {
        if (e.keyCode == UP || e.keyCode == SPACE) {
            e.preventDefault();
            this.keysInput.up = false;
        }
    };
    Controller.prototype.keyDownHandler = function (e) {
        if (e.keyCode == UP || e.keyCode == SPACE) {
            e.preventDefault();
            this.keysInput.up = true;
        }
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
            coin.changePosition();
            if (coin.getPosition() <= -50) {
                _this.coins.splice(index, 1);
                coin.remove();
            }
            // Check player hitbox
            if (coin.checkCollision(playerPosition)) {
                _this.player.grabCoin(coin);
            }
        });
    };
    GameEngine.prototype.enemiesUpdate = function (playerPosition) {
        var _this = this;
        this.enemies.forEach(function (enemy, index) {
            // Move each enemy to the left and remove if outside the box
            enemy.changePosition();
            if (enemy.getPosition() <= -50) {
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
        if (this.controller.isKeyUp())
            this.player.jump();
        // check game over
        if (this.player.getLives() == 0) {
            this.endGame();
            this.player.takeLife();
        }
        this.coinsUpdate(this.player.getPosition());
        this.enemiesUpdate(this.player.getPosition());
        setInterval(function () { if (SPEED >= MAX_SPEED)
            SPEED += ACCELERATION; }, 3000);
    };
    GameEngine.prototype.gameLoop = function (timeStamp) {
        var _this = this;
        this.update(timeStamp);
        window.requestAnimationFrame(function () { return _this.gameLoop(Date.now()); });
    };
    GameEngine.prototype.countDistance = function () {
        var _this = this;
        setInterval(function () {
            if (GAME_ON) {
                _this.player.increaseDistance();
                distanceEl.innerHTML = _this.player.getDistance() + "m";
            }
        }, 100);
    };
    GameEngine.prototype.startProcedure = function () {
        var count = 3;
        countdownEl.innerHTML = String(count);
        count--;
        var countdownInterval = setInterval(function () {
            countdownEl.innerHTML = String(count);
            count--;
            if (count == -1) {
                clearInterval(countdownInterval);
                countdownEl.style.display = "none";
                modalEl.style.display = "none";
            }
        }, 1000);
    };
    GameEngine.prototype.init = function () {
        var _this = this;
        this.controller = new Controller();
        this.player = new Player();
        this.coins = [];
        this.enemies = [];
        this.startProcedure();
        setTimeout(function () { _this.countDistance(); }, 3000);
        setTimeout(function () {
            window.requestAnimationFrame(function () { return _this.gameLoop(Date.now()); });
            var coinFactory = new CoinFactory(MIN_COIN_DELAY, MAX_COIN_DELAY);
            var enemyFactory = new EnemyFactory(MIN_ENEMY_DELAY, MAX_ENEMY_DELAY);
            _this.coinGeneratorInterval = new GenerateEntity(coinFactory).generateEntity(_this.coins);
            _this.enemyGeneratorInterval = new GenerateEntity(enemyFactory).generateEntity(_this.enemies);
        }, 2000);
    };
    GameEngine.prototype.endGame = function () {
        GAME_ON = 0;
        this.coinGeneratorInterval.clear();
        this.enemyGeneratorInterval.clear();
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
        var finalDistance = this.player.getDistance();
        var finalScore = this.player.getCoins();
        countdownEl.innerHTML =
            "Final distance: ".concat(finalDistance, "m") +
                "<br />" +
                "Collected coins: ".concat(finalScore);
        this.sendResultToDb(finalScore, finalDistance);
    };
    // push result to DB
    GameEngine.prototype.sendResultToDb = function (coins, distance) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == XMLHttpRequest.DONE) {
                var coinValueSpan = document.getElementById("user-nav-coins");
                var resJson = JSON.parse(xhr.response);
                coinValueSpan.textContent = resJson.points;
            }
        };
        xhr.open("POST", "/game/".concat(coins, "/").concat(distance));
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);
    };
    return GameEngine;
}());
var startFlag = false;
countdownEl.onclick = function () {
    if (startFlag == false) {
        startFlag = true;
        var gameEngine = new GameEngine();
        gameEngine.init();
    }
};
playAgainEl.onclick = function () {
    window.location.reload();
};
