const levelCounter = document.getElementById('levelCounter');
const startButton = document.getElementById('startButton');
const messageDisplay = document.getElementById('message');
const grid = document.getElementById('grid');
const timeReductionPerLevel = 200;
const baseDisplayTime = 2000;
let displayTime = 2000; // temp d'affichage initial des carrés
let currentLevel = 1; // suivi du niveau actuel de l'utilisateur
let correctSquares = [];
let guessing = false;

function updateLevelDisplay() {
  levelCounter.textContent = `Niveau: ${currentLevel}`; // met à jour l'affichage du niveau
}

document.addEventListener('DOMContentLoaded', () => {
    levelCounter.style.display = 'none'; // assure que le compteur de niveau est caché au chargement
});  

function createGrid(size) {
  grid.innerHTML = '';
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
    // vérifie si le carré a déjà été identifié comme correct pour ignorer les clics supplémentaires
    if (square.style.backgroundColor === 'green') {
      // si le carré a déjà été correctement identifié, ne fait rien
      return;
    }
  
    if (correctSquares.includes(index)) {
      square.style.backgroundColor = 'green';
      correctSquares = correctSquares.filter(item => item !== index);
      if (correctSquares.length === 0) {
        showSuccess();
      }
    } else {
      square.style.backgroundColor = 'red';
      showFailure();
    }
}  

function showSuccess() {
    grid.style.display = 'none';
    levelCounter.style.display = 'none'; // cache le compteur de niveau
    messageDisplay.innerHTML = '<span class="message">Passage au niveau suivant...</span>';
    startButton.style.display = 'none';
    setTimeout(() => {
      messageDisplay.innerHTML = '';
      grid.style.display = 'grid';
      levelCounter.style.display = 'block';
      currentLevel++;
      displayTime -= timeReductionPerLevel;
      updateLevelDisplay(); // met à jour l'affichage du niveau
      startTest();
    }, 2000); // attente avant de démarrer le prochain niveau
}

function showFailure() {
    guessing = false;
    document.getElementById('message').innerHTML = '<span class="message">Perdu !</span>';

    for (let i = 0; i < grid.children.length; i++) {
      if (correctSquares.includes(i)) {
        grid.children[i].style.backgroundColor = 'green';
        grid.children[i].classList.add('on');
      }
    }

    startButton.style.display = 'block';
    startButton.innerText = 'Recommencer';
    startButton.onclick = function() {
      document.getElementById('message').innerHTML = '';
      currentLevel = 1; // reinitialise le niveau
      displayTime = baseDisplayTime;
      updateLevelDisplay();
      startTest();
    };
}

function startTest() {
    grid.innerHTML = '';
    grid.style.display = 'grid';
    levelCounter.style.display = 'block';
    createGrid(4);
    randomizeSquares(5);
    guessing = false;
    document.getElementById('message').innerHTML = '';
    startButton.style.display = 'none';
    setTimeout(() => {
      for (let square of grid.children) {
        square.classList.remove('on');
      }
      guessing = true;
    }, Math.max(displayTime, 100));
    updateLevelDisplay();
}

startButton.addEventListener('click', () => {
    currentLevel = 1;
    displayTime = baseDisplayTime;
    updateLevelDisplay();
    levelCounter.style.display = 'block';
    startTest();
});