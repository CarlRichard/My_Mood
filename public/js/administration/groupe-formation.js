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
  .then(response => response.json())  // On convertit la réponse de l'API en JSON
  .then(data => showResult(data))     // On passe les données à la fonction showResult pour les afficher
  .catch(error => console.log(error)); // Si une erreur survient, on l'affiche dans la console

const showResult = (data) => {
  console.log(data);  // On affiche les données dans la console pour vérifier ce qu'on a reçu

  // Mettre à jour le nom du groupe dans le <h2>
  let myH2 = document.querySelector('h2');  // On sélectionne le titre <h2> dans le HTML
  if (data[0] && data[0].groupes && data[0].groupes[0]) {  // On vérifie que les données du groupe existent
    myH2.innerHTML = `${data[0].groupes[0].nom}`;  // On affiche le nom du premier groupe dans le <h2>
  }

  // Sélectionner le conteneur où les stagiaires seront ajoutés
  const container = document.querySelector('.container-mood-stagiaire');
  container.innerHTML = ''; // On vide le conteneur pour éviter d'afficher des doublons à chaque chargement

  // Boucle pour chaque utilisateur
  data.forEach(element => {
    // Créer un nouveau div pour chaque stagiaire
    const moodStagiaireDiv = document.createElement('div');  // On crée un div pour l'humeur du stagiaire
    moodStagiaireDiv.classList.add('mood-stagiaire');  // On lui ajoute la classe 'mood-stagiaire'

    const stagiaireDiv = document.createElement('div');  // On crée un div pour les infos du stagiaire
    stagiaireDiv.classList.add('stagiaire');  // On lui ajoute la classe 'stagiaire'

    // Créer le paragraphe pour le nom et prénom
    const nameP = document.createElement('p');  // On crée un élément <p> pour afficher le nom et prénom
    nameP.innerHTML = `${element.nom} ${element.prenom}`;  // On insère le nom et prénom du stagiaire

    // Créer le span pour l'humeur
    const humeurSpan = document.createElement('span');  // On crée un élément <span> pour l'humeur
    if (element.historiques && element.historiques.length > 0) {  // Si des historiques d'humeur existent
      humeurSpan.innerHTML = `${element.historiques[0].humeur}`;  // On affiche la première humeur dans le span
    } 

    // Assembler les éléments
    stagiaireDiv.appendChild(nameP);  // On ajoute le <p> avec le nom au div stagiaire
    stagiaireDiv.appendChild(humeurSpan);  // On ajoute le <span> avec l'humeur au div stagiaire
    moodStagiaireDiv.appendChild(stagiaireDiv);  // On met le div stagiaire dans le div mood-stagiaire
    container.appendChild(moodStagiaireDiv);  // On ajoute le tout dans le conteneur principal sur la page
  });
};
