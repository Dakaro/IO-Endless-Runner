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
