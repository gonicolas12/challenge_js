let canvas = document.getElementById('snakeGame');
let ctx = canvas.getContext('2d');
const box = 20;
let snake = [];
let score = 0;
let d;
let game;
let food;
let appleImg = new Image();
appleImg.src = '../assets/img/PommeSnake.png';
let snakeImg = new Image();
snakeImg.src = '../assets/img/TeteSerpent.png';
function createFood() {
  food = { x: Math.floor(Math.random() * (canvas.width / box - 1) + 1) * box, y: Math.floor(Math.random() * (canvas.height / box - 1) + 1) * box };
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function draw() {
  ctx.fillStyle = "#282c34";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < snake.length; i++) {
    ctx.drawImage(snakeImg, snake[i].x, snake[i].y, box, box);
  }

  ctx.drawImage(appleImg, food.x, food.y, box, box);

  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "LEFT") snakeX -= box;
  if (d == "UP") snakeY -= box;
  if (d == "RIGHT") snakeX += box;
  if (d == "DOWN") snakeY += box;

  if (snakeX == food.x && snakeY == food.y) {
    score++;
    createFood();
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  if (snakeX < 0 || snakeX >= canvas.width || snakeY < 0 || snakeY >= canvas.height || collision(newHead, snake)) {
    clearInterval(game);
    alert("Partie terminée. Score : " + score);
    return;
  }

  snake.unshift(newHead);

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, box, 1.6 * box);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('replayButton').addEventListener('click', () => {
    clearInterval(game);
    snake = [{ x: 9 * box, y: 10 * box }];
    score = 0;
    d = null;
    createFood();
    game = setInterval(draw, 100);
  });

  let imagesLoaded = 0;

  appleImg.onload = snakeImg.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 2) {
      createFood();
      game = setInterval(draw, 100);
    }
  };
});

document.addEventListener("keydown", direction);
function direction(event) {
  if (event.keyCode == 37 && d != "RIGHT") d = "LEFT";
  else if (event.keyCode == 38 && d != "DOWN") d = "UP";
  else if (event.keyCode == 39 && d != "LEFT") d = "RIGHT";
  else if (event.keyCode == 40 && d != "UP") d = "DOWN";
}
