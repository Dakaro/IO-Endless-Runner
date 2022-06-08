class Player {
  constructor() {
    this.hearths = 3;
    this.control();
  }

  control() {
    document.body.onkeydown = function (e) {
      if (e.keyCode == 32 || e.keyCode == 38) {
        e.preventDefault()
        if (!playerEl.classList.contains("goJump")) {
          playerEl.classList.add("goJump");
          setTimeout(function () {
            playerEl.classList.remove("goJump");
          }, 500);
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
