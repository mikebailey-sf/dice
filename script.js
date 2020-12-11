/*----- app's state (variables) -----*/

let playerCount = 0;
let currentPlayer = 0;
let players = [];

/*----- cached element references -----*/
let header = document.getElementById("header");
let roller = document.getElementById("roller");
let mat = document.getElementById("mat");
let held = document.getElementById("held");
let playerPrompt = document.getElementById("player-prompt");
let diceButton = document.getElementsByClassName("diceButton");
let selectPlayers = document.getElementsByClassName("selectPlayers");

/*----- event listeners -----*/
document.getElementById("roll").addEventListener("click", playerRoll);
for (var i = 0; i < selectPlayers.length; i++) {
  selectPlayers[i].addEventListener("click", selectPlayer);
}

/*----- functions -----*/
function init() {
  warning.style.visibility = "hidden";
}

function playerRoll(evt) {
  let roll = players[currentPlayer].roll();
  if (roll==0){
    warning.style.visibility = "visible";
  } else {
    let rollHtml = roll.map(x => "<button class='diceButton'>" + x + "</button>").join('');
    mat.innerHTML = rollHtml;
    let rolledDice = document.getElementsByClassName("diceButton");
    for (var i = 0; i < rolledDice.length; i++) {
      rolledDice[i].addEventListener("click", saveDice);
    }
  }
}

function saveDice(evt) {
  warning.style.visibility = "hidden";
  players[currentPlayer].taken = true;
  players[currentPlayer].dice.push(parseInt(evt.target.innerHTML));
  if (players[currentPlayer].dice.length == 6) {
    document.getElementById(`score${currentPlayer}`).innerHTML = players[currentPlayer].isDone();
    //document.getElementById(`score${currentPlayer}`).insertAdjacentHTML('beforeend', `: ${players[currentPlayer].dice}`);
    currentPlayer++;
    if (currentPlayer >= players.length) {
      playerPrompt.innerHTML = 'Game Over, Play Again?'
      roll.style.display = 'none';
      mat.style.display = 'none';
      held.style.display = 'none';
      header.style.display = "block";
    } else {
      playerPrompt.innerHTML = `Player ${currentPlayer + 1} Ready to Roll!`;
    }
  }
  evt.target.remove();
  if(currentPlayer < players.length) {
    held.innerHTML = players[currentPlayer].dice.map(String).join(' - ');
  }
}

function selectPlayer(evt) {
  playerCount = evt.target.innerHTML;
  mat.innerHTML = "";
  mat.style.display = 'block';
  scoreboard.innerHTML = "";
  currentPlayer = 0;
  players = [];
  for (let i=0; i<playerCount; i++){
    players.push(new Player(i));
  }
  for (let i=0; i<playerCount; i++){
    scoreboard.insertAdjacentHTML('beforeend', `<p>Player ${i+1}: <span id="score${i}">Waiting...</span></p>`);
  }
  header.style.display = 'none';
  //header.style.visibility = 'hidden';
  roll.style.display = 'block';
  playerPrompt.innerHTML = 'Player 1 Ready to Roll!';
}

init();