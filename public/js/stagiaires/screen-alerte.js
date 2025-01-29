// je selection mes éléments nécessaires
const profilButton = document.querySelector ('.header_button');
const okButton = document.querySelector ('.notif_button');

// je crée un évenement au click qui me redirige vers une autre page
okButton.addEventListener("click", function () {
    window.location.href = "https://localhost/pages/stagiaires/mymood.html"; 
});

profilButton.addEventListener("click", function() {
    window.location.href ="https://localhost/pages/stagiaires/mon-profil.html";
})
