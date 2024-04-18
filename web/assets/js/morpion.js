class Morpion {
    constructor(firstPlayer = 'X', mode = 'computer') {
        this.board = Array(9).fill(null);
        this.player = firstPlayer;
        this.winner = null;
        this.mode = mode;
    }

    play(index) {
        if (this.winner || this.board[index]) return;
        this.board[index] = this.player;
        if (this.checkWin()) {
            this.winner = this.player;
        }
        this.player = this.player === 'X' ? 'O' : 'X';
        this.nextMove(); // Vérification de la fin du jeu après chaque action
    }

    checkWin() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        for (let line of lines) {
            if (this.board[line[0]] && this.board[line[0]] === this.board[line[1]] && this.board[line[0]] === this.board[line[2]]) {
                return true;
            }
        }
        return false;
    }

    playSmart() {
        if (this.winner) return;
        let available = this.board.reduce((acc, val, idx) => val ? acc : [...acc, idx], []);
        let winningMove = this.findWinningMove(available);
        let blockingMove = this.findBlockingMove(available);
        let move;
        if (winningMove !== null) {
            move = winningMove;
        } else if (blockingMove !== null) {
            move = blockingMove;
        } else {
            move = available[Math.floor(Math.random() * available.length)];
        }
        this.play(move);
    }

    findWinningMove(available) {
        for (let move of available) {
            this.board[move] = this.player;
            if (this.checkWin()) {
                this.board[move] = null;
                return move;
            }
            this.board[move] = null;
        }
        return null;
    }

    findBlockingMove(available) {
        let opponent = this.player === 'X' ? 'O' : 'X';
        for (let move of available) {
            this.board[move] = opponent;
            if (this.checkWin()) {
                this.board[move] = null;
                return move;
            }
            this.board[move] = null;
        }
        return null;
    }

    nextMove() {
        if (this.mode === 'computer' && this.player === 'O' && !this.winner) {
            this.playSmart();
        }
        this.checkEndGame();
    }

    checkEndGame() {
        if (this.winner || !this.board.includes(null)) {
            setTimeout(() => {
                let result = this.winner ? `Game over! The winner is ${this.winner}` : "Game over! It's a draw";
                alert(result);
                let playAgain = confirm("Do you want to play again?");
                if (playAgain) {
                    this.reset(this.player, this.mode); // Garder le même utilisateur et le même mode
                }
            }, 100); // Retarder l'alerte de 100 millisecondes
        }
    }
    

    reset(firstPlayer = 'X', mode = 'computer') {
        this.board = Array(9).fill(null);
        this.player = firstPlayer;
        this.winner = null;
        this.mode = mode; // Réinitialisez également le mode de jeu
    }
}

let game = new Morpion();
let boardElement = document.getElementById('board');
let resetButton = document.getElementById('reset');
let modeSelect = document.getElementById('mode');

resetButton.addEventListener('click', () => {
    game.reset(game.player, game.mode); // Garder le même utilisateur et le même mode
    updateBoard();
});

modeSelect.addEventListener('change', () => {
    game.mode = modeSelect.value;
});

function updateBoard() {
    boardElement.innerHTML = '';
    game.board.forEach((cell, index) => {
        let cellElement = document.createElement('div');
        cellElement.innerHTML = cell || '';
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => {
            game.play(index);
            updateBoard();
        });
        boardElement.appendChild(cellElement);
    });
}

updateBoard(); // Appel initial pour afficher le tableau

modeSelect.addEventListener('change', () => {
    game.mode = modeSelect.value;
});

function updateBoard() {
    boardElement.innerHTML = '';
    game.board.forEach((cell, index) => {
        let cellElement = document.createElement('div');
        cellElement.innerHTML = cell || '';
        cellElement.classList.add('cell');
        cellElement.addEventListener('click', () => {
            game.play(index);
            updateBoard();
        });
        boardElement.appendChild(cellElement);
    });
}

updateBoard(); // Appel initial pour afficher le tableau
