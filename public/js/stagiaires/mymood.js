// Sélectionner les éléments du DOM nécessaires : slider, bouton, et lien
const slider = document.querySelector(".slider");
const moodButton = document.querySelector(".humeur_button");
const moodLinkSos = document.querySelector(".humeur_container_appel");
const divHumeur = document.querySelector(".humeur_container_button_appel");

// Écouter l'événement de clic sur le bouton pour envoyer la valeur du slider
moodButton.addEventListener("click", () => {
  const sliderValue = slider.value; // Récupérer la valeur actuelle du slider
  console.log(`Valeur du slider avec le button : ${sliderValue}`);

  // Récupérer le token de l'utilisateur depuis le localStorage
  let tokenUser = localStorage.getItem("tokenUser");

  // Vérifier si le token existe dans le localStorage avant d'envoyer la requête
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Configurer et envoyer la requête POST pour enregistrer l'humeur de l'utilisateur
    fetch("/api/humeur", {
      method: "POST", // Définir la méthode de la requête HTTP (POST)
      headers: {
        "Content-Type": "application/json", // Spécifier que les données envoyées sont au format JSON
        "Authorization": `Bearer ${tokenUser}`, // Ajouter le token dans l'en-tête pour authentification
      },
      body: JSON.stringify({
        score: sliderValue, // Inclure la valeur du slider dans le corps de la requête
      }),
    })
      .then((response) => response.json()) // Traiter la réponse du serveur au format JSON
      .then((data) => {
        console.log("Réponse de l'API:", data); // Afficher les données de la réponse

        // Supprimer le message précédent s'il existe
        const previousMessage = document.querySelector(".msg_ok_humeur");
        if (previousMessage) {
          previousMessage.remove();
        }

        // Créer et afficher le nouveau message
        const pMsgOk = document.createElement("p");
        pMsgOk.classList.add("msg_ok_humeur");
        pMsgOk.textContent = "Votre humeur a été envoyée.";
        divHumeur.appendChild(pMsgOk);
      })
      .catch((error) => {
        console.error("Erreur de requête:", error); // Gérer les erreurs liées à la requête fetch
      });
  } else {
    console.log("Aucun token trouvé dans le localStorage"); // Message si le token n'est pas trouvé
  }
});

// Écouter l'événement de clic sur le lien SOS pour envoyer une alerte
moodLinkSos.addEventListener("click", () => {
  let tokenUser = localStorage.getItem("tokenUser"); // Récupérer le token de l'utilisateur depuis le localStorage

  // Vérifier si le token existe dans le localStorage avant d'envoyer la requête
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Configurer et envoyer la requête POST pour générer une alerte
    fetch("/api/alertes", {
      method: "POST", // Définir la méthode de la requête HTTP (POST)
      headers: {
        "Content-Type": "application/json", // Spécifier que les données envoyées sont au format JSON
        "Authorization": `Bearer ${tokenUser}`, // Ajouter le token dans l'en-tête pour authentification
      },
      body: JSON.stringify({
        statut: "EN_COURS", // ID utilisateur (peut être remplacé selon l'implémentation)
      }),
    })
      .then((response) => response.json()) // Traiter la réponse du serveur au format JSON
      .then((data) => {
        console.log("Réponse du serveur :", data); // Afficher les données de la réponse

        // Supprimer le message précédent s'il existe
        const previousMessage = document.querySelector(".msg_ok_humeur");
        if (previousMessage) {
          previousMessage.remove();
        }

        // Créer et afficher le nouveau message
        const pMsgOk = document.createElement("p");
        pMsgOk.classList.add("msg_ok_humeur");
        pMsgOk.textContent = "Votre appel à l'aide a été envoyé.";
        divHumeur.appendChild(pMsgOk);
      })
      .catch((error) => {
        console.error("Erreur de la requête fetch :", error); // Gérer les erreurs liées à la requête fetch
      });
  } else {
    console.log("Aucun token trouvé dans le localStorage"); // Message si le token n'est pas trouvé
  }
});


