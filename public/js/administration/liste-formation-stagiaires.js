// Sélectionner les éléments nécessaires dans le DOM
const formationInputText = document.querySelector("#text");
const formationButtonAdd = document.querySelector(".button_add");
const formationButtonDelete = document.querySelector(".button_formation");
const confirmationDiv = document.querySelector(
  ".container_liste_formation_stagiaires_vali_annul"
);
const formationDiv = document.querySelector(".container_formations");
const formationInputFirstName = document.querySelector("#first-name");
const formationInputName = document.querySelector("#name");
const formationInputEmail = document.querySelector("#email");
const formationButtonAddIntern = document.querySelector(
  "#stagiaire_button_add"
);
const formationDivLabelInput = document.querySelector(
  ".container_label_input_formation"
);

// Fonction pour récupérer et afficher toutes les formations
function fetchFormations() {
  // Récupérer le token de l'utilisateur depuis le localStorage
  let tokenUser = localStorage.getItem("tokenUser");

  // Vérifier si un token est disponible dans le localStorage
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Faire une requête GET vers l'API pour récupérer les formations
    fetch("/api/cohortes", {
      method: "GET", // Méthode HTTP GET
      headers: {
        "Content-Type": "application/json", // Définir le type de contenu en JSON
        Authorization: `Bearer ${tokenUser}`, // Ajouter le token d'authentification dans l'en-tête
      },
    })
      .then((response) => response.json()) // Convertir la réponse en JSON
      .then((data) => {
        console.log("Réponse après GET :", data); // Afficher la réponse de l'API dans la console
        
        // Si la réponse est un tableau directement contenant les formations
        if (Array.isArray(data) && data.length > 0) {
          // Sélectionner tous les éléments HTML où les formations seront affichées
          const formationsLists = document.querySelectorAll(".container_formations_label_input");

          // Parcourir chaque élément où les formations seront affichées
          formationsLists.forEach((formationsList) => {
            // Vider la liste des formations avant de la remplir
            formationsList.innerHTML = "";

            // Parcourir chaque formation et créer les éléments correspondants
            data.forEach((formation) => {
              // Créer un conteneur pour chaque formation
              const containerLabelInputFormation = document.createElement("div");
              containerLabelInputFormation.classList.add("container_label_input_formation");

              // Créer un label pour afficher le nom de la formation
              const labelFormation = document.createElement("label");
              labelFormation.classList.add("formation_label");
              labelFormation.textContent = formation.nom;

              // Créer un champ de type checkbox pour chaque formation
              const inputFormation = document.createElement("input");
              inputFormation.classList.add("formation_input");
              inputFormation.type = "checkbox";
              const uniqueId = `formation-${Date.now()}`; // Générer un ID unique basé sur le timestamp
              inputFormation.id = uniqueId;
              inputFormation.name = "scales";

              // Ajouter le label et le checkbox dans le conteneur de formation
              containerLabelInputFormation.appendChild(labelFormation);
              containerLabelInputFormation.appendChild(inputFormation);

              // Ajouter ce conteneur à la liste des formations
              formationsList.appendChild(containerLabelInputFormation);
            });
          });
        } else { 
          console.log("Aucune formation à afficher.");
        }
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des formations:", error);
      });
  } else {
    console.log("Aucun token trouvé. Impossible de récupérer les formations.");
  }
}
// Appeler la fonction pour récupérer et afficher toutes les formations
fetchFormations();


// Ajouter un événement au clic du bouton "Ajouter formation"
formationButtonAdd.addEventListener("click", function () {
  // Récupérer la valeur de l'input pour le nom de la formation
  const userInput = formationInputText.value;

  // Vérifier si l'input est vide
  if (!userInput.trim()) {
    alert("Le nom de la formation est requis !"); // Afficher une alerte si l'input est vide
    return; // Interrompre l'exécution si l'input est vide
  }

  // Récupérer la date actuelle au format ISO pour le champ 'dateFin'
  const currentDate = new Date().toISOString();

  // Faire une requête POST pour envoyer les données à l'API
  fetch("/api/cohortes", {
    // Remplacer par l'URL de l'API
    method: "POST", // Méthode HTTP POST pour l'ajout de la formation
    headers: {
      "Content-Type": "application/json", // Spécifier que le corps de la requête est en JSON
    },
    body: JSON.stringify({
      nom: userInput, // Nom de la formation récupéré depuis l'input
      dateFin: currentDate, // Date de fin de la formation (date actuelle)
    }),
  })
    .then((response) => response.json()) // Convertir la réponse de l'API en JSON
    .then((data) => {
      console.log("Réponse après POST :", data); // Afficher la réponse de l'API dans la console

      // Vérifier si l'ajout de la formation a réussi
      if (data.utilisateurs && data.utilisateurs.length === 0) {
        console.log("Formation ajoutée avec succès !");

        // Appeler la fonction pour récupérer et afficher toutes les formations, y compris celle nouvellement ajoutée
        fetchFormations();

        // Vider l'input après l'ajout de la formation
        formationInputText.value = "";
      } else {
        alert("Une erreur est survenue lors de l'ajout de la formation.");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error); // Log de l'erreur dans la console
      alert("Une erreur est survenue, veuillez réessayer."); // Afficher une alerte en cas d'erreur
    });
});


// Ajouter un événement au clic du bouton "Supprimer formation"
formationButtonDelete.addEventListener("click", function () {
  // Sélectionner la div qui contient les formations et celle qui contient la confirmation de suppression
  const formationDiv = document.querySelector(".container_formations");
  const confirmationDiv = document.querySelector(
    ".container_liste_formation_stagiaires_vali_annul"
  );

  // Masquer la div des formations et afficher la div de confirmation
  formationDiv.style.display = "none";
  confirmationDiv.style.display = "block";

  // Ajouter un événement au bouton de confirmation de suppression
  const buttonConfirm = confirmationDiv.querySelector("button:first-of-type");
  buttonConfirm.addEventListener("click", function () {
    // Sélectionner toutes les divs contenant un checkbox (les formations à supprimer)
    const allFormationDivs = document.querySelectorAll(
      ".container_label_input_formation, .container_modal_stagiaires_label_input"
    );

    // Parcourir chaque div pour vérifier si le checkbox est sélectionné
    allFormationDivs.forEach(function (div) {
      const checkbox = div.querySelector("input[type='checkbox']");

      // Si le checkbox est coché, supprimer la div correspondante
      if (checkbox && checkbox.checked) {
        const uniqueId = checkbox.id; // Récupérer l'ID unique du checkbox

        // Supprimer toutes les divs contenant ce même ID
        document
          .querySelectorAll(`#${uniqueId}`)
          .forEach(function (divToRemove) {
            divToRemove.closest(".container_label_input_formation").remove();
          });
      }
    });

    // Réafficher la div des formations et masquer la div de confirmation
    formationDiv.style.display = "block";
    confirmationDiv.style.display = "none";
  });

  // Ajouter un événement au bouton d'annulation de suppression
  const buttonCancel = confirmationDiv.querySelector("button:last-of-type");
  buttonCancel.addEventListener("click", function () {
    // Réafficher la div des formations et masquer la div de confirmation
    formationDiv.style.display = "block";
    confirmationDiv.style.display = "none";
  });
});

// Ajouter un événement au clic du bouton "Ajouter stagiaire"
formationButtonAddIntern.addEventListener("click", function () {
  // Récupérer les valeurs des champs "prénom", "nom" et "email"
  const userFormationInputFirstName = formationInputFirstName.value;
  const userFormationInputName = formationInputName.value;
  const userFormationInputEmail = formationInputEmail.value;

  // Vérifier si le prénom a été renseigné
  if (!userFormationInputFirstName) {
    alert("Le prénom est requis !"); // Afficher un message d'alerte si le prénom est vide
    return; // Arrêter l'exécution de la fonction si le prénom est manquant
  }

  // Vérifier si le nom a été renseigné
  if (!userFormationInputName) {
    alert("Le nom est requis !"); // Afficher un message d'alerte si le nom est vide
    return; // Arrêter l'exécution de la fonction si le nom est manquant
  }

  // Vérifier si l'email a été renseigné
  if (!userFormationInputEmail) {
    alert("L'email est requis !"); // Afficher un message d'alerte si l'email est vide
    return; // Arrêter l'exécution de la fonction si l'email est manquant
  }

  // Si tous les champs sont remplis, afficher les valeurs dans la console
  console.log(
    userFormationInputFirstName,
    userFormationInputName,
    userFormationInputEmail
  );
});
