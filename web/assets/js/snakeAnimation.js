document.addEventListener('DOMContentLoaded', (event) => {
    const canvas = document.getElementById('snakeCanvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snakeColors = ['#347C2C', '#806517', '#8C7853']; // verts, marrons, et blanc

    class Snake {
        constructor() {
            this.segments = [{x: Math.random() * canvas.width, y: Math.random() * canvas.height}];
            this.dx = Math.random() * 2 - 1;
            this.dy = Math.random() * 2 - 1;
            this.speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy) * 2;
            this.minLength = 80; // longueur minimale du serpent
            this.length = Math.floor(Math.random() * 60) + this.minLength; // longueur aléatoire à partir de la longueur minimale
            this.color = snakeColors[Math.floor(Math.random() * snakeColors.length)];
            this.rotation = 0;
        }

        move() {
            let head = this.segments[0];
            let newHead = {
                x: head.x + this.dx,
                y: head.y + this.dy
            };

            if (Math.random() < 0.1) { 
                let angle = Math.atan2(this.dy, this.dx) + (Math.random() * Math.PI/2 - Math.PI/4);
                this.dx = this.speed * Math.cos(angle);
                this.dy = this.speed * Math.sin(angle);
            }

            if (newHead.x < 0 || newHead.x > canvas.width || newHead.y < 0 || newHead.y > canvas.height) {
                this.dx *= -1;
                this.dy *= -1;
            }

            this.segments.unshift(newHead);
            if (this.segments.length > this.length) {
                this.segments.pop();
            }
        }

        draw() {
            ctx.save(); // sauvegarde le contexte actuel
            ctx.translate(this.segments[0].x, this.segments[0].y);
            ctx.rotate(this.rotation + Math.PI);
            ctx.fillStyle = this.color;

            // dessin de la tête en forme de triangle avec des pointes arrondies
            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(10, 0);
            ctx.quadraticCurveTo(7, 15, 0, 20); // courbe pour la pointe supérieure
            ctx.quadraticCurveTo(-7, 15, -10, 0); // courbe pour la pointe inférieure
            ctx.closePath();
            ctx.fill();

            // dessin des yeux
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(-5, 10, 2, 0, Math.PI * 2); // oeil gauche
            ctx.fill();
            ctx.beginPath();
            ctx.arc(5, 10, 2, 0, Math.PI * 2); // oeil droit
            ctx.fill();
            ctx.restore(); // restaure le contexte précédent (sans rotation)

            // dessin du corps
            for (let i = 1; i < this.segments.length; i++) {
                let distance = Math.sqrt(Math.pow(this.segments[i].x - this.segments[i-1].x, 2) + Math.pow(this.segments[i].y - this.segments[i-1].y, 2));
                let thickness = 8 * Math.pow(1 - i / this.segments.length, 2);
                ctx.beginPath();
                ctx.moveTo(this.segments[i-1].x, this.segments[i-1].y);
                ctx.lineTo(this.segments[i].x, this.segments[i].y);
                ctx.strokeStyle = this.color;
                ctx.lineWidth = thickness;
                ctx.stroke();
            }
        }

    }

    let snakes = [];
    for (let i = 0; i < 5; i++) {
        snakes.push(new Snake());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        snakes.forEach(snake => {
            snake.move();
            snake.rotation = Math.atan2(snake.dy, snake.dx) + Math.PI / 2; // ceci met à jour l'angle de rotation en fonction de la direction du mouvement
            snake.draw();
        });
        requestAnimationFrame(animate);
    }
    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
