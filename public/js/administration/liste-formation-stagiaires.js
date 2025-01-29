// Sélectionner les éléments nécessaires dans le DOM
const formationInputText = document.querySelector("#text");
const formationButtonAdd = document.querySelector(".button_add");
const formationButtonDelete = document.querySelector(".button_formation");

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

  // Créer une div pour contenir le label et le checkbox
  const containerLabelInputFormation = document.createElement("div");
  containerLabelInputFormation.classList.add("container_label_input_formation");

  // Créer un label pour afficher le nom de la formation
  const labelFormation = document.createElement("label");
  labelFormation.classList.add("formation_label");
  labelFormation.textContent = `${userInput}`;

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

  // Ajouter la nouvelle div à la liste des formations de la div principale
  const formationsList = document.querySelector(
    ".container_formations_label_input"
  );
  formationsList.appendChild(containerLabelInputFormation);

  // Ajouter la nouvelle div à la même div dans chaque .container_modal_stagiaires
  const modalStagiairesContainers = document.querySelectorAll(
    ".container_modal_stagiaires"
  );

  modalStagiairesContainers.forEach(function (container) {
    if (formationsList) {
      // Ajouter la nouvelle div de formation à chaque container correspondant
      const containerModalStagiairesLabelInput = container.querySelector(
        ".container_formations_label_input"
      );
      if (containerModalStagiairesLabelInput) {
        containerModalStagiairesLabelInput.appendChild(
          containerLabelInputFormation.cloneNode(true)
        );
      }
    }
  });

  // Vider l'input après ajout
  formationInputText.value = "";
});

// Ajouter un événement au clic du bouton "Supprimer formation"
formationButtonDelete.addEventListener("click", function () {
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
      const allMatchingDivs = document
        .querySelectorAll(`[id='${uniqueId}']`)
        .forEach(function (divToRemove) {
          divToRemove.closest(".container_label_input_formation").remove();
        });
    }
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
