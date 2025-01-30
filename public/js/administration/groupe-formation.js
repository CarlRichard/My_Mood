// je selection mes éléments nécessaires
const listButton = document.querySelector ('.list-btn');
const profilButton = document.querySelector ('.profil-btn');
const logoutButton = document.querySelector ('.logout-btn');

// je crée un évenement au click qui me redirige vers une autre page
okButton.addEventListener("click", function () {
    window.location.href = "../../pages/administration/liste-formations.html"; 
});

profilButton.addEventListener("click", function () {
    window.location.href = "../../pages/administration/mon-profil-admin.html"; 
});

document.getElementById('.logout-btn').addEventListener("click", function() {
    localStorage.removeItem('tokenUser'); // Supprime le token
    window.location.href = '../../index.html'; // Redirige vers la page de connexion
});