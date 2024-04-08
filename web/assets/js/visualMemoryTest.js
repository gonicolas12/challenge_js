const grid = document.getElementById('grid');
const startButton = document.getElementById('startButton');
const messageDisplay = document.getElementById('message'); // Assurez-vous que cet élément existe dans votre HTML
let correctSquares = [];
let guessing = false;
let displayTime = 2000; // Temps d'affichage initial des carrés
const baseDisplayTime = 2000;
const timeReductionPerLevel = 200;
let currentLevel = 1; // Suivi du niveau actuel de l'utilisateur
const levelCounter = document.getElementById('levelCounter');

function updateLevelDisplay() {
  levelCounter.textContent = `Niveau: ${currentLevel}`; // Met à jour l'affichage du niveau
}

document.addEventListener('DOMContentLoaded', () => {
    levelCounter.style.display = 'none'; // Assure que le compteur de niveau est caché au chargement
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
    // Vérifie si le carré a déjà été identifié comme correct pour ignorer les clics supplémentaires
    if (square.style.backgroundColor === 'green') {
      // Le carré a déjà été correctement identifié, ne fait rien
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
    levelCounter.style.display = 'none'; // Cache le compteur de niveau
    messageDisplay.innerHTML = '<span class="message">Passage au niveau suivant...</span>';
    startButton.style.display = 'none';
    setTimeout(() => {
      messageDisplay.innerHTML = '';
      grid.style.display = 'grid';
      levelCounter.style.display = 'block'; // Réaffiche le compteur de niveau
      currentLevel++; // Incrémente le niveau
      displayTime -= timeReductionPerLevel;
      updateLevelDisplay(); // Met à jour l'affichage du niveau
      startTest();
    }, 2000); // Attente avant de démarrer le prochain niveau
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
      currentLevel = 1; // Réinitialise le niveau
      displayTime = baseDisplayTime;
      updateLevelDisplay(); // Réinitialise l'affichage du niveau
      startTest();
    };
}

function startTest() {
    grid.innerHTML = '';
    grid.style.display = 'grid';
    levelCounter.style.display = 'block'; // Assure que le compteur de niveau est visible au démarrage
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
    updateLevelDisplay(); // Assure que le niveau est correctement affiché au démarrage
}

startButton.addEventListener('click', () => {
    currentLevel = 1; // Réinitialise le niveau
    displayTime = baseDisplayTime; // Réinitialise le temps d'affichage
    updateLevelDisplay(); // Met à jour l'affichage du niveau
    levelCounter.style.display = 'block'; // Affiche le compteur de niveau lorsque le jeu commence
    startTest();
});