class Morpion {
    constructor(firstPlayer = 'X', mode = 'computer') {
        this.board = Array(9).fill(null);
        this.player = firstPlayer;
        this.winner = null;
        this.mode = mode;
        this.boardElement = document.getElementById('board');
        if (this.boardElement) {
            this.initBoard(); // Initialise le tableau dès la création de l'instance
        } else {
            console.error("Board element not found!");
        }
    }
 
    initBoard() {
        this.boardElement.innerHTML = ''; // Nettoie le tableau
        this.board.forEach((cell, index) => {
            let cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            cellElement.addEventListener('click', () => {
                this.play(index);
                this.updateBoard();
            });
            this.boardElement.appendChild(cellElement);
        });
        this.updateBoard();
    }
 
    updateBoard() {
        let cells = this.boardElement.children;
        Array.from(cells).forEach((cell, index) => {
            cell.innerHTML = this.board[index] || '';
        });
    }
 
    play(index) {
        if (this.winner || this.board[index]) return;
        this.board[index] = this.player;
        this.updateBoard();
        if (this.checkWin()) {
            this.winner = this.player;
            this.checkEndGame();
        } else if (!this.board.includes(null)) {
            this.winner = 'Draw';
            this.checkEndGame();
        } else {
            this.player = this.player === 'X' ? 'O' : 'X';
            if (this.mode === 'computer' && this.player === 'O') {
                this.playSmart();  // Jouer automatiquement pour l'ordinateur
            }
        }
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
        // Stratégie simple de jeu automatique: bloquer ou gagner
        let move = this.findWinningMove('O') || this.findWinningMove('X') || this.findRandomMove();
        if (move !== null) this.play(move);
    }
 
    findWinningMove(player) {
        for (let i = 0; i < this.board.length; i++) {
            if (!this.board[i]) {
                this.board[i] = player;
                if (this.checkWin()) {
                    this.board[i] = null;
                    return i;
                }
                this.board[i] = null;
            }
        }
        return null;
    }
 
    findRandomMove() {
        let available = this.board.map((cell, idx) => cell === null ? idx : null).filter(val => val !== null);
        return available.length ? available[Math.floor(Math.random() * available.length)] : null;
    }
 
    checkEndGame() {
        if (this.winner) {
            this.displayResultMessage(this.winner === 'Draw' ? "C'est un match nul" : `Le gagnant est ${this.winner}`);
            this.showButtons();
        }
    }
 
    displayResultMessage(message) {
        let resultMessageElement = document.getElementById('resultMessage');
        resultMessageElement.textContent = message;
    }
 
    clearResultMessage() {
        let resultMessageElement = document.getElementById('resultMessage');
        resultMessageElement.textContent = '';
    }
 
    showButtons() {
        let resultElement = document.getElementById('result');
        resultElement.innerHTML = ''; // Nettoie les boutons existants avant d'en ajouter de nouveaux
 
        let replayButton = document.createElement('button');
        replayButton.textContent = "Rejouer";
        replayButton.onclick = () => this.restartGame();
 
        let menuButton = document.createElement('button');
        menuButton.textContent = "Revenir au menu";
        menuButton.onclick = () => window.location.href = 'morpionMode.html';
 
        resultElement.appendChild(replayButton);
        resultElement.appendChild(menuButton);
    }
 
    restartGame() {
        this.board = Array(9).fill(null);
        this.player = 'X';
        this.winner = null;
        this.clearResultMessage();
        this.initBoard(); // Réinitialise le tableau
        let resultElement = document.getElementById('result');
        resultElement.innerHTML = ''; // Cache les boutons après avoir cliqué sur Rejouer
    }
}
 
document.addEventListener('DOMContentLoaded', function() {
    const selectedMode = localStorage.getItem('selectedMode') || 'computer';
    console.log("Mode sélectionné: ", selectedMode); // Afficher le mode pour le débogage
    new Morpion('X', selectedMode);
});