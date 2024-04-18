let initialArray = []; // Variable globale pour stocker le tableau initial

function generateRandomArray(numElements = 20) {
    const arr = [];
    // génère un tableau de numElements éléments avec des valeurs aléatoires entre 5 et 100
    for (let i = 0; i < numElements; i++) {
        arr.push(Math.floor(Math.random() * (100 - 5 + 1)) + 5);
    }
    return arr;
}

function drawArray(arr) {
    const container = document.getElementById('array-container');
    container.innerHTML = ''; // efface le contenu actuel du conteneur
    arr.forEach(value => {
        const bar = document.createElement('div');
        bar.style.height = `${value * 3}px`;
        bar.classList.add('bar');
        bar.textContent = value;
        container.appendChild(bar);
    });
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function bubbleSort(arr) {
    let n = arr.length;
    let btn = document.getElementById('menuButton');
    let newBtn = document.getElementById('newSortButton');
    let status = document.getElementById('status');
    status.textContent = "";
    btn.disabled = true;

    for (let i = 0; i < n-1; i++) {
        for (let j = 0; j < n-i-1; j++) {
            // comparaison de deux éléments
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                drawArray(arr);
                await sleep(300);
            }
        }
    }
    status.textContent = "Tri terminé !";
    btn.style.display = "none";
    newBtn.style.display = "inline";
    btn.disabled = false;
}

function startSorting() {
    drawArray(initialArray);
    bubbleSort(initialArray);
}

function startNewSort() {
    initialArray = generateRandomArray();
    drawArray(initialArray);
    document.getElementById('menuButton').style.display = "inline"; // affiche le bouton de tri
    document.getElementById('newSortButton').style.display = "none"; // cache le bouton de nouveau tri
    document.getElementById('status').textContent = ""; // efface le message de statut
}

window.onload = () => {
    initialArray = generateRandomArray();
    drawArray(initialArray);
}
