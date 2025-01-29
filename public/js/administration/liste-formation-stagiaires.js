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

// Ajouter un événement au clic du bouton "Ajouter formation"
formationButtonAdd.addEventListener("click", function () {
  const userInput = formationInputText.value; // Récupérer la valeur de l'input

  // Vérifier si l'input est vide
  if (!userInput.trim()) {
    alert("Le nom de la formation est requis !"); // Alerte si vide
    return; // Arrêter l'exécution si vide
  }

  // Récupérer la date actuelle pour le champ 'dateFin'
  const currentDate = new Date().toISOString(); // Formater la date au format ISO

  // Envoi de la valeur de l'input à la base de données via fetch
  fetch("/api/cohortes", { // Remplace par l'URL de ton API
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      nom: userInput,    // Nom de la formation
      dateFin: currentDate  // Date de fin actuelle
    }),
  })
    .then((response) => response.json()) // Assure-toi que l'API renvoie du JSON
    .then((data) => {
      console.log("Réponse après POST :", data);  // Log de la réponse de l'API
      if (data.utilisateurs && data.utilisateurs.length === 0) {
        console.log("Formation ajoutée avec succès !");
        
        // Appeler la fonction pour récupérer et afficher toutes les formations
        fetchFormations();
        
        // Vider l'input après ajout
        formationInputText.value = "";
      } else {
        alert("Une erreur est survenue lors de l'ajout de la formation.");
      }
    })
    .catch((error) => {
      console.error("Erreur:", error);
      alert("Une erreur est survenue, veuillez réessayer.");
    });
});

// Fonction pour récupérer et afficher toutes les formations
function fetchFormations() {
  // Récupérer le token de l'utilisateur depuis le localStorage
  let tokenUser = localStorage.getItem("tokenUser");

  // Vérifier si le token existe dans le localStorage
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    fetch("/api/cohortes", { // Remplace par l'URL de ton API pour récupérer les formations
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Spécifier que les données envoyées sont au format JSON
        "Authorization": `Bearer ${tokenUser}`, // Ajouter le token dans l'en-tête pour authentification
      },
    })
      .then((response) => response.json()) // Assure-toi que l'API renvoie du JSON
      .then((data) => {
        console.log("Réponse après GET :", data);  // Log de la réponse de l'API
        if (data.formations && data.formations.length > 0) {
          const formationsList = document.querySelector(".container_formations_label_input");

          // Vider la liste avant de la remplir à nouveau
          formationsList.innerHTML = "";

          // Parcourir toutes les formations récupérées et les afficher
          data.formations.forEach((formation) => {
            // Créer une div pour contenir le label et le checkbox
            const containerLabelInputFormation = document.createElement("div");
            containerLabelInputFormation.classList.add("container_label_input_formation");

            // Créer un label pour afficher le nom de la formation
            const labelFormation = document.createElement("label");
            labelFormation.classList.add("formation_label");
            labelFormation.textContent = `${formation.nom}`;

            // Créer un input checkbox avec un ID unique
            const inputFormation = document.createElement("input");
            inputFormation.classList.add("formation_input");
            inputFormation.type = "checkbox";
            const uniqueId = `formation-${Date.now()}`; // Générer un ID unique basé sur le timestamp
            inputFormation.id = uniqueId;
            inputFormation.name = "scales";

            // Ajouter le label et le checkbox à la div
            containerLabelInputFormation.appendChild(labelFormation);
            containerLabelInputFormation.appendChild(inputFormation);

            // Ajouter la nouvelle div à la liste des formations
            formationsList.appendChild(containerLabelInputFormation);
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



// Ajouter un événement au clic du bouton "Supprimer formation"
formationButtonDelete.addEventListener("click", function () {
  // Sélectionner la div contenant la confirmation (on la montre) et cacher la div à supprimer
  const formationDiv = document.querySelector(".container_formations");
  const confirmationDiv = document.querySelector(
    ".container_liste_formation_stagiaires_vali_annul"
  );

  formationDiv.style.display = "none"; // Cache la div à supprimer
  confirmationDiv.style.display = "block"; // Affiche la div de confirmation

  // Si l'utilisateur confirme la suppression
  const buttonConfirm = confirmationDiv.querySelector("button:first-of-type");
  buttonConfirm.addEventListener("click", function () {
    // Sélectionner toutes les divs contenant un checkbox dans les deux classes
    const allFormationDivs = document.querySelectorAll(
      ".container_label_input_formation, .container_modal_stagiaires_label_input"
    );

    // Parcourir chaque div pour vérifier si le checkbox est sélectionné
    allFormationDivs.forEach(function (div) {
      const checkbox = div.querySelector("input[type='checkbox']");

      // Si le checkbox est coché, supprimer la div dans toutes les divs
      if (checkbox && checkbox.checked) {
        const uniqueId = checkbox.id; // Récupérer l'ID de l'input checkbox

        // Sélectionner toutes les divs contenant le même ID et les supprimer
        document
          .querySelectorAll(`#${uniqueId}`)
          .forEach(function (divToRemove) {
            divToRemove.closest(".container_label_input_formation").remove();
          });
      }
    });

    // Réafficher la div d'origine
    formationDiv.style.display = "block";
    confirmationDiv.style.display = "none"; // Cacher la div de confirmation
  });

  // Si l'utilisateur annule la suppression
  const buttonCancel = confirmationDiv.querySelector("button:last-of-type");
  buttonCancel.addEventListener("click", function () {
    // Réafficher la div d'origine
    formationDiv.style.display = "block";
    confirmationDiv.style.display = "none"; // Cacher la div de confirmation
  });
});

// Ajouter un événement au clic du bouton "Ajouter stagiaire"
formationButtonAddIntern.addEventListener("click", function () {
  // Récupérer les valeurs des champs "prénom", "nom" et "email"
  const userFormationInputFirstName = formationInputFirstName.value;
  const userFormationInputName = formationInputName.value;
  const userFormationInputEmail = formationInputEmail.value;

  // Vérifier si le prénom est rempli
  if (!userFormationInputFirstName) {
    alert("Le prénom est requis !"); // Afficher un message si vide
    return; // Arrêter la fonction si le prénom est manquant
  }

  // Vérifier si le nom est rempli
  if (!userFormationInputName) {
    alert("Le nom est requis !"); // Afficher un message si vide
    return; // Arrêter la fonction si le nom est manquant
  }

  // Vérifier si l'email est rempli
  if (!userFormationInputEmail) {
    alert("L'email est requis !"); // Afficher un message si vide
    return; // Arrêter la fonction si l'email est manquant
  }

  // Si tous les champs sont remplis, afficher les valeurs dans la console
  console.log(
    userFormationInputFirstName,
    userFormationInputName,
    userFormationInputEmail
  );
});
