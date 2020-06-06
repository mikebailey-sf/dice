
/*----- constants -----*/

/*----- app's state (variables) -----*/

let playerCount = 0;
let currentPlayer = 0;
let players = [];
players[0] = new Player(1);
players[1] = new Player(2);

/*----- cached element references -----*/
let header = document.getElementById("header");
let mat = document.getElementById("mat");
let held = document.getElementById("held");
let diceButton = document.getElementsByClassName("diceButton");
let selectPlayers = document.getElementsByClassName("selectPlayers");

/*----- event listeners -----*/
document.getElementById("roll").addEventListener("click", playerRoll);
for (var i = 0; i < selectPlayers.length; i++) {
  selectPlayers[i].addEventListener("click", selectPlayer);
}

/*----- functions -----*/
function init() {}

function playerRoll(evt) {
  let roll = players[currentPlayer].roll();
  let rollHtml = roll.map(x => "<button class='diceButton'>" + x + "</button>");
  mat.innerHTML = rollHtml;
  let rolledDice = document.getElementsByClassName("diceButton");
  for (var i = 0; i < rolledDice.length; i++) {
    rolledDice[i].addEventListener("click", saveDice);
  }
}

function saveDice(evt) {
  players[currentPlayer].taken = true;
  players[currentPlayer].dice.push(parseInt(evt.target.innerHTML));
  if (players[currentPlayer].dice.length == 6) {
    players[currentPlayer].isDone();
  }
  evt.target.remove();
  held.innerHTML = players[currentPlayer].dice;
}

function selectPlayer(evt) {
  alert(evt.target.innerHTML);
  playerCount = evt.target.innerHTML;
}

init();
