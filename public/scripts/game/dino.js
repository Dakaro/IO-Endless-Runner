"strict mode";

/////////////////////////////
// APLICATION ARCHITECTURE
let containerEl = document.getElementById("container");
let playerEl = document.getElementById("hero");
let scoreEl = document.getElementById("score");
let distanceEl = document.querySelector(".distance");
let countdownEl = document.querySelector(".countdown");
let playAgainEl = document.querySelector(".playAgain");
let coinIconEl = document.querySelector(".coinIcon");
let overEl = document.querySelector(".over");
const modal = document.getElementById("modal");
const hearthsEl = document.querySelectorAll(".hearth");
let player,
  coin,
  enemy,
  newCoin,
  newEnemy,
  speed = 1;

newEnemy = document.createElement("div");
newEnemy.classList.add("enemy");
newCoin = document.createElement("div");
newCoin.classList.add("coin");

class Game {
  constructor() {
    this.distance = 0;
  }

  countDistance() {
    let this2 = this;
    setInterval(function () {
      this2.distance++;
      distanceEl.innerHTML = this2.distance + "m";
    }, 100);
  }

  changeSpeed() {
    setInterval(function () {
      if (speed > 0.3) speed -= 0.05;
    }, 3000);
  }

  findHit() {
    let this2 = this;
    let flag = false;
    let flagHearths = false;
    setInterval(function () {
      let playerBot = parseInt(
        window.getComputedStyle(playerEl).getPropertyValue("bottom")
      );
      let enemyBlock = parseInt(
        window.getComputedStyle(newEnemy).getPropertyValue("left")
      );
      if (enemyBlock < 70 && enemyBlock > 20 && playerBot <= 70) {
        if (flagHearths == false) {
          if (player.hearths > 1) {
            player.getHit();
          } else {
            player.getHit();
            this2.endGame();
          }

          flagHearths = true;
          setTimeout(function () {
            flagHearths = false;
          }, 500);
        }
      }
      let coinBlock = parseInt(
        window.getComputedStyle(newCoin).getPropertyValue("left")
      );
      if (coinBlock < 70 && coinBlock > 20 && playerBot >= 50) {
        if (flag == false) {
          coin.count++;
          flag = true;
          newCoin.remove();
          scoreEl.innerHTML = coin.count;
        }
        setTimeout(function () {
          flag = false;
        }, 500);
      }
    }, 10);
  }

  startGame() {
    let count = 3;
    let this2 = this;
    countdownEl.innerHTML = count;
    count--;
    const countdownInterval = setInterval(function () {
      countdownEl.innerHTML = count;
      count--;
      if (count == -1) {
        clearInterval(countdownInterval);
        countdownEl.style.display = "none";
        modal.style.display = "none";
        coin = new Coin();
        player = new Player();
        enemy = new Enemy();
        this2.countDistance();
        this2.changeSpeed();
        this2.findHit();
      }
    }, 1000);
  }

  endGame() {
    modal.style.display = "block";
    countdownEl.style.display = "block";
    overEl.style.display = "block";
    playAgainEl.style.display = "block";
    coinIconEl.style.display = "none";
    distanceEl.style.display = "none";
    scoreEl.style.display = "none";
    countdownEl.style.fontSize = "40px";
    const finalDistance = this.distance;
    const finalScore = coin.count;
    countdownEl.innerHTML =
      `Przebyty dystans: ${finalDistance}m` +
      "<br />" +
      `Zdobyte monety: ${finalScore}`;
  }
}

class Player {
  constructor() {
    this.hearths = 3;
    this.control();
  }

  control() {
    document.body.onkeydown = function (e) {
      if (e.keyCode == 32 || e.keyCode == 38) {
        if (!playerEl.classList.contains("goJump")) {
          playerEl.classList.add("goJump");
          setTimeout(function () {
            playerEl.classList.remove("goJump");
          }, 700);
        }
      }
    };
  }

  getHit() {
    if (!containerEl.classList.contains("hit")) {
      containerEl.classList.add("hit");
      setTimeout(function () {
        containerEl.classList.remove("hit");
      }, 500);
    }
    this.hearths--;
    hearthsEl[this.hearths].remove();
  }
}

class Coin {
  constructor() {
    this.count = 0;
    this.releaseCoin();
  }

  createCoin() {
    newCoin = document.createElement("div");
    newCoin.classList.add("coin");
    containerEl.appendChild(newCoin);
    newCoin.style.animationDuration = 2000 * 1.5 * speed + "ms";
    newCoin.onanimationend = () => {
      newCoin.remove();
    };
  }

  releaseCoin() {
    let rand;
    let this2 = this;
    rand = Math.floor(Math.random() * (10 - 6 + 1) + 6) * 500;
    setTimeout(function () {
      this2.createCoin();
      this2.releaseCoin();
    }, rand);
  }
}

class Enemy {
  constructor() {
    this.releaseEnemy();
  }

  createEnemy() {
    newEnemy = document.createElement("div");
    newEnemy.classList.add("enemy");
    containerEl.appendChild(newEnemy);
    newEnemy.style.animationDuration = 2000 * speed + "ms";
    newEnemy.onanimationend = () => {
      newEnemy.remove();
    };
  }

  releaseEnemy() {
    let rand;
    let this2 = this;
    rand = Math.floor(Math.random() * (8 - 4 + 1) + 4) * 500;
    setTimeout(function () {
      this2.createEnemy();
      this2.releaseEnemy();
    }, rand);
  }
}

flag = false;
countdownEl.onclick = function () {
  if (flag == false) {
    flag = true;
    const game = new Game();
    game.startGame();
  }
};
