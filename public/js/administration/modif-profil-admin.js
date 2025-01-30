// je selection mes éléments nécessaires
const okButton = document.querySelector ('.modif_button');
const adminButton = document.querySelector ('.admin-btn');
const logoutButton = document.querySelector ('.logout-btn');

// je crée un évenement au click qui me redirige vers une autre page
okButton.addEventListener("click", function () {
    window.location.href = "../../pages/stagiaires/mymood.html"; 
});

adminButton.addEventListener("click", function () {
    window.location.href = ""; 
});

document.getElementById('.logout-btn').addEventListener("click", function() {
    localStorage.removeItem('tokenUser'); // Supprime le token
    window.location.href = '../../index.html'; // Redirige vers la page de connexion
});