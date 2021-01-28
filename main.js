const Player = (name, marker) => {
  return {
    name,
    marker
  };
}

const gameBoard = (function() {
  const gameBoardContainer = document.querySelector("#gameboard-container");
  const newGameButton = document.querySelector("#new-game-button");

  newGameButton.addEventListener("click", resetBoard);

  function makeBoard() {
    for (let i = 0; i < 9; i++) {
      let tile = document.createElement("div");
      tile.setAttribute("class", "tile");
      tile.setAttribute("id", [i]);
      gameBoardContainer.appendChild(tile);
      tile.addEventListener("click", game.playTurn);
    }
  }

  function resetBoard() {
    location.reload();
  }

  return {
    makeBoard
  };
})();

const game = (function() {
  const playersModal = document.getElementById("players-modal");
  const player1NameInput = document.getElementById("player1-input");
  const player2NameInput = document.getElementById("player2-input");
  const clearButton = document.getElementById("clear-button");
  const submitButton = document.getElementById("submit-button");
  const player1NameDisplay = document.getElementById("player1-name");
  const player2NameDisplay = document.getElementById("player2-name");
  const winnerAnnouncement = document.getElementById("winner-announcement");
  const player1 = Player("", "X");
  const player2 = Player("", "O");
  const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  let roundNumber = 1;
  let activePlayer = player1;
  let moves = [];
  let winnerDeclared = false;

  clearButton.addEventListener("click", clearPlayerNames);
  submitButton.addEventListener("click", assignPlayerNames);

  // clicking outside of the modal acts as a 'cancel' button and assigns default names
  window.addEventListener("click", (event) => {
    if (event.target === playersModal) {
      clearPlayerNames();
      assignPlayerNames();
      closeModal();
    }
  });

  function clearPlayerNames() {
    event.preventDefault();
    player1NameInput.value = "";
    player2NameInput.value = "";
  }

  function assignPlayerNames() {
    event.preventDefault();

    if (player1NameInput.value == "") { // if left blank, use default name
      player1.name = "PLAYER ONE";
    } else { // otherwise, use the name entered
      player1NameDisplay.innerHTML = player1NameInput.value;
      player1.name = player1NameInput.value;
    }

    if (player2NameInput.value == "") {
      player2.name = "PLAYER TWO";
    } else {
      player2NameDisplay.innerHTML = player2NameInput.value;
      player2.name = player2NameInput.value;
    }

    closeModal();
  }

  function closeModal() {
    event.preventDefault();
    playersModal.classList.add("hidden");
  }

  function setActivePlayer() {
    if (roundNumber % 2 == 1) { // odd round numbers
      activePlayer = player1;
    } else if (roundNumber % 2 == 0) { // even round numbers
      activePlayer = player2;
    }
  }

  function playTurn() {
    if (!winnerDeclared) {
      if (this.innerHTML == "") { // only place markers on empty tiles
        let index = this.id;
        this.innerHTML = activePlayer.marker;
        moves[index] = activePlayer.marker;
        checkWinner();
        roundNumber++;
        setActivePlayer();
      }
    }
  }

  function checkWinner() {
    for (let i = 0; i < winConditions.length; i++) {
      let winCondition = winConditions[i];
      let a = moves[winCondition[0]];
      let b = moves[winCondition[1]];
      let c = moves[winCondition[2]];
      if (a == undefined || b == undefined || c == undefined) {
        continue; // don't count 3 empty cells as a win
      }
      if (a === b && b === c) {
        winnerDeclared = true;
        declareWinner();
      }
    }

    if (roundNumber == 9 && winnerDeclared == false) {
      winnerAnnouncement.innerHTML = "IT'S A TIE!";
    }
  }

  function declareWinner() {
    winnerAnnouncement.innerHTML = `${activePlayer.name} WINS!`;
  }

  return {
    playTurn
  };
})();

gameBoard.makeBoard();
