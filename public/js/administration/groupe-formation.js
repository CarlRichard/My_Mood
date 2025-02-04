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
// Fonction pour récupérer les paramètres GET de l'URL
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

// Récupérer l'ID de la cohorte depuis l'URL et le convertir en nombre
const cohortId = parseInt(getQueryParam("id"), 10);

// Sélectionner le <h2> et y afficher l'ID de la cohorte
let myH2 = document.querySelector('h2');
if (!isNaN(cohortId)) {
  myH2.innerHTML = `Cohorte ID : ${cohortId}`;
} else {
  myH2.innerHTML = "Aucune cohorte sélectionnée";
}

// Requête pour récupérer les utilisateurs
let myRequest = `/api/utilisateurs`;

fetch(myRequest)
  .then(response => response.json())
  .then(data => {
    console.log("Utilisateurs récupérés :", data); // Vérification dans la console
    showResult(data, cohortId);
  })
  .catch(error => console.log(error));

const showResult = (data, cohortId) => {
  const container = document.querySelector('.container-mood-stagiaire');
  container.innerHTML = ''; // Vider le conteneur avant d'afficher

  // Sélectionner le slider et la span où afficher la moyenne
  const averageSpan = document.querySelector('.average-slider + span');
  const slider = document.querySelector('.slider');

  // 🔍 Filtrer les utilisateurs par l'ID de la cohorte
  const filteredUsers = data.filter(user =>
    user.groupes && user.groupes.some(group => {
      console.log(`Utilisateur: ${user.nom} ${user.prenom}, Cohortes:`, user.groupes);
      return group.id === cohortId;
    })
  );

  console.log("Utilisateurs filtrés :", filteredUsers); // Vérification après filtrage

  let totalMood = 0;
  let moodCount = 0;

  // Boucle sur les utilisateurs filtrés
  filteredUsers.forEach(element => {
    const moodStagiaireDiv = document.createElement('div');
    moodStagiaireDiv.classList.add('mood-stagiaire');

    const stagiaireDiv = document.createElement('div');
    stagiaireDiv.classList.add('stagiaire');

    const nameP = document.createElement('p');
    nameP.innerHTML = `${element.nom} ${element.prenom}`;

    const humeurSpan = document.createElement('span');
    if (element.historiques && element.historiques.length > 0) {
      let humeur = parseInt(element.historiques[0].humeur, 10); // Convertir en nombre
      if (!isNaN(humeur)) {
        totalMood += humeur;
        moodCount++;
      }
      humeurSpan.innerHTML = `${humeur}`;
    }

    // Assembler les éléments
    stagiaireDiv.appendChild(nameP);
    stagiaireDiv.appendChild(humeurSpan);
    moodStagiaireDiv.appendChild(stagiaireDiv);
    container.appendChild(moodStagiaireDiv);
  });

  // Calcul de la moyenne des humeurs
  let averageMood = moodCount > 0 ? Math.round(totalMood / moodCount) : 0;

  // Mettre à jour l'affichage de la moyenne
  averageSpan.innerHTML = `${averageMood}`;
  slider.value = averageMood;
};
