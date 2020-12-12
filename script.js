/*----- app's state (variables) -----*/
let playerCount = 0;
let currentPlayer = 0;
let players = [];

/*----- cached element references -----*/
let header = document.getElementById("header");
let roller = document.getElementById("roller");
let rollButton = document.getElementById("roll");
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
//document.getElementById('again').addEventListener('click', selectPlayer);

/*----- functions -----*/
function init() {

}

function playerRoll(evt) {
  rollButton.disabled = true;
  if (players[currentPlayer].dice.length == 5){
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

function newRound(){
  if (winner(players)){
    playerPrompt.innerHTML = `Player ${winner(players)[0]} Wins with ${winner(players)[1]}!!<br>`;
  } else {
    playerPrompt.innerHTML = 'No one qualified...';
  }
  playerPrompt.insertAdjacentHTML('beforeend','Game Over, Play Again?');
  let again = `<br><button value='again' id='again'>Play Again</button>`;
  playerPrompt.insertAdjacentHTML('beforeend', again);
  document.getElementById('again').addEventListener('click', selectPlayer);
  //again.style.display = 'block';
  roll.style.display = 'none';
  mat.style.display = 'none';
  held.style.display = 'none';
  //header.style.display = "block";
}

function saveDice(evt) {
  rollButton.disabled = false;
  players[currentPlayer].taken = true;
  players[currentPlayer].dice.push(parseInt(evt.target.value));
  if (players[currentPlayer].dice.length == 6) {
    document.getElementById(`score${currentPlayer}`).innerHTML = `${players[currentPlayer].isDone()}<br>${players[currentPlayer].dice.join(' - ')}`;
    //document.getElementById(`score${currentPlayer}`).insertAdjacentHTML('beforeend', `: ${players[currentPlayer].dice}`);
    currentPlayer++;
    //If round is over
    if (currentPlayer >= players.length) {
      newRound();
    } else {
      playerPrompt.innerHTML = `Player ${currentPlayer + 1} Ready to Roll!`;
    }
  }
  evt.target.remove();
  if (document.getElementById("topDice")) {document.getElementById("topDice").remove()}
  if (document.getElementById("bottomDice")) {document.getElementById("bottomDice").remove()}
  if(currentPlayer < players.length) {
    let scoreUpdate = document.getElementById(`score${currentPlayer}`);
    scoreUpdate.innerHTML = players[currentPlayer].dice.map(String).join(' - ');
    held.innerHTML = players[currentPlayer].dice.map(String).join(' - ');
  }
}

function selectPlayer(evt) {
  if (!playerCount) {
    playerCount = evt.target.innerHTML;
  }
  mat.innerHTML = "";
  mat.style.display = 'block';
  scores.innerHTML = "<tr><th>Player</th><th>Score</th></tr>";
  currentPlayer = 0;
  players = [];
  for (let i=0; i<playerCount; i++){
    players.push(new Player(i));
  }
  for (let i=0; i<playerCount; i++){
    scores.insertAdjacentHTML('beforeend', `<tr><td>${i+1}</td><td id='score${i}'></td></tr>`);
  }
  header.style.display = 'none';
  //header.style.visibility = 'hidden';
  roll.style.display = 'block';
  playerPrompt.innerHTML = 'Player 1 Ready to Roll!';
}

function winner(players){
  let highest = 0;
  let current = 0;
  let count = 0;
  players.forEach(function(player){
    count++;
    if (player.total() > highest && player.isQualified()) {
      highest = player.total();
      current = count;
    }
  });
  if (current) {
    return [current, highest];
  } else {
    return false;
  }
}

init();