let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let aiPlayer = "O";
let gameActive = false;
let difficulty = 5;
let maxDifficulty = 100;

const buttons=document.querySelectorAll('.dot');
buttons.forEach((button)=>{
  button.addEventListener('click', ()=>{
    buttons.forEach((btn)=>btn.classList.remove('clicked'));
    button.classList.add('clicked');
  });
});
document.getElementById('resetGame').addEventListener('click',()=>{
  buttons.forEach((button)=> button.classList.remove('clicked'));
});

const winConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function setDifficulty(level) {
  difficulty = level;
  document.getElementById("status-message").textContent = `Difficulty: ${difficulty}% - Your Turn!`;
  gameActive = true;
}

function makeMove(index) {
  if (!gameActive || board[index] !== "") return;

  board[index] = currentPlayer;
  document.querySelectorAll(".cell")[index].textContent = currentPlayer;

  if (checkWinner(currentPlayer)) {
    document.getElementById("status-message").textContent = "Victory is Yours!";
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    document.getElementById("status-message").textContent = "Both played Well!";
    gameActive = false;
    return;
  }

  currentPlayer = aiPlayer;
  document.getElementById("status-message").textContent = "AI Dominates!";
  setTimeout(aiMove, 500);
}

function aiMove() {
  let move;
  if (Math.random() * 100 < difficulty) {
    // Higher difficulty = More optimal moves (Minimax)
    move = bestMove();
  } else {
    // Lower difficulty = Random move
    move = randomMove();
  }

  board[move] = aiPlayer;
  document.querySelectorAll(".cell")[move].textContent = aiPlayer;

  if (checkWinner(aiPlayer)) {
    document.getElementById("status-message").textContent = "AI Dominates!";
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    document.getElementById("status-message").textContent = "Both played Well!";
    gameActive = false;
    return;
  }

  currentPlayer = "X";
  document.getElementById("status-message").textContent = "Your Turn!";
}

function randomMove() {
  const available = board.map((cell, index) => (cell === "" ? index : null)).filter(val => val !== null);
  return available[Math.floor(Math.random() * available.length)];
}

function bestMove() {
  let bestScore = -Infinity;
  let move;
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = aiPlayer;
      let score = minimax(board, 0, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }
  return move;
}

function minimax(board, depth, isMaximizing) {
  const winner = checkWinner(aiPlayer) ? aiPlayer : checkWinner("X") ? "X" : null;
  if (winner === aiPlayer) return 10 - depth;
  if (winner === "X") return depth - 10;
  if (board.every(cell => cell !== "")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = aiPlayer;
        let score = minimax(board, depth + 1, false);
        board[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        board[i] = "X";
        let score = minimax(board, depth + 1, true);
        board[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function checkWinner(player) {
  return winConditions.some(condition => condition.every(index => board[index] === player));
}

function resetGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = false;
  document.getElementById("status-message").textContent = "Choose a mode to start!";
  document.querySelectorAll(".cell").forEach(cell => (cell.textContent = ""));
}
