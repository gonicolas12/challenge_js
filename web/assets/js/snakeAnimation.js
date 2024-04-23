document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snakeColor = '#FFD700'; // couleur jaune rétro
    const segmentSize = 15; // taille de chaque segment
    const updateInterval = 70; // intervalle de mise à jour

    class Snake {
        constructor() {
            this.segments = [{x: Math.random() * canvas.width, y: Math.random() * canvas.height}];
            this.direction = Math.floor(Math.random() * 4); // 0: haut, 1: droite, 2: bas, 3: gauche
            this.previousDirection = this.direction;
            this.minLength = 7; // longueur minimale du serpent
            this.length = Math.floor(Math.random() * 5) + this.minLength; // longueur aléatoire
        }

        move() {
            let head = this.segments[0];
            let newHead = { x: head.x, y: head.y };

            // changement de direction aléatoire avec restriction
            if (Math.random() < 0.1) {
                let potentialDirections = [0, 1, 2, 3].filter(d => !this.isOppositeDirection(d, this.direction));
                this.direction = potentialDirections[Math.floor(Math.random() * potentialDirections.length)];
            }

            switch (this.direction) {
                case 0: newHead.y -= segmentSize; break; // haut
                case 1: newHead.x += segmentSize; break; // droite
                case 2: newHead.y += segmentSize; break; // bas
                case 3: newHead.x -= segmentSize; break; // gauche
            }

            // vérifie les bords pour ajuster la direction si il y a besoins
            if (this.reachesEdge(newHead)) {
                this.adjustDirectionAtEdge(newHead);
            }

            this.segments.unshift(newHead);
            while (this.segments.length > this.length) {
                this.segments.pop();
            }
        }

        draw() {
            ctx.fillStyle = snakeColor;
            this.segments.forEach(segment => {
                ctx.fillRect(segment.x, segment.y, segmentSize, segmentSize);
            });
        }

        // vérifie si la tête du serpent atteint un bord
        reachesEdge(head) {
            return head.x < segmentSize || head.x >= canvas.width - segmentSize ||
                   head.y < segmentSize || head.y >= canvas.height - segmentSize;
        }

        // ajuste la direction si le serpent atteint un bord
        adjustDirectionAtEdge(head) {
            let validDirections = [0, 1, 2, 3].filter(d => !this.isOppositeDirection(d, this.direction) && this.isWithinBounds(d, head));
            if (validDirections.length > 0) {
                this.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
            }
        }

        // vérifie si la nouvelle direction est opposée à la direction actuelle
        isOppositeDirection(newDirection, currentDirection) {
            return (newDirection === 0 && currentDirection === 2) ||
                   (newDirection === 1 && currentDirection === 3) ||
                   (newDirection === 2 && currentDirection === 0) ||
                   (newDirection === 3 && currentDirection === 1);
        }

        // vérifie si la nouvelle direction est dans les limites du canvas
        isWithinBounds(direction, head) {
            switch (direction) {
                case 0: return head.y >= segmentSize;
                case 1: return head.x < canvas.width - segmentSize;
                case 2: return head.y < canvas.height - segmentSize;
                case 3: return head.x >= segmentSize;
                default: return true;
            }
        }
    }

    // crée 5 serpents
    let snakes = [];
    for (let i = 0; i < 5; i++) {
        snakes.push(new Snake());
    }

    // anime les serpents
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snakes.forEach(snake => {
            snake.move();
            snake.draw();
        });
        setTimeout(animate, updateInterval); // setTimeout pour contrôler la vitesse
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
