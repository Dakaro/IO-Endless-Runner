"strict mode";

let cont = document.getElementById("container");
let hero = document.getElementById("hero");
let coin = document.getElementById("coin");
let score = document.getElementById("score");
const modal = document.getElementById("modal");

let newEnemy;
let newCoin;
let speed = 1;
let rand;
let max = 8;
let min = 5;
let flag = false;

let scoreCount = 0;

document.body.onkeydown = function (e) {
  if (e.keyCode == 32) {
    if (!hero.classList.contains("goJump")) {
      hero.classList.add("goJump");
      // var audio = new Audio('http://tale3habet.eb2a.com/sounds/jump%20c%2009.mp3');
      // audio.loop = false;
      // audio.play();
      setTimeout(function () {
        hero.classList.remove("goJump");
      }, 700);
    }
  }
  if (e.keyCode == 40) {
    if (!hero.classList.contains("goDown")) {
      hero.classList.add("goDown");
      var audio = new Audio(
        "http://tale3habet.eb2a.com/sounds/jump%20c%2009.mp3"
      );
      audio.loop = false;
      audio.play();
      setTimeout(function () {
        hero.classList.remove("goDown");
      }, 700);
    }
  }
};

function closeModal() {
  modal.style.display = "none";
}

function createEnemy() {
  newEnemy = document.createElement("div");
  newEnemy.classList.add("enemy");
  cont.appendChild(newEnemy);
  newEnemy.style.animationDuration = 2000 * speed + "ms";
  newEnemy.onanimationend = () => {
    newEnemy.remove();
  };
}

function createCoin() {
  newCoin = document.createElement("div");
  newCoin.classList.add("coin");
  cont.appendChild(newCoin);
  newCoin.style.animationDuration = 2000 * 1.5 * speed + "ms";
  newCoin.onanimationend = () => {
    newCoin.remove();
  };
}

function releaseEnemy() {
  rand = Math.floor(Math.random() * (8 - 4 + 1) + 4) * 500;
  setTimeout(function () {
    createEnemy();
    releaseEnemy();
  }, rand);
}

function releaseCoin() {
  rand = Math.floor(Math.random() * (10 - 6 + 1) + 6) * 500;
  setTimeout(function () {
    createCoin();
    releaseCoin();
  }, rand);
}

setInterval(function speedUp() {
  if (speed > 0.4) speed -= 0.1;
}, 5000);

setInterval(function () {
  let heroBot = parseInt(
    window.getComputedStyle(hero).getPropertyValue("bottom")
  );
  let enemyBlock = parseInt(
    window.getComputedStyle(newEnemy).getPropertyValue("left")
  );
  if (enemyBlock < 70 && enemyBlock > 20 && heroBot <= 70) {
    modal.style.display = "block";
  }
  let coinBlock = parseInt(
    window.getComputedStyle(newCoin).getPropertyValue("left")
  );
  if (coinBlock < 70 && coinBlock > 20 && heroBot >= 50) {
    if (flag == false) {
      scoreCount++;
      flag = true;
      newCoin.remove();
      score.innerHTML = scoreCount;
    }
    setTimeout(function () {
      flag = false;
    }, 500);
  }
}, 10);

releaseEnemy();
releaseCoin();
