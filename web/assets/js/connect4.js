const columns = 7;
const rows = 6;
const board = [];
let currentPlayer = 'Rouge';

document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    createBoard(gameBoard);

    gameBoard.addEventListener('click', function(event) {
        if (event.target.classList.contains('cell')) {
            const x = parseInt(event.target.dataset.x);
            placeDisc(x);
        }
    });

    document.getElementById('restartButton').addEventListener('click', resetBoard);
});

function createBoard(gameBoard) {
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
}

function placeDisc(x) {
    for (let y = rows - 1; y >= 0; y--) {
        if (!board[y][x]) {
            board[y][x] = currentPlayer;
            updateBoard();
            currentPlayer = currentPlayer === 'Rouge' ? 'Jaune' : 'Rouge';
            break;
        }
    }
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

    const winner = checkForWinner();
    if (winner) {
        const winnerMessage = document.getElementById('winnerMessage');
        const winnerColor = document.getElementById('winnerColor');
        winnerColor.textContent = winner; // met à jour la couleur du gagnant
        winnerMessage.style.display = 'block'; // Affiche le message de victoire
        document.getElementById('gameBoard').style.display = 'none'; // cache le plateau
        document.getElementById('restartButton').textContent = 'Nouvelle Partie'; // change le texte du bouton pour une nouvelle partie
    }
}

function resetBoard() {
    board.forEach(row => row.fill(null));
    updateBoard();
    currentPlayer = 'Rouge';
    document.getElementById('gameBoard').style.display = 'grid'; // Réaffiche le plateau
    document.getElementById('winnerMessage').style.display = 'none'; // Cache le message de victoire
    document.getElementById('restartButton').textContent = 'Recommencer'; // Réinitialise le texte du bouton
}

function checkForWinner() {
    // Vérifier les alignements horizontaux
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row][col+1] &&
                board[row][col] === board[row][col+2] && board[row][col] === board[row][col+3]) {
                return board[row][col];
            }
        }
    }

    // Vérifier les alignements verticaux
    for (let col = 0; col < columns; col++) {
        for (let row = 0; row <= rows - 4; row++) {
            if (board[row][col] && board[row][col] === board[row+1][col] &&
                board[row][col] === board[row+2][col] && board[row][col] === board[row+3][col]) {
                return board[row][col];
            }
        }
    }

    // Vérifier les diagonales montantes
    for (let row = 3; row < rows; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row-1][col+1] &&
                board[row][col] === board[row-2][col+2] && board[row][col] === board[row-3][col+3]) {
                return board[row][col];
            }
        }
    }

    // Vérifier les diagonales descendantes
    for (let row = 0; row <= rows - 4; row++) {
        for (let col = 0; col <= columns - 4; col++) {
            if (board[row][col] && board[row][col] === board[row+1][col+1] &&
                board[row][col] === board[row+2][col+2] && board[row][col] === board[row+3][col+3]) {
                return board[row][col];
            }
        }
    }

    return null; // aucun gagnant trouvé
}
