document.addEventListener('DOMContentLoaded', function () {
    const words = [
        "exemple", "frappe", "rapidement", "possible", "ordinateur", "vitesse", "précision", "texte",
        "mesure", "performance", "utilisateur", "développement", "application", "navigation", "technologie",
        "internet", "programmation", "jeu", "clavier", "monde", "informatique", "souris", "touche",
        "affichage", "graphique", "image", "vidéo", "audio", "multimédia", "interaction", "utilisation",
        "lettre", "chiffre", "caractère", "espace", "retour", "ligne", "paragraphe", "mot", "phrase",
        "expression", "langage", "français", "anglais", "espagnol", "allemand", "italien", "portugais", "toulouse",
        "grammaire", "orthographe", "conjugaison", "vocabulaire", "dictionnaire", "traduction", "synonyme", "antonyme",
    ];
 
    const inputArea = document.getElementById('type-input');
    const timerElement = document.getElementById('timer');
    const wpmElement = document.getElementById('words-per-minute');
    const accuracyElement = document.getElementById('accuracy');
    const resetButton = document.getElementById('reset-button');
    const sourceTextElement = document.getElementById('source-text');
 
    let startTime = null;
    let timerRunning = false;
    let lastCorrectIndex = -1;
    let gameEnded = false;
 
    function generateText() {
        let generatedText = [];
        while (generatedText.length < 130) {
            let word = words[Math.floor(Math.random() * words.length)];
            generatedText.push(word);
        }
        let textWithPunctuation = generatedText.join(" ").charAt(0).toUpperCase() + generatedText.join(" ").slice(1);
        sourceTextElement.innerText = textWithPunctuation;
    }
    generateText();
    inputArea.focus();
 
    document.addEventListener('input', handleTyping);
 
    document.addEventListener('click', function () {
        // positionne le curseur à la fin du texte actuellement tapé
        inputArea.focus();
        let textLength = inputArea.value.length;
        inputArea.setSelectionRange(textLength, textLength);
    });
 
    document.addEventListener('keydown', function (event) {
        const forbiddenKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
        if (forbiddenKeys.includes(event.key) || event.ctrlKey) {
            event.preventDefault(); // empêche l'action par défaut de ces touches
            console.log("Les touches de mouvement et de suppression sont désactivées pendant le test.");
        }
    });
 
    function handleTyping() {
        if (gameEnded) return;
 
        if (!timerRunning) {
            startTime = new Date();
            timerRunning = true;
            updateTimer();
        }
        updateDisplayedText();
    }
 
    function updateDisplayedText() {
        let typedText = inputArea.value;
        let sourceText = sourceTextElement.innerText;
        let highlightedText = '';
        let correctSoFar = true;
 
        for (let i = 0; i < sourceText.length; i++) {
            if (i < typedText.length) {
                if (typedText[i] === sourceText[i]) {
                    highlightedText += `<span class="correct">${sourceText[i]}</span>`;
                } else {
                    if (sourceText[i] === ' ') { // gestion spécifique des espaces
                        highlightedText += `<span class="space-error"> </span>`; // espace avec erreur
                    } else {
                        highlightedText += `<span class="error">${sourceText[i]}</span>`;
                    }
                    correctSoFar = false;
                }
            } else {
                highlightedText += sourceText[i];
            }
        }
 
        sourceTextElement.innerHTML = highlightedText;
        if (!correctSoFar) {
            inputArea.value = typedText.substr(0, lastCorrectIndex + 1);
        } else {
            lastCorrectIndex = typedText.length - 1;
        }
 
        let accuracy = Math.round((lastCorrectIndex + 1) / sourceText.length * 100);
        accuracyElement.innerText = `Précision : ${accuracy}%`;
    }
 
    function updateTimer() {
        if (!timerRunning) return;
 
        let currentTime = new Date();
        let timeElapsed = Math.floor((currentTime - startTime) / 1000);
        let timeRemaining = 60 - timeElapsed;
 
        if (timeRemaining > 0) {
            timerElement.innerText = `00:${timeRemaining >= 10 ? timeRemaining : '0' + timeRemaining}`;
            setTimeout(updateTimer, 1000);
        } else {
            timerElement.innerText = 'Terminé !';
            endTest();
            inputArea.style.filter = 'blur(2px)';
            inputArea.setAttribute('readonly', 'readonly');
        }
    }
 
    function endTest() {
        timerRunning = false;
        gameEnded = true;
        inputArea.setAttribute('readonly', 'true');
        inputArea.style.filter = 'blur(4px)';
 
        resetButton.style.display = 'block';
        resetButton.style.position = 'absolute';
        resetButton.style.left = '50%';
        resetButton.style.bottom = '20px';
        resetButton.style.transform = 'translateX(-50%)';
 
        let timeSpent = (new Date() - startTime) / 1000;
        let wordCount = inputArea.value.trim().split(/\s+/).length;
        let wpm = Math.round((wordCount / timeSpent) * 60);
        wpmElement.innerText = `Mots par minute : ${wpm}`;
    }
 
    function resetTest() {
        inputArea.removeAttribute('readonly');
        inputArea.style.filter = 'none';
        inputArea.value = '';
        timerElement.innerText = '00:60';
        wpmElement.innerText = 'Mots par minute : 0';
        accuracyElement.innerText = 'Précision : 100%';
        timerRunning = false;
        gameEnded = false;
        lastCorrectIndex = -1;
        generateText();
        resetButton.style.display = 'none';
    }
    resetButton.addEventListener('click', resetTest);
});