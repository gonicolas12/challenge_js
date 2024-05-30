document.addEventListener('DOMContentLoaded', function() {
    if (!localStorage.getItem('selectedMode')) {
        localStorage.setItem('selectedMode', 'computer');
    }
    const selectedMode = localStorage.getItem('selectedMode');
   
    // Sélectionner le bouton radio correspondant
    document.querySelectorAll('input[name="mode"]').forEach(input => {
        input.checked = (input.value === selectedMode);
    });
 
    document.querySelectorAll('input[name="mode"]').forEach(input => {
        input.addEventListener('change', function() {
            localStorage.setItem('selectedMode', this.value);
            console.log("Mode changé en: ", this.value);  // Pour déboguer
        });
    });
});
 
function startGame() {
    window.location.href = 'morpion.html';  // Redirection en JavaScript
}