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
  let tokenUser = localStorage.getItem("token");

  // Vérifier si le token existe dans le localStorage avant d'envoyer la requête
  if (tokenUser) {
    console.log("Token récupéré :", tokenUser);

    // Configurer et envoyer la requête POST pour enregistrer l'humeur de l'utilisateur
    fetch("/api/humeur", {
      method: "POST", // Définir la méthode de la requête HTTP (POST)
      headers: {
        "Content-Type": "application/json", // Spécifier que les données envoyées sont au format JSON
        Authorization: `Bearer ${tokenUser}`, // Ajouter le token dans l'en-tête pour authentification
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

// Récupérer l'ID de l'utilisateur depuis le localStorage
let idUser = localStorage.getItem("ID_User");

// Vérifier si l'ID existe
if (idUser) {
  console.log("ID utilisateur récupéré :", idUser);

  // Faire la requête fetch avec l'ID dans l'URL
  fetch("/api/utilisateurs/" + idUser) // Passer l'ID dans l'URL
    .then((response) => {
      // Vérifie si la réponse est ok (status 200-299)
      if (!response.ok) {
        throw new Error("Erreur réseau : " + response.status);
      }
      return response.json(); // On suppose que la réponse est en JSON
    })
    .then((data) => {
      // Vérifier si des historiques existent et récupérer le dernier
      if (data.historiques && data.historiques.length > 0) {
        // Récupérer la dernière humeur dans l'historique
        let derniereHumeur = data.historiques[data.historiques.length - 1].humeur;

        // Récupérer la date de création de l'historique
        let dateCreation = data.historiques[data.historiques.length - 1].dateCreation;

        // Créer un objet Date à partir de la date de création (en UTC)
        let date = new Date(dateCreation);

        // Convertir la date en heure de Paris (UTC+1 ou UTC+2 selon l'heure d'été)
        let options = { 
          timeZone: "Europe/Paris", 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric', 
          hour: '2-digit', 
          minute: '2-digit', 
          second: '2-digit',
          hour12: false
        };

        // Formater la date avec l'heure de Paris
        let dateParis = new Intl.DateTimeFormat('fr-FR', options).format(date);

        // Créer et afficher le nouveau message avec la dernière humeur et la date en heure de Paris
        const humeurScore = document.createElement("p");
        humeurScore.classList.add("msg_derniere_humeur");
        humeurScore.textContent = `Votre dernière humeur le ${dateParis} était de ${derniereHumeur}.`;

        // Ajouter le message au div
        divHumeur.appendChild(humeurScore);
      } else {
        console.log("Aucun historique trouvé.");
      }

      console.log(data); // Affiche les données dans la console
    })
    .catch((error) => {
      console.error("Erreur :", error); // Si une erreur survient, on l'affiche
    });
} else {
  console.log("Aucun ID trouvé dans le localStorage");
}
