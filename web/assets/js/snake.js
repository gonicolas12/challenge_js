const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let food;
let score = 0;
let d;
let game;
let currentDifficulty;
let eatEffect = false;

function initializeUI() {
    document.getElementById('snakeGame').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('backToDifficultyButton').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('scoreBoard').style.display = 'none';
    displayScore();
    hideGameOverMessage();
}

function setupGame(difficulty) {
    currentDifficulty = difficulty;
    snake = [{ x: 9 * box, y: 10 * box }];
    food = { x: Math.floor(Math.random() * 17 + 1) * box, y: Math.floor(Math.random() * 17 + 1) * box };
    score = 0;
    d = null;
    if (game) clearInterval(game);
    let speed = 100;
    switch (difficulty) {
        case 'easy':
            speed = 150;
            break;
        case 'medium':
            speed = 100;
            break;
        case 'hard':
            speed = 50;
            break;
        case 'extreme':
            speed = 25;
            break;
    }
    game = setInterval(draw, speed);

    document.getElementById('snakeGame').style.display = 'block';
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('backToDifficultyButton').style.display = 'none';
    document.getElementById('scoreBoard').style.display = 'block';
    displayScore();
}

function startGame(difficulty) {
    setupGame(difficulty);
}

document.addEventListener("keydown", direction);

function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

document.getElementById('restartButton').addEventListener('click', function () {
    setupGame(currentDifficulty);
    hideGameOverMessage();
});

document.getElementById('backToDifficultyButton').addEventListener('click', function () {
    clearInterval(game);
    initializeUI();
});

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
        gradient.addColorStop(0, "#FFD700");
        gradient.addColorStop(1, "gold");
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "darkslategray";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    drawFood();
    moveSnake();
    handleCollisions();
    displayScore();
}

function moveSnake() {
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d === "LEFT") snakeX -= box;
    if (d === "UP") snakeY -= box;
    if (d === "RIGHT") snakeX += box;
    if (d === "DOWN") snakeY += box;

    if (snakeX === food.x && snakeY === food.y) {
        score++;
        eatEffect = true;
        setTimeout(() => { eatEffect = false; }, 100);
        food = { x: Math.floor(Math.random() * 17 + 1) * box, y: Math.floor(Math.random() * 17 + 1) * box };
        displayScore();
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        document.getElementById('restartButton').style.display = 'block';
        document.getElementById('backToDifficultyButton').style.display = 'block';
        document.getElementById('gameOverMessage').textContent = "Partie terminée. Votre score final est : " + score;
        document.getElementById('gameOverMessage').style.display = 'block';
    } else {
        snake.unshift(newHead);
    }
}

function drawFood() {
    let foodGradient = ctx.createRadialGradient(food.x + box / 2, food.y + box / 2, 1, food.x + box / 2, food.y + box / 2, box / 2);
    foodGradient.addColorStop(0, "orange");
    foodGradient.addColorStop(1, "red");
    ctx.fillStyle = foodGradient;
    ctx.fillRect(food.x, food.y, box, box);
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function displayScore() {
    const scoreBoard = document.getElementById('scoreBoard');
    const gameCanvas = document.getElementById('snakeGame');

    if (gameCanvas.style.display === 'block') {
        scoreBoard.textContent = `Score : ${score}`;
        scoreBoard.style.display = 'block';
        scoreBoard.style.color = '#FFD700';
        scoreBoard.style.fontSize = '20px';
        scoreBoard.style.position = 'absolute';
        scoreBoard.style.top = '10px';
        scoreBoard.style.left = '10px';
        scoreBoard.style.zIndex = '1000';
    } else {
        scoreBoard.style.display = 'none';
    }
}

function hideGameOverMessage() {
    const gameOverMessage = document.getElementById('gameOverMessage');
    gameOverMessage.style.display = 'none';
}

initializeUI();
