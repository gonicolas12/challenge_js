const columns = 7;
const rows = 6;
const board = [];
let currentPlayer = 'Rouge';
let gameMode = '';
let gameActive = true;

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('restartButton').addEventListener('click', restartGame);
    document.getElementById('menuButton').addEventListener('click', returnToMenu);
    document.querySelector('button').addEventListener('click', startGame);
});

function startGame() {
    gameMode = document.querySelector('input[name="mode"]:checked').value;
    createBoard(document.getElementById('gameBoard'));
    document.getElementById('connectFour').style.display = 'flex';
    document.querySelector('.center').style.display = 'none';
    document.getElementById('menuButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    gameActive = true;
}

function createBoard(gameBoard) {
    gameBoard.innerHTML = '';
    board.length = 0;

    for (let row = 0; row < rows; row++) {
        board[row] = [];
        for (let col = 0; col < columns; col++) {
            board[row][col] = null;
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = col;
            cell.dataset.y = row;
            gameBoard.appendChild(cell);
        }
    }

    gameBoard.addEventListener('click', handleBoardClick);
}

function handleBoardClick(event) {
    // Vérifie si la case cliquée est une case vide
    if (event.target.classList.contains('cell') && gameActive) {
        const x = parseInt(event.target.dataset.x);
        if (gameMode !== 'computer' || currentPlayer === 'Rouge') {
            placeDisc(x);
        }
    }
}

function placeDisc(x) {
    // Trouve la première case vide dans la colonne
    for (let y = rows - 1; y >= 0; y--) {
        if (board[y][x] === null) {
            board[y][x] = currentPlayer;
            updateBoard();
            if (checkGameOver()) return;
            currentPlayer = currentPlayer === 'Rouge' ? 'Jaune' : 'Rouge';
            if (gameMode === 'computer' && currentPlayer === 'Jaune') {
                setTimeout(placeDiscComputer, 500);
            }
            break;
        }
    }
}

function placeDiscComputer() {
    // Vérifie si l'ordinateur peut gagner au prochain tour
    let placed = false;
    let bestMove = findBestMove();
    while (!placed) {
        const x = bestMove.x;
        for (let y = rows - 1; y >= 0; y--) {
            if (!board[y][x]) {
                board[y][x] = currentPlayer;
                updateBoard();
                if (checkGameOver()) return;
                currentPlayer = 'Rouge';
                placed = true;
                break;
            }
        }
    }
}

function findBestMove() {
    // Vérifie si le joueur peut gagner au prochain tour
    for (let col = 0; col < columns; col++) {
        if (isWinningMove(col, 'Jaune')) {
            return { x: col };
        }
    }

    // Vérifie si l'ordinateur peut gagner au prochain tour
    for (let col = 0; col < columns; col++) {
        if (isWinningMove(col, 'Rouge')) {
            return { x: col };
        }
    }

    let validMove = false;
    let x;
    while (!validMove) {
        x = Math.floor(Math.random() * columns);
        if (board[0][x] === null) {
            validMove = true;
        }
    }
    return { x: x };
}

function isWinningMove(col, player) {
    for (let row = rows - 1; row >= 0; row--) { // Trouve la première case vide dans la colonne
        if (!board[row][col]) {
            board[row][col] = player;
            const won = checkForWinner();
            board[row][col] = null;
            if (won === player) {
                return true;
            }
            break;
        }
    }
    return false;
}

function updateBoard() {
    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < columns; x++) {
            const cell = document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`);
            if (board[y][x]) {
                cell.classList.add(board[y][x]);
            } else {
                cell.classList.remove('Rouge', 'Jaune');
            }
        }
    }
}

function checkGameOver() {
    const winner = checkForWinner();
    if (winner) {
        displayWinner(winner);
        gameActive = false;
        return true;
    }
    return false;
}

function displayWinner(winner) {
    const winnerMessage = document.getElementById('winnerMessage');
    const winnerColor = document.getElementById('winnerColor');
    winnerColor.textContent = winner;
    winnerMessage.style.display = 'block';
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('restartButton').textContent = 'Nouvelle Partie';
    document.getElementById('menuButton').style.display = 'block';
    document.getElementById('restartButton').style.display = 'block';
}

function restartGame() {
    resetBoard();
    document.getElementById('menuButton').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
}

function returnToMenu() {
    document.querySelector('.center').style.display = 'flex';
    document.getElementById('connectFour').style.display = 'none';
    document.getElementById('winnerMessage').style.display = 'none';
    document.getElementById('menuButton').style.display = 'none';
    resetBoard();

    const startButton = document.querySelector('.start-button');
    startButton.style.display = 'block';
    startButton.style.margin = '20px auto';
}

function resetBoard() {
    board.forEach(row => row.fill(null));
    updateBoard();
    currentPlayer = 'Rouge';
    document.getElementById('gameBoard').style.display = 'grid';
    document.getElementById('winnerMessage').style.display = 'none';
    document.getElementById('restartButton').textContent = 'Recommencer';
    gameActive = true;
}

function checkForWinner() {
    // Vérifie les lignes
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row][col + 1] &&
                board[row][col] === board[row][col + 2] && board[row][col] === board[row][col + 3]) {
                return board[row][col];
            }
        }
    }

    // Vérifie les colonnes
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            if (board[row][col] && board[row][col] === board[row + 1][col] &&
                board[row][col] === board[row + 2][col] && board[row][col] === board[row + 3][col]) {
                return board[row][col];
            }
        }
    }

    // Vérifie les diagonales
    for (let row = 3; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row - 1][col + 1] &&
                board[row][col] === board[row - 2][col + 2] && board[row][col] === board[row - 3][col + 3]) {
                return board[row][col];
            }
        }
    }

    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row + 1][col + 1] &&
                board[row][col] === board[row + 2][col + 2] && board[row][col] === board[row + 3][col + 3]) {
                return board[row][col];
            }
        }
    }

    return null;
}
