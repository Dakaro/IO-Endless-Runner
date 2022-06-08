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
