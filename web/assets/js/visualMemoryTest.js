const levelCounter = document.getElementById('levelCounter');
const startButton = document.getElementById('startButton');
const menuButton = document.getElementById('menuButton');
const messageDisplay = document.getElementById('message');
const grid = document.getElementById('grid');
const modeSelection = document.getElementById('modeSelection');
const timeReductionPerLevel = 200;
const baseDisplayTime = 2000;
let displayTime = 2000;
let currentLevel = 1;
let correctSquares = [];
let guessing = false;
let gameMode = 'classique';
let gridSize = 4;
let attempts = 0;

document.addEventListener('DOMContentLoaded', () => {
    levelCounter.style.display = 'none';
    document.querySelectorAll('input[name="mode"]').forEach((radio) => { // sélectionne tous les boutons radio avec le nom "mode"
      radio.addEventListener('change', function() {
        gameMode = this.value;
      });
    });
});  

function updateLevelDisplay() {
  levelCounter.textContent = `Niveau: ${currentLevel}`;
}

function createGrid(size) {
  grid.innerHTML = '';
  grid.style.gridTemplateColumns = `repeat(${size}, 50px)`; // crée une grille de taille size x size
  // crée size x size carrés
  for (let i = 0; i < size * size; i++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.addEventListener('click', function() {
      if (guessing) {
        checkSquare(this, i);
      }
    });
    grid.appendChild(square);
  }
}

function randomizeSquares(numberOfSquares) {
  correctSquares = [];
  // sélectionne numberOfSquares carrés aléatoires
  for (let i = 0; i < numberOfSquares; i++) {
    let index;
    do {
      index = Math.floor(Math.random() * grid.children.length);
    } while (correctSquares.includes(index));
    correctSquares.push(index);
    grid.children[index].classList.add('on');
  }
}

function checkSquare(square, index) {
  if (correctSquares.includes(index)) {
      square.style.backgroundColor = '#FFD700'; // Applique la couleur jaune quand correct
      square.classList.add('validated'); // Optionnel: ajouter une classe pour gérer via CSS
      correctSquares = correctSquares.filter(item => item !== index);
      if (correctSquares.length === 0) {
          showSuccess();
      }
  } else {
      square.style.backgroundColor = 'red'; // Laisse rouge si incorrect
      showFailure();
  }
}

function showSuccess() {
    grid.style.display = 'none';
    levelCounter.style.display = 'none';
    messageDisplay.innerHTML = '<span class="message">Passage au niveau suivant...</span>';
    startButton.style.display = 'none';
    setTimeout(() => {
      messageDisplay.innerHTML = '';
      grid.style.display = 'grid';
      levelCounter.style.display = 'block';
      currentLevel++;
      displayTime -= timeReductionPerLevel;
      updateLevelDisplay();
      startTest();
    }, 2000);
}

function showFailure() {
    guessing = false;
    document.getElementById('message').innerHTML = '<span class="message">Perdu !</span>';
    // affiche les carrés corrects en vert
    for (let i = 0; i < grid.children.length; i++) {
      if (correctSquares.includes(i)) {
        grid.children[i].style.backgroundColor = 'green';
        grid.children[i].classList.add('on');
      }
    }

    startButton.style.display = 'block';
    startButton.innerText = 'Recommencer';
    menuButton.style.display = 'block';
}

function startTest() {
  grid.innerHTML = '';
  grid.style.display = 'grid';
  levelCounter.style.display = 'block';

  if (gameMode === 'exponentiel') {
    // augmente la taille de la grille tous les deux niveaux
    if (attempts > 0 && attempts % 2 === 0 && gridSize < 8) {
      gridSize++;
    }
  } else {
    // reinitialise gridSize pour le mode classique à chaque démarrage du test
    gridSize = 4;
  }

  createGrid(gridSize);
  randomizeSquares(5);
  guessing = false;
  document.getElementById('message').innerHTML = '';
  startButton.style.display = 'none';
  menuButton.style.display = 'none';
  attempts++;
  setTimeout(() => {
    for (let square of grid.children) {
      square.classList.remove('on');
    }
    guessing = true;
  }, displayTime);
  updateLevelDisplay();
}


function hideMenu() {
  modeSelection.style.display = 'none';
}

startButton.addEventListener('click', function() {
  currentLevel = 1;
  displayTime = baseDisplayTime;
  gridSize = 4; 
  attempts = 0; // reinitialise le nombre de tentatives pour le mode exponentiel
  updateLevelDisplay();
  hideMenu();
  menuButton.style.display = 'block';
  startTest();
});

menuButton.addEventListener('click', () => {
    grid.style.display = 'none';
    levelCounter.style.display = 'none';
    messageDisplay.innerHTML = '';
    startButton.style.display = 'block';
    startButton.innerText = 'Commencer le test';
    menuButton.style.display = 'none';
    modeSelection.style.display = 'block';
});

document.getElementById('startButton').addEventListener('click', function() {
  startTest();
});
