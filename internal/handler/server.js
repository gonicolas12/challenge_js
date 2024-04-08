const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 8080;

// Définition du répertoire statique pour servir les fichiers HTML, CSS, JS, etc.
app.use(express.static(path.join(__dirname, '../../web')));

// Routage pour servir l'index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../web/templates/index.html'));
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
