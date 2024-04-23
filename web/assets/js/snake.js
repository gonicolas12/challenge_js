const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let food;
let score;
let d;
let game;
let currentDifficulty = 'medium';
let eatEffect = false;

function setupGame(difficulty) {
    currentDifficulty = difficulty;
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    score = 0;
    d = null;
    if (game) clearInterval(game);
    let speed = 100;
    if (difficulty === 'easy') speed = 150;
    else if (difficulty === 'medium') speed = 100;
    else if (difficulty === 'hard') speed = 50;
    game = setInterval(draw, speed);
    document.getElementById('snakeGame').style.display = 'block';
    document.getElementById('difficultySelection').style.display = 'none';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('backToDifficultyButton').style.display = 'block';
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < snake.length; i++) {
        let gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
        gradient.addColorStop(0, i == 0 && eatEffect ? "yellow" : "lime");
        gradient.addColorStop(1, i == 0 && eatEffect ? "green" : "darkgreen");
        ctx.fillStyle = gradient;
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "darkslategray";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }
    let foodGradient = ctx.createRadialGradient(food.x + box/2, food.y + box/2, 1, food.x + box/2, food.y + box/2, box/2);
    foodGradient.addColorStop(0, "orange");
    foodGradient.addColorStop(1, "red");
    ctx.fillStyle = foodGradient;
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        eatEffect = true;
        setTimeout(() => { eatEffect = false; }, 100);
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };
    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        document.getElementById('restartButton').style.display = 'block';
        alert("Game Over. Score: " + score);
    }

    if (!collision(newHead, snake)) {
        snake.unshift(newHead);
    }

    ctx.fillStyle = "white";
    ctx.font = "20px Roboto";
    ctx.fillText(`Score: ${score}`, canvas.width - 120, 30);
}

document.getElementById('restartButton').addEventListener('click', function() {
    setupGame(currentDifficulty);
});

document.getElementById('backToDifficultyButton').addEventListener('click', function() {
    document.getElementById('snakeGame').style.display = 'none';
    document.getElementById('difficultySelection').style.display = 'block';
    document.getElementById('restartButton').style.display = 'none';
    document.getElementById('backToDifficultyButton').style.display = 'none';
    clearInterval(game);
});

document.addEventListener("keydown", direction);
function direction(event) {
    let key = event.keyCode;
    if (key == 37 && d != "RIGHT") d = "LEFT";
    else if (key == 38 && d != "DOWN") d = "UP";
    else if (key == 39 && d != "LEFT") d = "RIGHT";
    else if (key == 40 && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function startGame(difficulty) {
    setupGame(difficulty);
}
