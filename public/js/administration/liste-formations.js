
// Fonction pour récupérer et afficher toutes les formations
function fetchFormations() {
    // Récupérer le token de l'utilisateur depuis le localStorage
    let tokenUser = localStorage.getItem("token");

    // Vérifier si un token est disponible dans le localStorage
    if (!tokenUser) {
        console.error("Aucun token trouvé, redirection vers la connexion.");
        return;
    }

    console.log("Token récupéré :", tokenUser);

    // Faire une requête GET pour récupérer les formations
    fetch("/api/cohortes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${tokenUser}`,
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération des formations");
            }
            return response.json();
        })
        .then(data => {
            console.log("Formations récupérées :", data);
            displayFormations(data);
        })
        .catch(error => {
            console.error("Erreur :", error);
        });
}

function displayFormations(formations) {
    const cardContainer = document.querySelector('.card');
    cardContainer.innerHTML = ""; // Vider le contenu avant d'ajouter les nouvelles formations
  
    if (formations.length === 0) {
      cardContainer.innerHTML = "<p>Aucune formation disponible.</p>";
      return;
    }
  
    formations.forEach(formation => {
      // Création du bouton pour chaque formation
      const formationButton = document.createElement("a");
      formationButton.classList.add("formation-btn" , "link" , "card-link" , "btn");
      formationButton.innerText = formation.nom;
  
      // Ajout de l'événement pour rediriger au clic avec l'ID en paramètre GET
      formationButton.addEventListener("click", function () {
        window.location.href = `https://localhost/pages/administration/groupe-formation.html?id=${formation.id}`;
      });
  
      // Ajouter le bouton au conteneur
      cardContainer.appendChild(formationButton);
    });
  }
  

// Appeler la fonction au chargement de la page
document.addEventListener("DOMContentLoaded", fetchFormations);


const logoutButton = document.querySelector(".header-btn");
logoutButton.addEventListener("click", function () {
    localStorage.removeItem("token"); // Supprimer le token
    localStorage.removeItem("ID_User"); // Supprimer le token
    localStorage.removeItem("role"); // Supprimer le token
    window.location.href = "../../index.html"; // Rediriger vers la page de connexion
  });