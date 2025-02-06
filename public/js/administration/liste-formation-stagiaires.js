// DECONNEXION
document
  .querySelector(".header_deconnexion")
  .addEventListener("click", function () {
    // Cacher la section .header_container_button
    document.querySelector(".header_container_button").style.display = "none";

    // Afficher la .header_deconnexion_alert
    document.querySelector(".header_deconnexion_alert").style.display = "flex";
  });

document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(1)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Valider
    localStorage.clear(); // Vider le localStorage
    window.location.href = "../../index.html"; // Rediriger vers index.html
  });

document
  .querySelector(".header_deconnexion_alert_valid:nth-of-type(2)")
  .addEventListener("click", function () {
    // Si l'utilisateur clique sur Annuler
    // Réafficher la section .header_container_button
    document.querySelector(".header_container_button").style.display = "flex";

    // Cacher la .header_deconnexion_alert
    document.querySelector(".header_deconnexion_alert").style.display = "none";
  });

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
  let tokenUser = localStorage.getItem("token");

  // Vérifier si un token est disponible dans le localStorage
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Faire une requête GET pour récupérer les formations
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
          const formationsLists = document.querySelectorAll(
            ".container_formations_label_input"
          );

          // Parcourir chaque élément où les formations seront affichées
          formationsLists.forEach((formationsList) => {
            // Vider la liste des formations avant de la remplir
            formationsList.innerHTML = "";

            // Parcourir chaque formation et créer les éléments correspondants
            data.forEach((formation) => {
              // Créer un conteneur pour chaque formation
              const containerLabelInputFormation =
                document.createElement("div");
              containerLabelInputFormation.classList.add(
                "container_label_input_formation"
              );

              // Créer un label pour afficher le nom de la formation
              const labelFormation = document.createElement("label");
              labelFormation.classList.add("formation_label");
              labelFormation.textContent = formation.nom;

              // Créer un champ de type checkbox pour chaque formation
              const inputFormation = document.createElement("input");
              inputFormation.classList.add("formation_input");
              inputFormation.type = "checkbox";
              inputFormation.id = formation.id; // Utiliser l'ID renvoyé par l'API
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

// Fonction pour supprimer les formations sélectionnées
formationButtonDelete.addEventListener("click", function () {
  // Sélectionner toutes les cases à cocher pour les formations
  const checkboxes = document.querySelectorAll(".formation_input:checked");

  // Vérifier s'il y a des formations sélectionnées
  if (checkboxes.length === 0) {
    alert("Aucune formation sélectionnée pour la suppression.");
    return;
  }

  // Récupérer le token de l'utilisateur depuis le localStorage
  let tokenUser = localStorage.getItem("token");

  if (!tokenUser) {
    console.log("Aucun token trouvé.");
    return;
  }

  // Afficher la div de confirmation de suppression
  confirmationDiv.style.display = "flex"; // Afficher la confirmation
  formationDiv.style.display = "none"; // Cacher la liste des formations pour éviter des actions en cours

  // Ajouter un événement pour valider la suppression
  const confirmationButton = document.querySelector(
    ".container_liste_formation_stagiaires_vali"
  );
  const cancelButton = document.querySelector(
    ".container_liste_formation_stagiaires_annul"
  );

  confirmationButton.addEventListener("click", function () {
    // Supprimer chaque formation sélectionnée
    checkboxes.forEach((checkbox) => {
      const formationId = checkbox.id; // L'ID de la formation cochée

      // Faire une requête DELETE pour chaque formation cochée
      fetch(`/api/cohortes/${formationId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${tokenUser}`, // Ajouter le token d'authentification
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Réponse après suppression :", data);

          // 1. Supprimer la formation de la liste des formations dans le DOM
          const formationElement = checkbox.closest(
            ".container_label_input_formation"
          );
          if (formationElement) {
            formationElement.remove();
          }

          // 2. Supprimer la formation de toutes les autres sections de la page (stagiaires, etc.)
          const allFormationElements = document.querySelectorAll(
            `input[type="checkbox"][id='${formationId}']`
          );
          allFormationElements.forEach((input) => {
            // Supprimer l'élément parent contenant la formation, basé sur l'ID
            const formationParentElement = input.closest(
              ".container_label_input_formation"
            );
            if (formationParentElement) {
              formationParentElement.remove();
            }
          });
        })
        .catch((error) => {
          console.error(
            "Erreur lors de la suppression de la formation :",
            error
          );
        });
    });
    // Fermer la confirmation après la suppression
    confirmationDiv.style.display = "none";
    formationDiv.style.display = "block"; // Réafficher la liste des formations

    // Recharger la page après la suppression
    window.location.reload();
  });

  // Ajouter un événement pour annuler la suppression
  cancelButton.addEventListener("click", function () {
    // Fermer la confirmation sans supprimer et réafficher la liste des formations
    confirmationDiv.style.display = "none";
    formationDiv.style.display = "block"; // Réafficher la liste des formations
  });
});

// Sélectionner les boutons Valider et Annuler formation
const modalValiderButtons = document.querySelectorAll(
  ".modal_stagiaires_valider"
);
const modalAnnulerButtons = document.querySelectorAll(
  ".modal_stagiaires_annuler"
);

// Fonction pour mettre à jour l'élément <details> avec la formation sélectionnée
function updateDetailsWithSelectedFormation(detailsElement) {
  const checkbox = detailsElement.querySelector(".formation_input:checked"); // Récupérer la checkbox sélectionnée
  const summary = detailsElement.querySelector("summary");

  // Si aucune checkbox n'est cochée, on ne modifie rien
  if (!checkbox) {
    summary.textContent = "Formation"; // Texte par défaut
    return;
  }

  // Récupérer la formation sélectionnée et mettre à jour le summary
  const selectedFormation = checkbox.previousElementSibling.textContent; // Nom de la formation associée

  // Mettre à jour le texte du <summary> avec la formation sélectionnée
  summary.textContent = selectedFormation;
}

// Ajouter les événements au clic sur chaque checkbox pour ne permettre qu'une seule sélection
document.querySelectorAll(".formation_input").forEach((checkbox) => {
  checkbox.addEventListener("change", function () {
    // Si une case est cochée, décocher toutes les autres
    if (checkbox.checked) {
      // On boucle sur toutes les autres checkboxes et on les décoche
      document.querySelectorAll(".formation_input").forEach((otherCheckbox) => {
        if (otherCheckbox !== checkbox && otherCheckbox.checked) {
          otherCheckbox.checked = false;
        }
      });
    }
  });
});

// Ajouter les événements au clic sur chaque bouton Valider
modalValiderButtons.forEach((validerButton) => {
  validerButton.addEventListener("click", function () {
    const containerModal = validerButton.closest(".container_modal_stagiaires"); // Trouver le parent modal
    const detailsElement = containerModal.closest(
      ".container_stagiaires_details"
    ); // Trouver le <details> parent
    updateDetailsWithSelectedFormation(detailsElement);
    detailsElement.removeAttribute("open"); // Fermer le <details>
  });
});

// Ajouter les événements au clic sur chaque bouton Annuler
modalAnnulerButtons.forEach((annulerButton) => {
  annulerButton.addEventListener("click", function () {
    const containerModal = annulerButton.closest(".container_modal_stagiaires"); // Trouver le parent modal
    const detailsElement = containerModal.closest(
      ".container_stagiaires_details"
    ); // Trouver le <details> parent
    detailsElement.removeAttribute("open"); // Fermer le <details> sans rien faire
  });
});

// Sélectionner les éléments
const detailsElement = document.querySelector(
  ".container_stagiaires_details_role"
);
const validateButton = document.querySelector(".modal_stagiaires_valider_role");
const cancelButton = document.querySelector(".modal_stagiaires_annuler_role");
const checkboxes = document.querySelectorAll(".modal_input_role");
const summaryElement = detailsElement.querySelector("summary");

// Ajouter un événement au clic du bouton "Ajouter stagiaire"
formationButtonAddIntern.addEventListener("click", function () {
  // Récupérer les valeurs des champs "prénom", "nom" et "email"
  const userFormationInputFirstName = formationInputFirstName.value;
  const userFormationInputName = formationInputName.value;
  const userFormationInputEmail = formationInputEmail.value;

  // Vérifier si le prénom a été renseigné
  if (!userFormationInputFirstName) {
    alert("Le prénom est requis !");
    return;
  }

  // Vérifier si le nom a été renseigné
  if (!userFormationInputName) {
    alert("Le nom est requis !");
    return;
  }

  // Vérifier si l'email a été renseigné
  if (!userFormationInputEmail) {
    alert("L'email est requis !");
    return;
  }

  // Vérifier quel rôle est sélectionné
  const selectedRole = getSelectedRole();
  if (!selectedRole) {
    alert("Un rôle est requis !");
    return;
  }

  // Récupérer le token depuis le localStorage
  let tokenUser = localStorage.getItem("token");
  if (!tokenUser) {
    alert("Token d'authentification manquant !");
    return;
  }
  
  function getCheckboxId() {
    // Récupérer toutes les cases à cocher avec la classe 'formation_input'
    let checkboxes = document.getElementsByClassName("formation_input");

    // Initialiser un tableau pour stocker les IDs des cases à cocher sélectionnées
    let groupes = [];

    // Boucler sur toutes les cases à cocher pour vérifier si elles sont cochées
    for (let i = 0; i < checkboxes.length; i++) {
      if (checkboxes[i].checked) {
        groupes.push(checkboxes[i].id); // Ajouter l'ID de la case cochée
      }
    }

    // Vérifier si des cases ont été sélectionnées
    if (groupes.length === 0) {
      alert("Veuillez sélectionner au moins un groupe");
      return; // Arrêter la fonction si aucun groupe n'est sélectionné
    }

    // Préparer les données à envoyer dans le corps de la requête
    const data = {
      prenom: userFormationInputFirstName,
      nom: userFormationInputName,
      email: userFormationInputEmail,
      role: selectedRole, // Ajouter le rôle sélectionné
      groupes: groupes, // Les groupes (IDs des cases à cocher sélectionnées)
    };

    // Faire la requête POST pour envoyer les données
    fetch("/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${tokenUser}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de l'ajout du stagiaire");
        }
        return response.json();
      })
      .then((responseData) => {
        console.log("Stagiaire ajouté avec succès :", responseData);
        alert("Stagiaire ajouté avec succès"); // Message de succès
        location.reload(); // Recharger la page après un ajout réussi
      })
      .catch((error) => {
        console.error("Une erreur est survenue :", error);
        alert("Une erreur est survenue lors de l'ajout du stagiaire."); // Message d'erreur pour l'utilisateur
      });
  }

  getCheckboxId(); // Appeler cette fonction lorsque tu veux envoyer les données

  // Effectuer la requête POST avec fetch
});

// Fonction pour récupérer les cases à cocher sélectionnées (une seule case)
function getSelectedRole() {
  let selectedRole = null;
  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      // Vérifier quel rôle correspond à chaque case
      switch (checkbox.id) {
        case "checkboxEtudiant": // Remplacez par l'id de votre checkbox pour ROLE_ETUDIANT
          selectedRole = "ROLE_ETUDIANT";
          break;
        case "checkboxSuperviseur": // Remplacez par l'id de votre checkbox pour ROLE_SUPERVISEUR
          selectedRole = "ROLE_SUPERVISEUR";
          break;
        case "checkboxAdmin": // Remplacez par l'id de votre checkbox pour ROLE_ADMIN
          selectedRole = "ROLE_ADMIN";
          break;
        default:
          break;
      }
    }
  });
  return selectedRole;
}

// Lorsque le bouton "Valider" est cliqué
validateButton.addEventListener("click", function () {
  const selectedRole = getSelectedRole();
  if (selectedRole) {
    summaryElement.textContent = selectedRole; // Mettre à jour le texte avec le rôle sélectionné
  } else {
    summaryElement.textContent = "Aucun rôle sélectionné"; // Texte par défaut si aucune case n'est cochée
  }

  detailsElement.removeAttribute("open"); // Ferme le <details>
});

// Lorsque le bouton "Annuler" est cliqué
cancelButton.addEventListener("click", function () {
  detailsElement.removeAttribute("open"); // Ferme le <details> sans modifier le texte
});

// Affichier les stagiaires
let tokenUser = localStorage.getItem("token");

if (!tokenUser) {
  console.error("Token non trouvé dans le localStorage");
} else {
  fetch("/api/utilisateurs", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${tokenUser}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Réponse réseau non valide");
      }
      return response.json();
    })
    .then((data) => {
      if (Array.isArray(data)) {
        const containerListesBorder = document.querySelector(
          ".container_listes_border"
        );
        console.log(data);

        // Boucle pour parcourir chaque utilisateur
        data.forEach((user) => {
          // Créer un conteneur pour l'utilisateur
          const userDiv = document.createElement("div");
          userDiv.classList.add("container_listes");
          userDiv.setAttribute("data-user-id", user.id); // Ajouter un attribut avec l'id de l'utilisateur

          // Créer les éléments d'entrée (prénom, nom)
          const firstNameInput = document.createElement("input");
          firstNameInput.classList.add("input_firstname");
          firstNameInput.type = "text";
          firstNameInput.id = "first-name";
          firstNameInput.name = "first-name";
          firstNameInput.placeholder = "Prénom";
          firstNameInput.value = user.prenom; // Ajouter le prénom de l'utilisateur

          const nameInput = document.createElement("input");
          nameInput.classList.add("input_name");
          nameInput.type = "text";
          nameInput.id = "name";
          nameInput.name = "name";
          nameInput.placeholder = "Nom";
          nameInput.value = user.nom; // Ajouter le nom de l'utilisateur

          // Ajouter les éléments d'entrée à la div de l'utilisateur
          userDiv.appendChild(firstNameInput);
          userDiv.appendChild(nameInput);

          // Ajouter les groupes et rôles (reste inchangé)
          const details = document.createElement("details");
          details.classList.add("container_stagiaires_details");
          const summary = document.createElement("summary");
          summary.textContent = user.groupes[0]?.nom || "Aucun groupe";
          details.appendChild(summary);

          const containerModal = document.createElement("div");
          containerModal.classList.add("container_modal_stagiaires");
          const buttonValidate = document.createElement("button");
          buttonValidate.classList.add("modal_stagiaires_valider");
          buttonValidate.innerHTML =
            '<span class="material-symbols-outlined"> check </span>Valider';
          const buttonCancel = document.createElement("button");
          buttonCancel.classList.add("modal_stagiaires_annuler");
          buttonCancel.innerHTML =
            '<span class="material-symbols-outlined"> close </span>Annuler';
          containerModal.appendChild(buttonValidate);
          containerModal.appendChild(buttonCancel);
          details.appendChild(containerModal);
          userDiv.appendChild(details);

          // Ajouter la section des rôles (reste inchangé)
          const detailsRoles = document.createElement("details");
          detailsRoles.classList.add("container_stagiaires_details_role");
          const summaryRole = document.createElement("summary");
          summaryRole.textContent = "Rôles";
          // Exemple de correspondance des rôles selon les valeurs renvoyées par la base de données
          const rolesMapping = {
            ROLE_ETUDIANT: "Étudiant(e)",
            ROLE_SUPERVISEUR: "Superviseur",
            ROLE_ADMIN: "Administrateur",
            // Ajouter d'autres rôles ici si nécessaire
          };

          // Vérification de ce que contient user.roles
          console.log("Roles:", user.roles);

          // Si user.roles est un tableau d'identifiants (par exemple ['ROLE_ETUDIANT', 'ROLE_SUPERVISEUR']), mappage des rôles
          let roleName = "Aucun rôle";
          if (Array.isArray(user.roles) && user.roles.length > 0) {
            // Transformer chaque rôle en nom
            roleName = user.roles
              .map((role) => rolesMapping[role] || "Inconnu")
              .join(", ");
          } else if (user.roles) {
            // Si user.roles n'est pas un tableau mais une seule valeur
            roleName = rolesMapping[user.roles] || "Inconnu";
          }

          // Afficher les rôles dans le résumé
          summaryRole.textContent = roleName;

          detailsRoles.appendChild(summaryRole);
          const containerModalRole = document.createElement("div");
          containerModalRole.classList.add("container_modal_stagiaires_role");

          const roles = user.roles || [];
          const rolesList = [
            { name: "Administrateur", id: "checkboxAdmin" },
            { name: "Superviseur", id: "checkboxSuperviseur" },
            { name: "Étudiant(e)", id: "checkboxEtudiant" },
          ];

          rolesList.forEach((role) => {
            const roleContainer = document.createElement("div");
            roleContainer.classList.add(
              "container_modal_stagiaires_label_input_role"
            );
            const label = document.createElement("label");
            label.classList.add("modal_label_role");
            label.textContent = role.name;

            const checkbox = document.createElement("input");
            checkbox.classList.add("modal_input_role");
            checkbox.type = "checkbox";
            checkbox.id = role.id;
            checkbox.name = role.name;

            if (roles.includes(role.name)) {
              checkbox.checked = true;
            }

            roleContainer.appendChild(label);
            roleContainer.appendChild(checkbox);
            containerModalRole.appendChild(roleContainer);
          });

          const buttonValidateRole = document.createElement("button");
          buttonValidateRole.classList.add("modal_stagiaires_valider_role");
          buttonValidateRole.innerHTML =
            '<span class="material-symbols-outlined"> check </span>Valider';
          const buttonCancelRole = document.createElement("button");
          buttonCancelRole.classList.add("modal_stagiaires_annuler_role");
          buttonCancelRole.innerHTML =
            '<span class="material-symbols-outlined"> close </span>Annuler';
          containerModalRole.appendChild(buttonValidateRole);
          containerModalRole.appendChild(buttonCancelRole);
          detailsRoles.appendChild(containerModalRole);
          userDiv.appendChild(detailsRoles);

          // Créer l'input pour l'email
          const emailInput = document.createElement("input");
          emailInput.classList.add("input_email");
          emailInput.type = "email";
          emailInput.id = "email";
          emailInput.placeholder = "Adresse mail";
          emailInput.value = user.email; // Ajouter l'email de l'utilisateur

          userDiv.appendChild(emailInput);

          // Créer l'input pour le checkbox
          const checkboxInput = document.createElement("input");
          checkboxInput.classList.add("liste_input_check");
          checkboxInput.type = "checkbox";
          checkboxInput.id = "scales";
          checkboxInput.name = "scales";

          userDiv.appendChild(checkboxInput);

          // Ajouter la div de l'utilisateur au conteneur
          containerListesBorder.appendChild(userDiv);

          // Sélectionner le bouton supprimer déjà existant
          const deleteButton = document.querySelector(
            ".container_listes_button"
          );

          // Activer/désactiver le bouton de suppression en fonction de la case cochée
          checkboxInput.addEventListener("change", (event) => {
            if (event.target.checked) {
              deleteButton.disabled = false; // Activer le bouton
              deleteButton.setAttribute("data-user-id", user.id); // Lier l'utilisateur au bouton
            } else {
              // Désactiver le bouton si aucune case n'est cochée
              deleteButton.disabled = !document.querySelectorAll(
                ".liste_input_check:checked"
              ).length;
            }
          });

          // Ajouter l'événement de suppression au bouton
          deleteButton.addEventListener("click", () => {
            const userIdToDelete = deleteButton.getAttribute("data-user-id");

            if (userIdToDelete) {
              fetch(`/api/utilisateurs/${userIdToDelete}`, {
                method: "DELETE",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${tokenUser}`,
                },
              })
                .then((response) => {
                  if (response.ok) {
                    // Supprimer l'utilisateur du DOM
                    const userDivToDelete = document.querySelector(
                      `[data-user-id="${userIdToDelete}"]`
                    );
                    if (userDivToDelete) {
                      userDivToDelete.remove();
                    }
                    console.log(`Utilisateur ${userIdToDelete} supprimé`);

                    // Recharger la page après suppression
                    location.reload(); // Recharger la page pour refléter les changements
                  } else {
                    console.error(
                      "Erreur lors de la suppression de l'utilisateur"
                    );
                  }
                })
                .catch((error) => {
                  console.error("Erreur de requête :", error);
                });
            }
          });
        });
      } else {
        console.error("Les données ne sont pas sous forme de tableau.");
      }
    })
    .catch((error) => {
      console.error("Il y a eu un problème avec la requête fetch :", error);
    });
}
