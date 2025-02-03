// je selection mes éléments nécessaires
const listButton = document.querySelector(".list-btn");
const profilButton = document.querySelector(".profil-btn");
const logoutButton = document.querySelector(".logout-btn");

// je crée un évenement au click qui me redirige vers une autre page
listButton.addEventListener("click", function () {
  window.location.href = "../../pages/administration/liste-formations.html";
});

profilButton.addEventListener("click", function () {
  window.location.href = "../../pages/administration/mon-profil-admin.html";
});

logoutButton.addEventListener("click", function () {
  // Envoi de la requête POST à l'API Symfony pour la déconnexion
  
  fetch("/logout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Déconnexion réussie") {
        // Effacer le token dans localStorage
        localStorage.removeItem("token");
        // Rediriger vers la page de connexion
        window.location.href = "../../index.html";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la déconnexion:", error);
    });
});

let myRequest=`/api/utilisateurs`

fetch(myRequest)
    .then(response => response.json())
    .then(data => showResult(data))
    .catch(error => console.log(error));

const showResult = (data) => {
    console.log(data);

    let stagiaireContainer = document.querySelector('.stagiaire'); // Sélectionne le conteneur principal

    // Vider le contenu existant pour éviter les doublons
    stagiaireContainer.innerHTML = '';

    // Parcours des données et création d'éléments pour chaque stagiaire
    data.forEach(element => {
        // Créer un nouvel élément <p> pour chaque stagiaire
        let stagiaireElement = document.querySelector('.stagiaire p');
        stagiaireElement.innerHTML = `${element.nom} ${element.prenom}`;

        // Ajouter l'élément au conteneur
        stagiaireContainer.appendChild(stagiaireElement);
    });
};