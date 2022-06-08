"strict mode";

flag = false;
countdownEl.onclick = function () {
  if (flag == false) {
    flag = true;
    const game = new Game();
    game.startGame();
  }
};

playAgainEl.onclick = function () {
  window.location.reload(true);
};
