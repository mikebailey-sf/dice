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
  if (roll==0){
    warning.style.visibility = "visible";
  } else if (players[currentPlayer].dice.length == 5){
    topsOrBottoms();
  }
  else {
    let roll = players[currentPlayer].roll();
    let rollHtml = roll.map(x => `<button value=${x} class='diceButton'>${x}</button>`).join('');
    mat.innerHTML = rollHtml;
    let rolledDice = document.getElementsByClassName("diceButton");
    for (var i = 0; i < rolledDice.length; i++) {
      rolledDice[i].addEventListener("click", saveDice);
    }
  }
}

function topsOrBottoms(){
  let top = players[currentPlayer].roll();
  let bottom = Math.abs(top - 7);
  let rollHtml = `<button value=${top} id='topDice'>Tops</button><button value=${bottom} id='bottomDice'>Bottoms</button>`;
  mat.innerHTML = rollHtml;
  document.getElementById("topDice").addEventListener("click", saveDice);
  document.getElementById("bottomDice").addEventListener("click", saveDice);
}

function saveDice(evt) {
  warning.style.visibility = "hidden";
  players[currentPlayer].taken = true;
  players[currentPlayer].dice.push(parseInt(evt.target.value));
  if (players[currentPlayer].dice.length == 6) {
    document.getElementById(`score${currentPlayer}`).innerHTML = `${players[currentPlayer].isDone()}<br>${players[currentPlayer].dice.join(' * ')}`;
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
  if (document.getElementById("topDice")) {document.getElementById("topDice").remove()}
  if (document.getElementById("bottomDice")) {document.getElementById("bottomDice").remove()}
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

function winner(players){
  let highest = 0;
  players.forEach(function(player){
    if (player.total() > highest) {
      highest = player.total();
    }
  });
  if (highest) {
    return highest;
  } else {
    return "No one qualified";
  }
}

init();