const Player = (name, marker) => {
  return {
    name,
    marker
  };
}

const gameBoard = (function() {
  const gameBoardContainer = document.querySelector("#gameboard-container");
  const newGameButton = document.querySelector("#new-game-button");
  const board = Array.from(document.querySelectorAll('tile'));

  newGameButton.addEventListener("click", resetBoard);

  function makeBoard() {
    for (let i = 0; i < 9; i++) {
      let tile = document.createElement("div");
      tile.setAttribute("class", "tile");
      tile.setAttribute("id", [i]);
      board.push(tile);
      gameBoardContainer.appendChild(tile);
      tile.addEventListener("click", game.playTurn);
    }
  }

  function resetBoard() {
    location.reload();
  }

  return {
    makeBoard,
    board
  };
})();

const game = (function() {
  const playersModal = document.getElementById("players-modal");
  const playerXNameInput = document.getElementById("playerX-input");
  const playerONameInput = document.getElementById("playerO-input");
  const clearButton = document.getElementById("clear-button");
  const submitButton = document.getElementById("submit-button");
  const playerXNameDisplay = document.getElementById("playerX-name");
  const playerONameDisplay = document.getElementById("playerO-name");
  const winnerAnnouncement = document.getElementById("winner-announcement");
  const playerX = Player("", "X");
  const playerO = Player("", "O");
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
  let activePlayer = playerX;
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
    playerXNameInput.value = "";
    playerONameInput.value = "";
  }

  function assignPlayerNames() {
    event.preventDefault();

    if (playerXNameInput.value == "") { // if left blank, use default name
      playerX.name = "PLAYER X";
    } else { // otherwise, use the name entered
      playerXNameDisplay.innerHTML = playerXNameInput.value;
      playerX.name = playerXNameInput.value;
    }

    if (playerONameInput.value == "") {
      playerO.name = "PLAYER O";
    } else {
      playerONameDisplay.innerHTML = playerONameInput.value;
      playerO.name = playerONameInput.value;
    }

    closeModal();
  }

  function closeModal() {
    event.preventDefault();
    playersModal.classList.add("hidden");
  }

  function setActivePlayer() {
    if (roundNumber % 2 == 1) { // odd round numbers
      activePlayer = playerX;
    } else if (roundNumber % 2 == 0) { // even round numbers
      activePlayer = playerO;
    }
  }

  function playTurn() {
    if (!winnerDeclared) {
      if (this.innerHTML == "") { // only place markers on empty tiles
        let index = this.id;
        this.innerHTML = activePlayer.marker;
        gameBoard.board[index].innerHTML = activePlayer.marker;
        checkWinner();
        roundNumber++;
        setActivePlayer();
      }
    }
  }

  function checkWinner() {
    for (let i = 0; i < winConditions.length; i++) {
      let winCondition = winConditions[i];
      let a = gameBoard.board[winCondition[0]].innerHTML;
      let b = gameBoard.board[winCondition[1]].innerHTML;
      let c = gameBoard.board[winCondition[2]].innerHTML;
      if (a == "" || b == "" || c == "") {
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
