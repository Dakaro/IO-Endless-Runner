let containerEl = document.getElementById("container");
let playerEl = document.getElementById("hero");
let scoreEl = document.getElementById("score");
let distanceEl = document.querySelector(".distance");
let countdownEl = document.querySelector(".countdown");
let playAgainEl = document.querySelector(".playAgain");
let coinIconEl = document.querySelector(".coinIcon");
let overEl = document.querySelector(".gameOver");
const modal = document.getElementById("modal");
const hearthsEl = document.querySelectorAll(".hearth");
let player,
  coin,
  enemy,
  newCoin,
  newEnemy,
  speed = 1;
const ACCELERATION = 0.05;

newEnemy = document.createElement("div");
newEnemy.classList.add("enemy");
newCoin = document.createElement("div");
newCoin.classList.add("coin");
