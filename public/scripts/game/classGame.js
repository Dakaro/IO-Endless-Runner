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
      if (speed > 0.3) speed -= ACCELERATION;
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

          if (!coinIconEl.classList.contains("goCoinHit")) {
            coinIconEl.classList.add("goCoinHit");
            setTimeout(function () {
              coinIconEl.classList.remove("goCoinHit");
            }, 500);
          }

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
    }, 3);
  }

  endGame() {
    modal.style.display = "block";
    countdownEl.style.display = "block";
    overEl.style.display = "block";
    playAgainEl.style.display = "block";

    modal.style.backgroundColor = "black";
    modal.style.zIndex = "1000";
    coinIconEl.style.display = "none";
    distanceEl.style.display = "none";
    scoreEl.style.display = "none";
    countdownEl.style.fontSize = "40px";
    const finalDistance = this.distance;
    const finalScore = coin.count;
    countdownEl.innerHTML =
      `Final distance: ${finalDistance}m` +
      "<br />" +
      `Collected coins: ${finalScore}`;
  }
}
