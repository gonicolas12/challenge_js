const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
let food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
let score = 0;
let d;

let snakeHeadImg = new Image();
snakeHeadImg.onload = function() { draw(); }
snakeHeadImg.src = 'TeteSerpent.png';
let snakeBodyImg = new Image();
snakeBodyImg.src = 'CorpsSerpent.png';
let fruitImg = new Image();
fruitImg.src = 'PommeSnake.png';

document.addEventListener("keydown", direction);
function direction(event) {
    if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
    else if (event.keyCode == 38 && d != "DOWN") d = "UP";
    else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
    else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}

function collision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x == array[i].x && head.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < snake.length; i++) {
        let img = (i == 0) ? snakeHeadImg : snakeBodyImg;
        ctx.drawImage(img, snake[i].x, snake[i].y, box, box);
    }

    ctx.drawImage(fruitImg, food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (d == "LEFT") snakeX -= box;
    if (d == "UP") snakeY -= box;
    if (d == "RIGHT") snakeX += box;
    if (d == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
        document.getElementById('scoreVal').innerText = 'Score: ' + score;
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
        clearInterval(game);
        alert('Game Over. Score: ' + score);
        document.getElementById('restartButton').style.display = 'block';
    }

    snake.unshift(newHead);
}

let game = setInterval(draw, 100);

document.getElementById('restartButton').addEventListener('click', function() {
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    document.getElementById('scoreVal').innerText = 'Score: ' + score;
    d = undefined;
    food = { x: Math.floor(Math.random() * 19 + 1) * box, y: Math.floor(Math.random() * 19 + 1) * box };
    this.style.display = 'none';
    clearInterval(game);
    game = setInterval(draw, 100);
});