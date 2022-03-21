'strict mode';

let cont = document.getElementById('container');
let hero = document.getElementById("hero");
let enemy = document.getElementById('enemy');
let coin = document.getElementById('coin');
let score = document.getElementById('score');
const modal = document.getElementById("modal");
let newEnemy;

let scoreCount = 0;

console.log(hero);

document.body.onkeydown = function(e){
    if(e.keyCode == 32){
        if(!hero.classList.contains("goJump"))
        {
            hero.classList.add("goJump");
            var audio = new Audio('http://tale3habet.eb2a.com/sounds/jump%20c%2009.mp3');
            audio.loop = false;
            audio.play(); 
setTimeout(function(){
    hero.classList.remove("goJump");
}, 700);
}
}
if(e.keyCode == 40){
    if(!hero.classList.contains("goDown"))
    {
        
        hero.classList.add("goDown");
        var audio = new Audio('http://tale3habet.eb2a.com/sounds/jump%20c%2009.mp3');
        audio.loop = false;
        audio.play(); 
setTimeout(function(){
hero.classList.remove("goDown");
}, 700);
}
}}

setInterval(function(){
    let heroBot = parseInt(window.getComputedStyle(hero).getPropertyValue("bottom"))
    let enemyBlock = parseInt(window.getComputedStyle(newEnemy).getPropertyValue("left"));
    if(enemyBlock<70 && enemyBlock>20 && heroBot <=50){modal.style.display = "block";}
}, 10);


function closeModal(){

    modal.style.display = "none";
}

function createEnemy(){
    newEnemy = document.createElement("div");
    newEnemy.classList.add("enemy")
cont.appendChild(newEnemy);
}

let rand;

function myFunction() {

    let min = 3, max = 7;
    rand = Math.floor(Math.random() * (max - min + 1) + min); //Generate Random number between 5 - 10
    console.log('Wait for ' + rand + ' seconds');
    setTimeout(function(){
    createEnemy();
    myFunction()
    }, rand * 1000);
  }

  myFunction();
  

setInterval(function coinTouch(){
    let heroBot = parseInt(window.getComputedStyle(hero).getPropertyValue("bottom"))
    let coinBlock = parseInt(window.getComputedStyle(coin).getPropertyValue("left"));
    if(coinBlock<70 && coinBlock>20 && heroBot >=50){
            scoreCount++; score.innerHTML = scoreCount;
            coin.remove();  

}
}, 10);

