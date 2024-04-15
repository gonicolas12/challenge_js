let musicOn = false;
const musicPlayer = document.getElementById('backgroundMusic');

document.addEventListener('DOMContentLoaded', function() {
    musicPlayer.pause();
    document.getElementById('musicButton').classList.add('off');
});

document.getElementById('musicButton').addEventListener('click', function() {
    musicOn = !musicOn;
    if (musicOn) {
        document.getElementById('musicButton').classList.remove('off');
        musicPlayer.play();
    } else {
        document.getElementById('musicButton').classList.add('off');
        musicPlayer.pause();
    }
});
