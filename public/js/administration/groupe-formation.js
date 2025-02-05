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

// Sélectionner le <h2>
let myH2 = document.querySelector('h2');

if (!isNaN(cohortId)) {
  // Requête pour récupérer les détails de la cohorte
  fetch(`/api/cohortes/${cohortId}`)
    .then(response => response.json())
    .then(data => {
      if (data.nom) {
        myH2.innerHTML = `Cohorte : ${data.nom}`; // Afficher le nom de la cohorte
      } else {
        myH2.innerHTML = "Cohorte introuvable";
      }
    })
    .catch(error => {
      console.error("Erreur lors de la récupération de la cohorte :", error);
      myH2.innerHTML = "Erreur lors du chargement de la cohorte";
    });
} else {
  myH2.innerHTML = "Aucune cohorte sélectionnée";
}

// Requête pour récupérer les utilisateurs
let myRequest = `/api/utilisateurs`;

fetch(myRequest)
  .then(response => response.json())  // On récupère les données de l'API et on les convertit en JSON
  .then(data => {
    console.log("Utilisateurs récupérés :", data); // Vérification dans la console
    showResult(data, cohortId);
  })
  .catch(error => console.log(error));  // En cas d'erreur lors de la requête, afficher l'erreur dans la console

const showResult = (data, cohortId) => {
  const container = document.querySelector('.container-mood-stagiaire');
  container.innerHTML = ''; // Vider le conteneur avant d'afficher

  // Sélectionner le slider et la span où afficher la moyenne
  const averageSpan = document.querySelector('.average-slider + span');
  const slider = document.querySelector('.slider');

  // Filtrer les utilisateurs par l'ID de la cohorte
  const filteredUsers = data.filter(user =>
    user.groupes && user.groupes.some(group => {
      console.log(`Utilisateur: ${user.nom} ${user.prenom}, Cohortes:`, user.groupes);
      return group.id === cohortId;
    })
  );

  console.log("Utilisateurs filtrés :", filteredUsers); // Vérification après filtrage

  let totalMood = 0;
  let moodCount = 0;

  filteredUsers.forEach(element => {
    const moodStagiaireDiv = document.createElement('div');
    moodStagiaireDiv.classList.add('mood-stagiaire');
  
    const stagiaireDiv = document.createElement('div');
    stagiaireDiv.classList.add('stagiaire');
  
    const nameP = document.createElement('p');
    nameP.innerHTML = `${element.nom} ${element.prenom}`;
  
    const humeurSpan = document.createElement('span');
  
    let humeur = 0;
    if (element.historiques && element.historiques.length > 0) {
      humeur = parseInt(element.historiques[0].humeur, 10); 
      if (!isNaN(humeur)) {
        totalMood += humeur;
        moodCount++;
      }
    }
  
    humeurSpan.innerHTML = `${humeur}`;
    const moodClass = getMoodClass(humeur);
    humeurSpan.classList.add(moodClass);
  
    // Ajouter un fond rouge si alerte active
    if (element.alertes && element.alertes[0] && element.alertes[0].statut === "EN_COURS") {
      moodStagiaireDiv.classList.add('rouge');
    }
    
  
    // Assembler les éléments
    stagiaireDiv.appendChild(nameP);
    stagiaireDiv.appendChild(humeurSpan);
    moodStagiaireDiv.appendChild(stagiaireDiv);
    container.appendChild(moodStagiaireDiv);
  
    // Ajouter un événement de clic sur la div stagiaire
    stagiaireDiv.addEventListener('click', function() {
      // Vérifier si l'utilisateur a des alertes
      if (element.alertes && element.alertes.length > 0) {
        const lastAlerte = element.alertes[element.alertes.length - 1]; // Dernière alerte
        console.log('Dernière alerte de l\'utilisateur:', lastAlerte);
  
        // Appeler la fonction pour mettre à jour le statut de l'alerte
        const newStatut = lastAlerte.statut === 'RESOLUE' ? 'EN_COURS' : 'RESOLUE'; // Inverser le statut pour l'exemple
        updateAlerteStatut(lastAlerte.id, newStatut);
      } else {
        console.log('Aucune alerte trouvée pour cet utilisateur.');
      }
    });
  });
  

  // Calcul de la moyenne des humeurs
  let averageMood = moodCount > 0 ? Math.round(totalMood / moodCount) : 0;

  // Mettre à jour l'affichage de la moyenne
  averageSpan.innerHTML = `${averageMood}`;
  slider.value = averageMood;
};

const getMoodClass = (mood) => {
  // Vérifier si mood est 0, indéfini, ou nul
  if (mood === 0 || mood === undefined || mood === null) {
    return 'gris';  // Retourner gris si aucune humeur n'est disponible
  } else if (mood < 40) {
    return 'green';
  } else if (mood < 70) {
    return 'orange';
  } else if (mood < 80) {
    return 'red';
  }
};

// Récupérer le token de l'utilisateur depuis le localStorage
let tokenUser = localStorage.getItem("token");
let newStatut ="RESOLUE"

// Fonction pour mettre à jour le statut d'une alerte
function updateAlerteStatut(id, newStatut) {
  fetch(`https://localhost/api/alertes/${id}/statut`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/merge-patch+json',
      'Authorization': `Bearer ${tokenUser}`

    },
    body: JSON.stringify({
      statut: newStatut, // Le nouveau statut à appliquer
    }),
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      
      } else {
        throw new Error('Erreur lors de la mise à jour de l\'alerte');
      }
    })
    .then(data => {
      console.log('Statut mis à jour avec succès', data);
      moodStagiaireDiv.classList.remove('rouge'); 
    })
    .catch(error => {
      console.error('Erreur:', error);
    });
}


